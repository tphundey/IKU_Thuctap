import { useState, useEffect } from 'react';
import axios from "axios";
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './thanhtoan.css';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../AuthFirebase/auth';

const Thanhtoan = () => {
    const navigate = useNavigate();
    const [showDiv, setShowDiv] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [cartItemsFromAPI, setCartItemsFromAPI] = useState([]);
    const userProfile = JSON.parse(localStorage.getItem("profile") || "{}");
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0); // State để lưu số tiền giảm giá
    const [isDiscountApplied, setIsDiscountApplied] = useState(false); // State để kiểm tra xem mã giảm giá đã được áp dụng hay chưa
    const [voucherCode, setVoucherCode] = useState("");
    const [email, setEmail] = useState([]);
    const [userCart, setUserCart] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            if (currentUser) {
                setUser(currentUser);
                setEmail(currentUser.email)
            } else {
                setUser(null);;
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Lấy dữ liệu giỏ hàng từ API
        axios.get("http://localhost:3000/cart")
            .then((response) => {
                const cartItems = response.data;

                // Lọc giỏ hàng dựa trên email
                const filteredCart = cartItems.find((cartItem) => cartItem.email === email);


                if (filteredCart) {
                    setCartItemsFromAPI(userCart);
                    setUserCart(filteredCart.products);
                    // Calculate total price and items
                    const total = filteredCart.products.reduce((acc, item) => {
                        return acc + item.quantity * item.product.price;
                    }, 0);

                    setTotalPrice(total);
                }
            })
            .catch((error) => {
                console.error("Error fetching cart data from the API:", error);
                // Handle the error as needed
                setIsLoading(false);
            });
    }, [email]);

    useEffect(() => {
        if (voucherCode === "GIAMGIA50") {
            setDiscountAmount(50); // Nếu mã giảm giá hợp lệ, giảm 50 trong tổng số tiền
            setIsDiscountApplied(true);
        } else {
            setDiscountAmount(0); // Nếu mã giảm giá không hợp lệ, không giảm tiền
            setIsDiscountApplied(false);
        }
    }, [voucherCode]);

    const onSubmitVoucherForm = (data: any) => {
        setVoucherCode(data.voucher);
    };

    const wardsByCity = {
        'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Cầu Giấy', 'Hai Bà Trưng', 'Hoàng Mai'],
        'Hồ Chí Minh': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6'],
        // Thêm dữ liệu cho các thành phố/huyện khác ở đây
    };

    const cities = [
        { value: 'Hà Nội', label: 'Hà Nội' },
        { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
        // Thêm các tùy chọn khác ở đây
    ];

    const { handleSubmit, control } = useForm();
    const [selectedCity, setSelectedCity] = useState(cities[0]); // Khởi tạo với thành phố đầu tiên
    const [wardsOptions, setWardsOptions] = useState([]); // Lưu trữ các lựa chọn cho "Xã/Phường"

    // Hàm được gọi khi chọn một thành phố
    const handleCityChange = (selectedCity: any) => {
        setSelectedCity(selectedCity);
        const wards = wardsByCity[selectedCity?.value] || [];
        setWardsOptions(
            wards.map((ward: any) => ({ value: ward, label: ward }))
        );
    };


    const [paymentMethod, setPaymentMethod] = useState('cash');
    const handlePaymentMethodChange = (event: any) => {
        setPaymentMethod(event.target.value);
    };



    const onSubmit = (data: any) => {

        if (data.voucher === "GIAMGIA50") {
            setDiscountAmount(50); // Nếu mã giảm giá hợp lệ, giảm 50 trong tổng số tiền
            setIsDiscountApplied(true);
        } else {
            setDiscountAmount(0); // Nếu mã giảm giá không hợp lệ, không giảm tiền
            setIsDiscountApplied(false);
        }
        const orderData = {
            name: data.name,
            email: email,
            phone: data.phone,
            city: data.city.value,
            ward: data.ward?.value || '',
            address: data.address,
            voucher: data.voucher,
            paymentMethod: paymentMethod,
            cartItems: userCart.map((cartItem) => ({
                product: {
                    name: cartItem.product.name,
                    price: cartItem.product.price,
                    img: cartItem.product.img,
                    categoriesId: cartItem.product.categoriesId,
                    color: cartItem.product.color,
                    quantity: cartItem.product.quantity,
                    info: cartItem.product.info,
                    id: cartItem.product.id,
                },
                quantity: cartItem.quantity,
            })),
            totalPrice: totalPrice - (isDiscountApplied ? discountAmount : 0),
            status: "Đã đặt hàng",
        };

        axios.post("http://localhost:3000/hoadon", orderData)
            .then((response) => {
                console.log("Đặt hàng thành công:", response.data);

                // After a successful order, remove the user's cart data based on their email
                const email = data.email;
                axios.delete(`http://localhost:3000/cart?email=${email}`)
                    .then(() => {
                        console.log(`Cart data cleared for email: ${email}`);
                    })
                    .catch((error) => {
                        console.error(`Error clearing cart data for email: ${email}`, error);
                        // Handle the error as needed
                    });

                // Clear the userCart state
                setUserCart([]);
                toast.success('Đặt hàng thành công!', {
                    className: 'thongbaothanhcong',
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000, // Thời gian tự động biến mất sau 2 giây
                });
                //   navigate('/hoadon');
            })
            .catch((error) => {
                console.error("Lỗi khi đặt hàng:", error);
                // Xử lý lỗi và hiển thị thông báo cho người dùng nếu cần
            });
    };

    return (
        <div className="container2">
            <div className='layout'>
                <div className="left">
                    <h2>THANH TOÁN</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Controller

                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input {...field} type="text" placeholder="Họ và tên" />}
                        />
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input {...field} type="email" placeholder="Email" />}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input {...field} type="tel" placeholder="Số điện thoại" />}
                        />
                        {/* ...Các trường input khác */}
                        <Controller
                            name="city"
                            control={control}
                            defaultValue={cities[0]} // Khởi tạo với thành phố đầu tiên
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={cities}
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    isClearable
                                    placeholder="Thành phố/Huyện"
                                />
                            )}
                        /> <br />
                        <Controller
                            name="ward"
                            control={control}
                            defaultValue=""
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={wardsOptions} // Thiết lập các lựa chọn động dựa trên thành phố được chọn
                                    isClearable
                                    placeholder="Xã/Phường"
                                />
                            )}
                        /><br />
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input {...field} type="text" placeholder="Số nhà và đường" />}
                        />
                        <br />
                        <div>
                            <h2>Phương thức thanh toán</h2>
                            <select className='phuongthuc' value={paymentMethod} onChange={handlePaymentMethodChange}>
                                <option value="cash">Tiền mặt</option>
                                <option value="transfer">Chuyển khoản</option>
                            </select>

                            {paymentMethod === 'cash' ? (
                                <div>
                                    <p>Thanh toán tiền mặt với Shipper</p>
                                </div>
                            ) : (
                                <div>
                                    {/* Thêm nội dung của tab thanh toán chuyển khoản ở đây */}
                                    <img width={'320px'} src='https://b-f10-zpcloud.zdn.vn/3712333603563929973/1df2db0055f486aadfe5.jpg'></img>
                                </div>
                            )}
                        </div>
                        <button style={{ height: 40 }} type="submit">Buy</button>
                    </form>
                </div>
                <div className="right">
                    <div className="listcart">
                        <div className="listcart">
                            {userCart.map((productItem, index) => (
                                <div className="cart" key={index}>
                                    <div className="imgcart">
                                        <img src={productItem.product.img} alt="" />
                                    </div>
                                    <div className="thongtin">
                                        <div className="tencart">{productItem.product.name}</div>
                                        <div className="carttt">
                                            <div className="soluong">{productItem.quantity} x</div>
                                            <div className="giatien">{productItem.product.price}.000đ</div>
                                        </div>
                                        {/* <button
            className='removecart'
            onClick={() => handleRemoveProduct(userCartItem.email, productItem.product.id)}
          >
            Xóa
          </button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="tongtien">
                        <b>Tạm tính:</b> {totalPrice - (isDiscountApplied ? discountAmount : 0)}.000đ
                    </div>
                </div>
            </div>
            {/* Component ToastContainer để hiển thị thông báo */}
            <ToastContainer />
        </div>
    );
};

export default Thanhtoan;
