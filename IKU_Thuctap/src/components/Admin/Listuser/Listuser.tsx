import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Popconfirm, Spin } from 'antd';

const Listuser = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm biến loading

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'displayName',
            key: 'displayName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'photoURL',
            key: 'photoURL',
            render: (text) => <img src={text} alt="" />,
        },
        {
            title: 'Thao tác',
            dataIndex: 'id',
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
        setLoading(true); // Bắt đầu loading
        axios.get('http://localhost:3000/googleAccount')
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu người dùng:', error);
            })
            .finally(() => setLoading(false)); // Kết thúc loading khi dữ liệu đã được nhận
    }, []);

    const handleDeleteUser = (userId) => {
        const shouldDelete = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?');
        if (shouldDelete) {
            setLoading(true); // Bắt đầu loading khi thực hiện xóa người dùng
            axios.delete(`http://localhost:3000/googleAccount/${userId}`)
                .then(() => {
                    setUserData((prevUserData) => prevUserData.filter((user) => user.id !== userId));
                })
                .catch((error) => {
                    console.error('Lỗi khi xóa người dùng:', error);
                })
                .finally(() => setLoading(false)); // Kết thúc loading khi xóa người dùng thành công hoặc thất bại
        }
    };

    if (loading) {
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
        <div >
            <div >
                <Table columns={columns} dataSource={userData} />
            </div>
        </div>
    );
};

export default Listuser;
