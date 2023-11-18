import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch } from "@/store/hook";
import { addProduct } from '@/actions/product';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import './add.css'
interface Material {
  id: number;
  name: string;
}

interface AddProductFormProps {
  onAddProduct: (product: any) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const containsSpace = (value: string) => !/\s/.test(value);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset: formReset,
    setValue,
  } = useForm<any>({
    defaultValues: {},
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dsk9jrxzf/image/upload?upload_preset=movies`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setValue('img', data.secure_url);
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  const fetchMaterials = async () => {
    try {
      const response = await fetch('http://localhost:3000/categories');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      await dispatch(addProduct(data));
      formReset();

      toast.success('Thêm thành công!', {
        className: 'thongbaothanhcong',
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });

    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    } finally {
      navigate('/admin/products');
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  return (
    <div className="formadd">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            Tên sách:
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Không được để trống dữ liệu',
              }}
              render={({ field }) => <input type="text" {...field} />}
            />
            {errors.name && <div className="error">{errors.name.message}</div>}
          </label>
        </div>
        <div>
          <label>
            Giá thành:
            <Controller
              name="price"
              control={control}
              rules={{ required: 'Không được để trống dữ liệu', min: { value: 0, message: 'Price must be greater than 0' } }}
              render={({ field }) => <input type="number" {...field} />}
            />
            {errors.price && <div className="error">{errors.price.message}</div>}
          </label>
        </div>
        <div>
          <label>
            Upload hình ảnh:
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              <p>Drag 'n' drop an image here, or click to select one</p>
            </div>
            {errors.img && <div className="error">{errors.img.message}</div>}
          </label>
        </div>
        <div>
          <Controller
            name="categoriesId"
            control={control}
            rules={{ required: 'Vui lòng chọn chất liệu' }}
            render={({ field }) => (
              <select {...field}>
                <option value="">-- Chọn danh mục --</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.categoriesId && <div className="error">{errors.categoriesId.message}</div>}
        </div>
        <div>
          <label>
            Mô tả:
            <Controller
              name="color"
              control={control}
              rules={{
                required: 'Không được để trống dữ liệu',
              }}
              render={({ field }) => <input type="text" {...field} />}
            />
            {errors.color && <div className="error">{errors.color.message}</div>}
          </label>
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
              rules={{ required: 'Không được để trống dữ liệu', min: { value: 0, message: 'Quantity must be greater than 0' } }}
              render={({ field }) => <input type="number" {...field} />}
            />
            {errors.quantity && <div className="error">{errors.quantity.message}</div>}
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? <FaSpinner className="icon-spin" /> : 'Add Product'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProductForm;
