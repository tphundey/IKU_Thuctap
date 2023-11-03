import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Listdonhang = () => {
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        // Fetch data from the API
        axios.get('http://localhost:3000/hoadon')
            .then((response) => {
                // Handle the data received from the API
                setOrderData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const updateOrderStatus = (orderId, newStatus) => {
        axios.patch(`http://localhost:3000/hoadon/${orderId}`, { status: newStatus })
            .then((response) => {
                // Xử lý thành công
                // Cập nhật trạng thái đơn hàng trong state local
                const updatedOrders = orderData.map(order => {
                    if (order.id === orderId) {
                        return { ...order, status: newStatus };
                    }
                    return order;
                });
                setOrderData(updatedOrders);
            })
            .catch((error) => {
                console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
            });
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Tên</th>
                        <th>Số điện thoại</th>
                        <th>Thành phố</th>
                        <th>Địa chỉ</th>
                        <th>Phương thức</th>
                        <th>Tổng giá trị</th>
                        <th>Thông tin</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {orderData.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.name}</td>
                            <td>{order.phone}</td>
                            <td>{order.city}</td>
                            <td>{order.address}</td>
                            <td>{order.paymentMethod}</td>
                            <td>{order.totalPrice}.000đ</td>
                            <td style={{ width: 80 }}>
                                <select style={{ width: 180 }} value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                                    <option value="Đã đặt hàng">Đã đặt hàng</option>
                                    <option value="Đang xử lý">Đang xử lý</option>
                                    <option value="Đang giao">Đang giao</option>
                                    <option value="Đã giao">Đã giao</option>
                                </select>
                            </td>
                            <td>
                                <ul>
                                    {order.cartItems.map((item) => (
                                        <div key={item.id}>
                                            <p>{item.quantity} cái {item.product.name} </p>
                                        </div>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Listdonhang;
