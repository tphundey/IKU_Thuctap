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
import { Button, Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';

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
  const { id } = useParams<{ id: string }>();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const formRef = React.useRef<FormInstance>(null);

  const onFinish = (values: any) => {
    console.log(values);
  };

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

  const handleAddToCart = () => {
    const userProfile = JSON.parse(localStorage.getItem("profile") || "{}");
    if (!userProfile || Object.keys(userProfile).length === 0) {
      alert("Vui lòng đăng nhập hoặc đăng ký để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    const cartItem: CartItem = { product, quantity, userProfile };
    if (product) {
      const existingCartItem = cartItems.find((item) => item.product.id === product.id);
      if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + quantity;
        if (updatedQuantity <= 5) {
          const updatedCartItem = { ...existingCartItem, quantity: updatedQuantity };
          dispatch(updateCartItem(updatedCartItem));
        } else {
          toast.error('Không thể thêm sản phẩm vào giỏ hàng. Số lượng vượt quá giới hạn (tối đa 5 sản phẩm).', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        }
      } else {
        dispatch(addToCart(cartItem));
        toast.success('Thêm thành công chờ 3s để vào giỏ hàng!', {
          className: 'thongbaothanhcong',
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/thanhtoan");
        }, 3000);
      }
    }
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
        <h2 className="font-bold text-xl mb-10 mt-5">Đánh giá sách</h2>

        <div className="review-user">
          <div className="imgUser">
            <img src="https://s120-ava-talk.zadn.vn/a/3/8/d/41/120/d420f9f3b51245aefb0cb31ca04cad1e.jpg" alt="" />
          </div>
          <div className="review">
          <div className="commentName font-bold">Trần Phùng</div>
            <div className="commentText">Sách khá hay nhé mn</div>
            <div className="reviewRate"><Rate disabled defaultValue={2} /></div>
          </div>
        </div>

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