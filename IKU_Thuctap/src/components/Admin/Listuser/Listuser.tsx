import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Popconfirm } from 'antd';
const Listuser = () => {
    const [userData, setUserData] = useState([]);
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'img',
            key: 'img',
            render: (text) => <img src={text} alt="" />,
        },
        {
            title: 'Chức năng',
            key: 'action',
            render: (text, record) => (
                <Popconfirm
                    title="Bạn có chắc chắn muốn xóa người dùng này?"
                    onConfirm={() => handleDeleteUser(record.id)}
                >
                    <Button type="danger">Xóa</Button>
                </Popconfirm>
            ),
        },
    ];
    useEffect(() => {
        // Gọi API để lấy dữ liệu người dùng
        axios.get('http://localhost:3000/googleaccounts')
            .then((response) => {
                // Lưu trữ dữ liệu người dùng vào state
                setUserData(response.data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu người dùng:', error);
            });
    }, []); // Dependency array rỗng để useEffect chỉ chạy một lần sau khi component mount
    // Hàm xử lý sự kiện khi nhấn nút xóa người dùng
    const handleDeleteUser = (userId) => {
        const shouldDelete = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?');
        if (shouldDelete) {
            // Gọi API để xóa người dùng với id tương ứng
            axios.delete(`http://localhost:3000/googleAccount/${userId}`)
                .then((response) => {
                    console.log('Xóa người dùng thành công:', response.data);
                    // Cập nhật lại danh sách người dùng sau khi xóa thành công
                    setUserData((prevUserData) => prevUserData.filter((user) => user.id !== userId));
                })
                .catch((error) => {
                    console.error('Lỗi khi xóa người dùng:', error);
                });
        }
    };
    return (
        <div >
            <div >
                <Table columns={columns} dataSource={userData} />
            </div>
        </div>
    );
};

export default Listuser;
