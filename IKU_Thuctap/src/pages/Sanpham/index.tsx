import "./style.css";
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getProduct } from '@/actions/product';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Spin } from 'antd';

const Sanpham = () => {

    interface Product {
        id: number;
        img: string;
        name: string;
        price: number;
        categoriesId: number;
    }

    interface Category {
        id: number;
        name: string;
    }

    const dispatch = useAppDispatch();
    const { products } = useAppSelector((state: any) => state.products);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [priceOptions] = useState([
        { id: 1, value: 1, label: "< 100.000" },
        { id: 2, value: 2, label: "< 200.000" },
        { id: 3, value: 3, label: "< 300.000" },
    ]);

    const [selectedPriceIds, setSelectedPriceIds] = useState<number[]>([]);
    const [isLoadingDelay, setIsLoadingDelay] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoadingDelay(false);
        }, 1000);

        dispatch(getProduct());

        axios.get<Category[]>('http://localhost:3000/categories') // Sử dụng kiểu dữ liệu cho categories
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    useEffect(() => {
        const updatedFilteredProducts = products.filter((product: Product) => {
            const isInSelectedCategories = selectedCategoryIds.length === 0 || selectedCategoryIds.includes(product.categoriesId);
            const isInSelectedPriceRanges = (
                selectedPriceIds.length === 0 ||
                (selectedPriceIds.includes(1) && product.price < 100) ||
                (selectedPriceIds.includes(2) && product.price < 200) ||
                (selectedPriceIds.includes(3) && product.price < 300)
            );
            return isInSelectedCategories && isInSelectedPriceRanges;
        });
        setFilteredProducts(updatedFilteredProducts);
    }, [selectedCategoryIds, selectedPriceIds, products]);

    const handlePriceChange = (priceId: number) => {
        if (selectedPriceIds.includes(priceId)) {
            setSelectedPriceIds(selectedPriceIds.filter(id => id !== priceId));
        } else {
            setSelectedPriceIds([...selectedPriceIds, priceId]);
        }
    };

    const handleCategoryChange = (categoryId: number) => {
        if (selectedCategoryIds.includes(categoryId)) {
            setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
        } else {
            setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
        }
    };



    return (
        <div>
            <div className="container fordesktop">
                <div className="title">
                    <div className="tl1">HOT TREND</div>
                </div>
                <div className="flex">
                    <div className="filter">
                        <div className="th">
                            Danh mục
                        </div>
                        <div className="danhmuc">
                            {/* Display categories fetched using Axios */}
                            {categories.map((category) => (
                                <div key={category.id} className="ft">
                                    <input
                                        type="checkbox"
                                        name=""
                                        id=""
                                        checked={selectedCategoryIds.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                    />
                                    <label htmlFor="">{category.name}</label>
                                </div>
                            ))}
                        </div>
                        <br /><br />
                        <div className="th">
                            Khoảng giá
                        </div>
                        <div className="danhmuc">
                            {/* Display price options */}
                            {priceOptions.map((option) => (
                                <div key={option.id} className="ft">
                                    <input
                                        type="checkbox"
                                        name=""
                                        id=""
                                        checked={selectedPriceIds.includes(option.id)}
                                        onChange={() => handlePriceChange(option.id)}
                                    />
                                    <label htmlFor="">{option.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="list">
                        {/* Display filtered products */}
                        {filteredProducts.map((item: any) => (
                            <div key={item.id} className="product">
                                <Link to={`/products/${item.id}`} >
                                    <div className="image">
                                        <img src={item.img} alt="" />
                                    </div>
                                    <div className="name mt-2">{item.name}</div>
                                    <div className="price">{item.price}.000đ</div>
                                </Link>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
            <div className="formobile">
                <div className="flex">
                    <div className="filter">
                        <div className="th">
                            Danh mục
                        </div>
                        <div className="danhmuc">
                            {/* Display categories fetched using Axios */}
                            {categories.map((category) => (
                                <div key={category.id} className="ft">
                                    <input
                                        type="checkbox"
                                        name=""
                                        id=""
                                        checked={selectedCategoryIds.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                    />
                                    <label htmlFor="">{category.name}</label>
                                </div>
                            ))}
                        </div>
                        <br /><br />
                        <div className="th">
                            Khoảng giá
                        </div>
                        <div className="danhmuc">
                            {/* Display price options */}
                            {priceOptions.map((option) => (
                                <div key={option.id} className="ft">
                                    <input
                                        type="checkbox"
                                        name=""
                                        id=""
                                        checked={selectedPriceIds.includes(option.id)}
                                        onChange={() => handlePriceChange(option.id)}
                                    />
                                    <label htmlFor="">{option.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="list">
                        {/* Display filtered products */}
                        {filteredProducts.map((item: any) => (
                            <div key={item.id} className="product">
                                <Link to={`/products/${item.id}`} >
                                    <div className="image">
                                        <img src={item.img} alt="" />
                                    </div>
                                    <div className="name mt-2">{item.name}</div>
                                    <div className="price">{item.price}.000đ</div>
                                </Link>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sanpham;
