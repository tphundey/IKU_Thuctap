import { useEffect} from 'react';
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getCategories,removeCategory } from '@/actions/category';
import { Link } from 'react-router-dom';
import { Table, Button, Popconfirm } from 'antd';
const Listdanhmuc = () => {
    const dispatch = useAppDispatch();
    const { categories} = useAppSelector((state: any) => state.category);
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
      
    useEffect(() => {
        dispatch(getCategories());
    }, []);

    return (
        <div>
    <a className='themspmoi' href="/admin/category/addCate">Thêm Danh mục!</a>
    <Table columns={columns} dataSource={categories} />
  </div>
    );
};

export default Listdanhmuc