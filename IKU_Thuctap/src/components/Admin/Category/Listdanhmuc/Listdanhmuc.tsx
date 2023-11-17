import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button, Popconfirm, Spin } from 'antd';

const Listdanhmuc = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/Categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Có lỗi xảy ra khi lấy dữ liệu: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id: any) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/Categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Có lỗi xảy ra khi xóa danh mục: ', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Danh mục sách',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chức năng',
      key: 'action',
      render: (text, record) => (
        <div className='chucnang2'>
          <Link to={`/admin/category/updateCate/${record.id}`} className='sua'>Sửa</Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDeleteCategory(record.id)}
          >
            <Button type="danger">Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

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
    <div>
      <Link className='themspmoi' to="/admin/category/addCate">Thêm Danh mục!</Link>
      <Table
        columns={columns}
        dataSource={categories.map((category, index) => ({
          ...category,
          key: category.id
        }))}
        rowKey="id"
      />
    </div>
  );
};

export default Listdanhmuc;
