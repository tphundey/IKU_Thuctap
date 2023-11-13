import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './donhang.css'
const Listdonhang = () => {
    const [orderData, setOrderData] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        // Fetch data from the API
        axios.get('http://localhost:3000/hoadon')
            .then((response) => {
                setOrderData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const updateOrderStatus = (orderId, newStatus) => {
        axios.patch(`http://localhost:3000/hoadon/${orderId}`, { status: newStatus })
            .then((response) => {
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
                        <th style={{ width: 130 }}>Mã đơn hàng</th>

                        <th style={{ width: 160 }}>Phương thức</th>
                        <th style={{ width: 160 }}>Tổng giá trị</th>
                        <th style={{ width: 130 }}>Trạng thái đơn hàng</th>
                        <th style={{ width: 230 }}>Trạng thái thanh toán</th>
                        <th style={{ width: 220 }}>Số tiền thanh toán</th>
                        <th style={{ width: 130 }}>Thông tin</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(orderData) && orderData.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>

                            <td>{order.paymentMethod}</td>
                            <td>{order.totalPrice}.000đ</td>
                            <td style={{ width: 80 }}>
                                <select style={{ width: 180 }} value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}>
                                    <option value="Đã đặt hàng">Đã đặt hàng</option>
                                    <option value="Đang xử lý">Đang xử lý</option>
                                    <option value="Đang giao">Đang giao</option>
                                    <option value="Đã giao">Đã giao</option>
                                    <option value="Hủy">Hủy</option>
                                </select>
                            </td>
                            <td>{order.paymentStatus}</td>
                            <td>{parseInt(order.amountDone).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                            <td>
                                <button onClick={() => setSelectedOrder(order)} className='text-blue-600'>Xem chi tiết</button>
                                {selectedOrder && (
                                    <div className="modal-overlay">
                                        <div className="modal-content">
                                            {/* Nội dung chi tiết đơn hàng ở đây */}
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Mã đơn hàng</th>
                                                        <th>Tên</th>
                                                        <th>Số điện thoại</th>
                                                        <th>Thành phố</th>
                                                        <th>Địa chỉ</th>
                                                        {/* ... Thêm các cột khác ... */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{selectedOrder.id}</td>
                                                        <td>{selectedOrder.name}</td>
                                                        <td>{selectedOrder.phone}</td>
                                                        <td>{selectedOrder.city}</td>
                                                        <td>{selectedOrder.address}</td>
                                                        {/* ... Thêm các dòng khác ... */}
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <button className='text-red-600' onClick={() => setSelectedOrder(null)}>Đóng</button>
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Listdonhang;
