import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

interface Cate {
    id: number;
    name: string;
}

interface RouteParams {
    id: string;
}

const UpdateCategory: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors }, reset } = useForm<Cate>();

    useEffect(() => {
        axios.get(`http://localhost:3000/Categories/${id}`)
            .then((response) => {
                reset(response.data);
            })
            .catch((error) => {
                toast.error(`Lỗi: ${error.message}`);
            });
    }, [id, reset]);

    const onSubmit = (data: Cate) => {
        axios.patch(`http://localhost:3000/Categories/${id}`, data)
            .then(() => {
                toast.success('Danh mục cập nhật thành công!', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                });
                navigate('/admin/category'); // Thay đổi đường dẫn tùy theo cấu trúc của bạn
            })
            .catch((error) => {
                toast.error(`Lỗi: ${error.response?.data.message || error.message}`);
            });
    };

    return (
        <div className="formadd">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>
                        Tên danh mục:
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: 'Tên danh mục không được để trống',
                            }}
                            render={({ field }) => <input type="text" {...field} />}
                        />
                    </label>
                    {errors.name && <div className="error">{errors.name.message}</div>}
                </div>
                <button type="submit">Cập nhật Danh mục</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default UpdateCategory;
