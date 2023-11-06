import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getProduct } from '@/actions/product';
import Skeleton from "react-loading-skeleton";
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Carousel } from 'antd';
import './res.css'
const Home = () => {

    const settings1 = {
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5, // Hiển thị 4 sản phẩm trên mỗi dòng
        slidesToScroll: 3,
    };
    const settings1res = {
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2, // Hiển thị 4 sản phẩm trên mỗi dòng
        slidesToScroll: 3,
    };
    const settings2 = {
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1, // Hiển thị 4 sản phẩm trên mỗi dòng
        slidesToScroll: 1,
    };

    const dispatch = useAppDispatch();
    const { products, isLoading, error } = useAppSelector((state: any) => state.products);

    useEffect(() => {
        dispatch(getProduct());
    }, []);

    return (
        <div>
            <div className="container responsive-div">
                <div className="list-tc">
                    <Slider {...settings2}>
                        <div>
                            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=411" alt="" />
                        </div>
                        <div>
                            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=411" alt="" />
                        </div>
                        <div>
                            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=411" alt="" />
                        </div>
                        <div>
                            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=411" alt="" />
                        </div>
                    </Slider>
                    <div className="mockup-code mt-4 mb-4">
                        <pre data-prefix="$"><code>npm i Sản phẩm nổi bật!</code></pre>
                    </div>
                    <div>
                        <Slider {...settings1}>
                            {products.map((item: any) => (
                                <div className="product text-center p-6">
                                    <Link to={`/products/${item.id}`} >
                                        <div className="image">
                                            <img src={item.img} alt="" />
                                        </div>
                                        <div className="name mt-2">{item.name}</div>
                                        <div className="price">{item.price}.000đ</div>
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div className="mockup-code mt-4 mb-4">
                        <pre data-prefix="$"><code>npm i Sản phẩm khuyến mãi!</code></pre>
                    </div>
                    <div>
                        <Slider {...settings1}>
                            {products.map((item: any) => (
                                <div className="product text-center p-6">
                                    <Link to={`/products/${item.id}`} >
                                        <div className="image">
                                            <img src={item.img} alt="" />
                                        </div>
                                        <div className="name mt-2">{item.name}</div>
                                        <div className="price">{item.price}.000đ</div>
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>


            <div className="mt-4 formo">
                <div className="list-tc">
                    <Slider {...settings2}>
                        <div>
                            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=411" alt="" />
                        </div>
                        <div>
                            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=411" alt="" />
                        </div>
                        <div>
                            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=411" alt="" />
                        </div>
                        <div>
                            <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=411" alt="" />
                        </div>
                    </Slider>
                    <div className="mockup-code mt-4 mb-4">
                        <pre data-prefix="$"><code>npm i Sản phẩm nổi bật!</code></pre>
                    </div>
                    <div>
                        <Slider {...settings1res}>
                            {products.map((item: any) => (
                                <div className="product text-center p-6">
                                    <Link to={`/products/${item.id}`} >
                                        <div className="image">
                                            <img src={item.img} alt="" />
                                        </div>
                                        <div className="name mt-2">{item.name}</div>
                                        <div className="price">{item.price}.000đ</div>
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div className="mockup-code mt-4 mb-4">
                        <pre data-prefix="$"><code>npm i Sản phẩm khuyến mãi!</code></pre>
                    </div>
                    <div>
                        <Slider {...settings1res}>
                            {products.map((item: any) => (
                                <div className="product text-center p-6">
                                    <Link to={`/products/${item.id}`} >
                                        <div className="image">
                                            <img src={item.img} alt="" />
                                        </div>
                                        <div className="name mt-2">{item.name}</div>
                                        <div className="price">{item.price}.000đ</div>
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default Home;
