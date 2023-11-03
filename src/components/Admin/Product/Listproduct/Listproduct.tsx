import './Listproduct.css';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getProduct, removeProduct } from '@/actions/product';
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

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
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
        },

        {
            title: 'Mô tả',
            dataIndex: 'info',
            key: 'info',
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

    const dispatch = useAppDispatch();
    const { products } = useAppSelector((state: any) => state.products);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const itemsPerPage = 4;
    useEffect(() => {
        dispatch(getProduct());
    }, []);

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const currentItems = products.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div >
            <a className='themspmoi' href="admin/addsanpham">Thêm sản phẩm mới !</a>
            <Table columns={columns} dataSource={currentItems} />
            <Pagination
                current={currentPage}
                onChange={handlePageChange}
                total={totalItems}
                pageSize={itemsPerPage}
            />
        </div>
    );
};

export default Listproduct;
