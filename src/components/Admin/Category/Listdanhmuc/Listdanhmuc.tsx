import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button, Popconfirm } from 'antd';

const Listdanhmuc = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/Categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Có lỗi xảy ra khi lấy dữ liệu: ', error);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/Categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Có lỗi xảy ra khi xóa danh mục: ', error);
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Loại kính',
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
