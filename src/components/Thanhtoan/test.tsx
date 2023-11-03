import { useState, useEffect } from 'react';
import axios from "axios";
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './thanhtoan.css';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../AuthFirebase/auth';

const Thanhtoan = () => {
    const [email, setEmail] = useState([]);
    const [userCart, setUserCart] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
            if (currentUser) {
                setUser(currentUser);
                setEmail(currentUser.email)
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Lấy dữ liệu giỏ hàng từ API
        axios.get("http://localhost:3000/cart")
            .then((response) => {
                const cartItems = response.data;

                // Lọc giỏ hàng dựa trên email
                const filteredCart = cartItems.find((cartItem) => cartItem.email === email);

                if (filteredCart) {
                    setUserCart(filteredCart.products);
                }
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu giỏ hàng từ API:", error);
            });
    }, [email]);

    return (
        <div>
            <h1>Giỏ hàng của {email}</h1>
            <ul>
                {userCart.map((productItem, index) => (
                    <li key={index}>
                        <img src={productItem.product.img} alt={productItem.product.name} />
                        <h2>{productItem.product.name}</h2>
                        <p>Giá: {productItem.product.price}</p>
                        <p>Số lượng: {productItem.quantity}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default Thanhtoan;


