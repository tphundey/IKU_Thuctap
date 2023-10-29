import "./style.css"
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getProduct } from '@/actions/product';
import Skeleton from "react-loading-skeleton";
import { Link } from 'react-router-dom';

import { Carousel } from 'antd';
const Home = () => {
    const contentStyle: React.CSSProperties = {
        height: '460px',
        width: '90%',
        color: '#fff',
        textAlign: 'center',
        background: '#364d79',
    };
    const dispatch = useAppDispatch();
    const { products, isLoading, error } = useAppSelector((state: any) => state.products);

    useEffect(() => {
        dispatch(getProduct());
    }, []);


    return (
        <div>
            <div className="carou-ntd">
                <Carousel autoplay>
                    <div>
                        <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img1.jpg?v=411" alt="" />
                    </div>
                    <div>
                        <img src="https://theme.hstatic.net/200000343865/1001052087/14/ms_banner_img2.jpg?v=411" alt="" />
                    </div>
                </Carousel>
            </div>

            <div className="container">
                <div className="mockup-window border bg-base-300 mt-4 mb-4">
                    <div className="text-lg font-semibold px-4 py-4 bg-base-200">Sản phẩm nổi bật</div>
                </div>
                <div className="list-tc">
                    {products.map((item: any) => (
                        <div className="product">
                            <div className="image">
                                <img src={item.img} alt="" />
                            </div>
                            <div className="name">{item.name}</div>
                            <div className="price">{item.price}.000đ</div>
                        </div>
                    ))}


                </div>
            </div>

        </div>

    );
};

export default Home;
