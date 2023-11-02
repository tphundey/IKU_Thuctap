import "./ProductDetail.css";
import { useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { addToCart, updateCartItem } from "@/actions/cart";
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from 'antd';
import { Rate } from 'antd';
import { Button, Form, Input } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../AuthFirebase/auth';

interface Product {
  id: number;
  name: string;
  price: number;
  color: string;
  info: string;
}
interface CartItem {
  product: Product;
  quantity: number;
  userProfile: any;
}
const ProductDetail = () => {
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(3);
  const { id } = useParams<{ id: number }>();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [user, setUser] = useState(null);
  console.log(user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const formRef = React.useRef<FormInstance>(null);
  const onReset = () => {
    formRef.current?.resetFields();
  };
  useEffect(() => {
    getProductById(id);
  }, [id]);



  const getProductById = async (id: any) => {
    try {
      const response = await axios.get(`http://localhost:3000/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    }
  };



  // Hàm tính số điểm trung bình dựa trên danh sách đánh giá
  const calculateAverageRating = (reviews: any) => {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };


  useEffect(() => {
    axios.get(`http://localhost:3000/Reviews?bookId=${id}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy đánh giá:', error);
      });
  }, [id]);


  useEffect(() => {

    axios.get(`http://localhost:3000/Reviews?bookId=${id}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy đánh giá:', error);
      });
  }, [id]);

  if (!product) {
    return <div>Đang tải...</div>;
  }
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < 5) {
      setQuantity(quantity + 1);
    }
  }
  const checkEmailAlreadyReviewed = async (email: any, id: any) => {
    try {
      const response = await axios.get(`http://localhost:3000/Reviews?email=${email}&bookId=${id}`);
      return response.data.length > 0;
    } catch (error) {
      console.error('Lỗi khi kiểm tra review:', error);
      return true; // Trả về true để đảm bảo rằng không thể post lần thứ hai trong trường hợp xảy ra lỗi.
    }
  };

  const onFinish = async (values: any) => {

    if (!user) {
      toast.error('Bạn cần đăng nhập trước', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      onReset()
      return;
    }
    const email = user.email;
    const name = user.displayName;
    const img = user.photoURL;
    // Kiểm tra xem email đã post review cho cuốn sách này chưa
    const emailAlreadyReviewed = await checkEmailAlreadyReviewed(email, id);

    if (emailAlreadyReviewed) {
      toast.error('Bạn chỉ được đánh giá 1 lần).', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const bookIdNumber = Number(id);

    const reviewData = {
      bookId: bookIdNumber,
      email: email,
      name: name,
      img: img,
      rating: value,
      comment: values.note,
    };

    // Gửi dữ liệu lên API
    axios.post('http://localhost:3000/Reviews', reviewData)
      .then((response) => {
        onReset();
        // Update the reviews state with the new review data
        setReviews((prevReviews) => [...prevReviews, reviewData]);

        // Update the average rating state with the newly calculated average
        const newAverageRating = calculateAverageRating([...prevReviews, reviewData]);
        setAverageRating(newAverageRating);

      })
  };


  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Bạn cần đăng nhập trước', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
  
    const email = user.email;
  
    // Kiểm tra giỏ hàng của người dùng dựa trên email
    axios.get(`http://localhost:3000/cart?email=${email}`)
      .then((response) => {
        const cartItem = {
          product: product,
          quantity: quantity,
        };
  
        if (response.data.length > 0) {
          // Người dùng đã có giỏ hàng, kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
          const existingCart = response.data[0];
          const existingProductIndex = existingCart.products.findIndex((item) => item.product.id === product.id);
  
          if (existingProductIndex !== -1) {
            // Sản phẩm đã tồn tại, cộng thêm quantity vào sản phẩm đã có
            existingCart.products[existingProductIndex].quantity += quantity;
          } else {
            // Sản phẩm chưa tồn tại, thêm sản phẩm mới vào mảng sản phẩm
            existingCart.products.push(cartItem);
          }
  
          // Cập nhật giỏ hàng bằng cách PUT dữ liệu đã thay đổi
          axios.put(`http://localhost:3000/cart/${existingCart.id}`, existingCart)
            .then(() => {
              toast.success('Sản phẩm đã được thêm vào giỏ hàng!', {
                className: 'thongbaothanhcong',
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
              });
              setTimeout(() => {
                navigate('/thanhtoan');
              }, 3000);
            })
            .catch((error) => {
              toast.error('Lỗi khi cập nhật giỏ hàng', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
              });
            });
        } else {
          // Người dùng chưa có giỏ hàng, tạo một giỏ hàng mới cho họ
          const newCart = {
            email: email,
            products: [cartItem],
          };
  
          // Thêm giỏ hàng mới vào API
          axios.post('http://localhost:3000/cart', newCart)
            .then(() => {
              toast.success('Sản phẩm đã được thêm vào giỏ hàng!', {
                className: 'thongbaothanhcong',
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
              });
              setTimeout(() => {
                navigate('/thanhtoan');
              }, 3000);
            })
            .catch((error) => {
              toast.error('Lỗi khi tạo giỏ hàng mới', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
              });
            });
        }
      })
      .catch((error) => {
        toast.error('Lỗi khi kiểm tra giỏ hàng', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
      });
  };
  

  return (
    <div className="container">
      <Breadcrumb style={{ backgroundColor: 'white', marginTop: 7 }}
        items={[
          {
            title: 'Trang chủ',
          },
          {
            title: <a href="">Sản phẩm</a>,
          },
          {
            title: <p>{product.name}</p>,
          },
        ]}
      />

      <div className="product_detail">
        <div className="product_detail-info">
          <div className="detail_info-left">
            <div className="img-primary">
              <img src="https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/ableson2.jpg" alt="" />
            </div>
          </div>
          <div className="detail_info-right">
            <div className="info-top">
              <div className="name">{product.name}</div> <br />
              <div className="price">{product.price}.000₫</div>
              <div className="mt-5">
                <p>Danh mục: 200CK032</p>
                <p>Tác giả: Kim loại</p>
                <p>Số trang: {product.color}</p>
                <p>Ngày phát hành: {product.info}</p>
              </div>
              <div className="ship">
                Miễn phí giao hàng từ 500k ( vận chuyển 3 - 5 ngày )
              </div>
              <div className="input">
                <button className="btn_quantily down" onClick={handleDecrease}>-</button>
                <input defaultValue={1} min={1} max={5} type="number" className="input_quantily" value={quantity} />
                <button className="btn_quantily up" onClick={handleIncrease}>+</button>
              </div>
              <div className="add_cart">
                <button onClick={handleAddToCart}>Thêm Vào Giỏ Hàng</button>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
      <h2 className="font-bold text-xl mb-10">Thông tin chi tiết</h2>
      <p>Android is an open source mobile phone platform based on the Linux operating system and developed by the Open Handset Alliance, a consortium of over 30 hardware, software and telecom companies that focus on open standards for mobile devices. Led by search giant, Google, Android is designed to deliver a better and more open and cost effective mobile experience.    Unlocking Android: A Developer's Guide provides concise, hands-on instruction for the Android operating system and development tools. This book teaches important architectural concepts in a straightforward writing style and builds on this with practical and useful examples throughout. Based on his mobile development experience and his deep knowledge of the arcane Android technical documentation, the author conveys the know-how you need to develop practical applications that build upon or replace any of Androids features, however small.    Unlocking Android: A Developer's Guide prepares the reader to embrace the platform in easy-to-understand language and builds on this foundation with re-usable Java code examples. It is ideal for corporate and hobbyists alike who have an interest, or a mandate, to deliver software functionality for cell phones</p>
      <div className="reviewPro">
        <h2 className="font-bold text-xl mb-10 mt-5">Đánh giá sách  ( {calculateAverageRating(reviews)}⭐)</h2>
        {reviews.map((review) => (
          <div className="review-user">
            <div className="imgUser">
              <img src={review.img} alt="" />
            </div>
            <div className="review">
              <div className="commentName font-bold">{review.name}</div>
              <div className="commentText">{review.comment}</div>
              <div className="reviewRate"><Rate disabled defaultValue={review.rating} /></div>
            </div>
          </div>
        ))}
        <span>
          <Rate tooltips={desc} onChange={setValue} value={value} />
          {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : ''}
        </span>
        <Form
          {...layout}
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          className="mt-5"
          style={{ maxWidth: 500 }}
        >
          <Form.Item name="note" rules={[{ required: true }]}>
            <Input style={{ float: 'left' }} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="text-green-700">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </div>
      <ToastContainer />
    </div>

  );
};

export default ProductDetail;