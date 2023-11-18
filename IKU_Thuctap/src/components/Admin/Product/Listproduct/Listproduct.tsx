// Listproduct.tsx

import './Listproduct.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getProduct, removeProduct } from '@/actions/product';
import { Link } from 'react-router-dom';
import { Pagination, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Spin } from 'antd';
const Listproduct = () => {
    const columns: ColumnsType<any> = [
        {
            title: 'Mã sản phẩm',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => `SP00${text}`,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'img',
            key: 'img',
            render: (text) => <img width={120} src={text} alt="" />,
        },
        {
            title: 'Tên sách',
            dataIndex: 'name',
            key: 'name',
            width: 220
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Mô tả',
            dataIndex: 'color',
            key: 'color',
            render: (text, record) => (
                <div style={{ width: 420 }}>
                    <div style={{ maxHeight: expandedRows.includes(record.key) ? 'none' : 100, overflow: 'hidden' }}>
                        {text}
                    </div>
                    {text.length > 100 && !expandedRows.includes(record.key) && (
                        <button
                            onClick={() => setExpandedRows([...expandedRows, record.key])}
                            style={{ color: 'blue', marginTop: '5px', cursor: 'pointer' }}
                        >
                            Xem thêm
                        </button>
                    )}
                </div>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Chức năng',
            key: 'action',
            render: (text, record) => (
                <>
                    <Link to={`/admin/suasanpham/${record.id}`} className='sua'>Sửa</Link>
                    <button onClick={() => dispatch(removeProduct(record.id))} className='xoa'>Xóa</button>
                </>
            ),
        },
    ];

    const [expandedRows, setExpandedRows] = useState([]);
    const dispatch = useAppDispatch();
    const { products } = useAppSelector((state: any) => state.products);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [loading, setLoading] = useState(true); // Thêm state để kiểm soát trạng thái loading

    useEffect(() => {
        // Khi bắt đầu fetch dữ liệu
        setLoading(true);

        dispatch(getProduct()).then(() => {
            // Khi fetch dữ liệu hoàn tất
            setLoading(false);
        });
    }, [dispatch]);

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const currentItems = products.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Link className='themspmoi' to="/admin/addsanpham">Thêm sách mới!</Link>

            {loading ? (
                <Spin
                    size="large"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                    }}
                />
            ) : (
                <>
                    <Table columns={columns} dataSource={currentItems} />
                    <Pagination
                        current={currentPage}
                        onChange={handlePageChange}
                        total={totalItems}
                        pageSize={itemsPerPage}
                    />
                </>
            )}
        </div>
    );
};

export default Listproduct;
