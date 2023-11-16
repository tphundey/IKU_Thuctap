import "./Hoadon.css"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../components/AuthFirebase/auth';

const Hoadon = () => {
    const [email, setEmail] = useState([]);
    const [userCart, setUserCart] = useState([]);
    const [user, setUser] = useState(null);
    const [orderData, setOrderData] = useState(null);

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
        // Gọi API để lấy dữ liệu đơn hàng dựa trên email từ Local Storage
        axios.get(`http://localhost:3000/hoadon?email=${email}`)
            .then((response) => {
                // Lưu trữ dữ liệu đơn hàng vào state
                setOrderData(response.data[0]);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
            });
    }, []);

    if (!orderData) {
        // Hiển thị loading hoặc thông báo khi chưa có dữ liệu
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="wrapper_hoadon">
                <div className="hoadon_top" style={{ textAlign: "center" }}>
                    <img src="../../../public/img/thankyou.png" alt="" /> <br />
                    <br />
                    <br />
                    <h3>Cảm ơn ! Đơn hàng của bạn đã được đặt thành công</h3>
                </div>
                <hr />
                <div className="hoadon_info">
                    <table>
                        <tr>
                            <th>PRODUCT</th>
                            <th>TOTAL</th>
                        </tr>
                        <tr>
                            <td>Tên người nhận hàng:</td>
                            <td>{orderData.name}</td>
                        </tr>
                        <tr>
                            <td>Số điện thoại:</td>
                            <td>{orderData.phone}</td>
                        </tr>
                        <tr>
                            <td>Địa chỉ:</td>
                            <td>{orderData.address}</td>
                        </tr>
                        <tr>
                            <td>Voucher:</td>
                            <td>{orderData.voucher}</td>
                        </tr>
                        <tr>
                            <td>Phương thức thanh toán:</td>
                            <td>{orderData.paymentMethod}</td>
                        </tr>
                        <tr>
                            <td>Tổng cộng:</td>
                            <td>{orderData.totalPrice},000₫</td>
                        </tr>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default Hoadon