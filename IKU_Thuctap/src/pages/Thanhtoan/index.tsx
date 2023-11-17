import { useState, useEffect } from 'react';
import axios from "axios";
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './thanhtoan.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../components/AuthFirebase/auth';
import { Spin } from 'antd';
const Thanhtoan = () => {
    const navigate = useNavigate();
    const [cartItemsFromAPI, setCartItemsFromAPI] = useState([]);
    const userProfile = JSON.parse(localStorage.getItem("profile") || "{}");
    const [totalPrice, setTotalPrice] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);
    const [voucherCode, setVoucherCode] = useState("");
    const [email, setEmail] = useState([]);
    const [userCart, setUserCart] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [voucher, setVoucher] = useState('');
    const [voucherError, setVoucherError] = useState('');

    const currentDate = new Date().toISOString().split('T')[0];
    const handleApplyVoucher = () => {
        if (voucher === 'GIAMGIA20') {
            setDiscountAmount(totalPrice * 0.2);
            setIsDiscountApplied(true);
            setVoucherError('');
        } else {
            setVoucherError('Mã giảm giá không hợp lệ');
            setIsDiscountApplied(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            if (currentUser) {
                setUser(currentUser);
                setEmail(currentUser.email)
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3000/cart")
            .then((response) => {
                const cartItems = response.data;
                const filteredCart = cartItems.find((cartItem: any) => cartItem.email === email);

                if (filteredCart) {
                    setCartItemsFromAPI(userCart);
                    setUserCart(filteredCart.products);
                    const total = filteredCart.products.reduce((acc: any, item: any) => {
                        return acc + item.quantity * item.product.price;
                    }, 0);

                    setTotalPrice(total);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.error("Error fetching cart data from the API:", error);
                setIsLoading(false);
            });
    }, [email]);

    useEffect(() => {
        if (voucherCode === "GIAMGIA50") {
            setDiscountAmount(50);
            setIsDiscountApplied(true);
        } else {
            setDiscountAmount(0);
            setIsDiscountApplied(false);
        }
    }, [voucherCode]);

    const wardsByCity = {
        'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Đống Đa', 'Cầu Giấy', 'Hai Bà Trưng', 'Hoàng Mai'],
        'Hồ Chí Minh': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6'],
    };

    const cities = [
        { value: 'Hà Nội', label: 'Hà Nội' },
        { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
    ];

    const { handleSubmit, control } = useForm();
    const [selectedCity, setSelectedCity] = useState(cities[0]);
    const [wardsOptions, setWardsOptions] = useState([]);

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

    const postOrderPaymentStatus = async (orderId: any, paymentStatus: any) => {
        try {
            const response = await axios.patch(`http://localhost:3000/hoadon/${orderId}`, { paymentStatus });
            console.log("Payment status updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating payment status:", error);
        }
    };

    const onSubmit = async (data: any) => {
        if (data.voucher === "GIAMGIA50") {
            setDiscountAmount(50);
            setIsDiscountApplied(true);
        } else {
            setDiscountAmount(0);
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
            date: currentDate,
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
            totalPrice: totalPrice - discountAmount,
            status: "Đã đặt hàng",
        };

        try {
            const orderResponse = await axios.post("http://localhost:3000/hoadon", orderData);
            const orderId = orderResponse.data.id;

            localStorage.setItem("orderId", orderId);
            console.log(totalPrice)

            await axios.post("http://localhost:3000/saveOrder", { orderId, amount: totalPrice - (isDiscountApplied ? discountAmount : 0) });

            if (orderResponse.status === 201) {
                await postOrderPaymentStatus(orderId, "Chưa thanh toán");

                const cartResponse = await axios.get(`http://localhost:3000/cart?email=${email}`);
                const userCart = cartResponse.data.find(cart => cart.email === email);

                if (userCart && userCart.id) {
                    await axios.patch(`http://localhost:3000/cart/${userCart.id}`, { products: [] });
                    setUserCart([]);
                    setTotalPrice(0);
                    toast.success('Giỏ hàng đã được xóa sau khi thanh toán thành công.', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 3000,
                    });
                }
            }
            if (paymentMethod === 'cash') {
                navigate('/');
            } else {
                window.location.href = 'http://localhost:3000/order';
            }
        } catch (error) {
            console.error("Lỗi khi xử lý đặt hàng hoặc xóa giỏ hàng:", error);
            toast.error('Lỗi khi đặt hàng hoặc xóa giỏ hàng.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            });
        }
    };

    const handleRemoveProduct = (productId: any) => {
        const updatedCartItems = userCart.filter((item) => item.product.id !== productId);

        setUserCart(updatedCartItems);

        const newTotal = updatedCartItems.reduce((acc, item) => {
            return acc + item.quantity * item.product.price;
        }, 0);

        setTotalPrice(newTotal);
        axios.delete(`http://localhost:3000/cart/${userProfile.email}/products/${productId}`)
            .then((response) => {

            })
            .catch((error) => {
                console.error("Error removing product from cart:", error);
            });
    };

    if (isLoading) {
        return (
            <Spin
                size="large"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                }}
            />
        );
    }
    return (
        <div>
            <div className="container2 fordesktop">
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
                            <Controller
                                name="voucher"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <div>
                                        <input {...field} type="text" placeholder="Nhập mã giảm giá" value={voucher} onChange={(e) => setVoucher(e.target.value)} />
                                        <button type="button" className='text-blue-500; font-bold' onClick={handleApplyVoucher}>Áp dụng mã giảm giá</button>
                                        {voucherError && <p>{voucherError}</p>}
                                    </div>
                                )}
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
                                        <p className='text-red-500'>Bạn sẽ được chuyển tới trang thanh toán. Mọi vấn đề về sai số dư chuyển khoản hãy liên hệ 0878571203 để được xử lý !</p>
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
                                        <div className="thongtinss">
                                            <div className="tencart">{productItem.product.name}</div>
                                            <div className="carttt">
                                                <div className="soluong">{productItem.quantity} x</div>
                                                <div className="giatien">{productItem.product.price}.000đ</div>
                                            </div>
                                            <button
                                                className='removecart'
                                                onClick={() => handleRemoveProduct(productItem.product.id)}
                                            >
                                                Xóa
                                            </button>

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
            <div className="thanhtoan-mb formobile">
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
                            <Controller
                                name="voucher"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <div>
                                        <input {...field} type="text" placeholder="Nhập mã giảm giá" value={voucher} onChange={(e) => setVoucher(e.target.value)} />
                                        <button type="button" className='text-blue-500; font-bold' onClick={handleApplyVoucher}>Áp dụng mã giảm giá</button>
                                        {voucherError && <p>{voucherError}</p>}
                                    </div>
                                )}
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
                                        <p className='text-red-500'>Bạn sẽ được chuyển tới trang thanh toán. Vui lòng nhập đúng số tiền tương ứng thanh toán. Mọi vấn đề về sai số dư chuyển khoản hãy liên hệ 0878571203 để được xử lý !</p>
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
                                        <div className="thongtinss">
                                            <div className="tencart">{productItem.product.name}</div>
                                            <div className="carttt">
                                                <div className="soluong">{productItem.quantity} x</div>
                                                <div className="giatien">{productItem.product.price}.000đ</div>
                                            </div>
                                            <button
                                                className='removecart'
                                                onClick={() => handleRemoveProduct(productItem.product.id)}
                                            >
                                                Xóa
                                            </button>

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
        </div>
    );
};

export default Thanhtoan;
