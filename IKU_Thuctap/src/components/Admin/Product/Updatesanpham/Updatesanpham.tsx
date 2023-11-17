import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Spin } from 'antd';
const SuaSanPham: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: '',
            price: 0,
            img: '',
            color: '',
            quantity: 0,
            author: 'null',
        }
    });

    useEffect(() => {
        setLoading(true); // Bắt đầu loading
        // Lấy dữ liệu sản phẩm từ API và đặt vào form
        axios.get(`http://localhost:3000/products/${id}`)
            .then(response => {
                setProduct(response.data);
                reset(response.data); // Reset form values với dữ liệu sản phẩm
            })
            .catch(error => toast.error(error.message))
            .finally(() => setLoading(false)); // Kết thúc loading khi dữ liệu đã được nhận
    }, [id, reset]);

    const onSubmit = (data: any) => {
        axios.patch(`http://localhost:3000/products/${id}`, data)
            .then(() => {
                toast.success('Sản phẩm đã được cập nhật!');
            })
            .catch(error => toast.error(error.message));
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
        <div className="formadd">


            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>
                        Tên sản phẩm:
                        <Controller
                            name="name"
                            control={control}
                            rules={{
                                required: 'Không được để trống dữ liệu',

                            }}
                            render={({ field }) => <input type="text" {...field} />}
                        />
                    </label>
                    {errors.name && <div className="error">{errors.name.message}</div>}
                </div>
                <div>
                    <label>
                        Giá sản phẩm:
                        <Controller
                            name="price"
                            control={control}
                            rules={{
                                required: 'Không được để trống dữ liệu',
                                min: { value: 0, message: 'Giá sản phẩm phải lớn hơn 0' },
                            }}
                            render={({ field }) => <input type="number" {...field} />}
                        />
                    </label>
                    {errors.price && <div className="error">{errors.price.message}</div>}
                </div>
                <div>
                    <label>
                        Ảnh sản phẩm:
                        <Controller
                            name="img"
                            control={control}
                            rules={{
                                required: 'Không được để trống dữ liệu',
                            }}
                            render={({ field }) => <input type="text" {...field} />}
                        />
                    </label>
                    {errors.img && <div className="error">{errors.img.message}</div>}
                </div>

                <div>
                    <label>
                        Màu sắc:
                        <Controller
                            name="color"
                            control={control}
                            rules={{
                                required: 'Không được để trống dữ liệu',
                            }}
                            render={({ field }) => <input type="text" {...field} />}
                        />
                    </label>
                    {errors.color && <div className="error">{errors.color.message}</div>}
                </div>
                <div>
                    <label>
                        Số lượng:
                        <Controller
                            name="quantity"
                            control={control}
                            rules={{
                                required: 'Không được để trống dữ liệu',
                                min: { value: 0, message: 'Số lượng phải lớn hơn 0' },
                            }}
                            render={({ field }) => <input type="number" {...field} />}
                        />
                    </label>
                    {errors.quantity && <div className="error">{errors.quantity.message}</div>}
                </div>
                <div>
                    <label>
                        Tác giả:
                        <Controller
                            name="author"
                            control={control}
                            rules={{
                                required: 'Không được để trống dữ liệu',
                            }}
                            render={({ field }) => <input  {...field} />}
                        />
                    </label>
                    {errors.quantity && <div className="error">{errors.quantity.message}</div>}
                </div>
                <button type="submit">Cập nhật sản phẩm</button>
            </form>
            {/* Component ToastContainer để hiển thị thông báo */}
            <ToastContainer />
        </div>
    );
};

export default SuaSanPham;
