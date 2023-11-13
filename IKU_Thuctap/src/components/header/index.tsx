import "./style.css";
import { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../AuthFirebase/auth';
import SearchResults from "../Search/Search";
import { Input } from 'antd';

const Header = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const navigate = useNavigate();
    const [cartItemsFromAPI, setCartItemsFromAPI] = useState([]);
    const userProfile = JSON.parse(localStorage.getItem("profile") || "{}");
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [user, setUser] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [productId, setProductId] = useState(null);
    const handleProductClick = (product) => {
        setProductId(product.id);
        closeSearch();
    };
    // Hàm mở ô tìm kiếm
    const openSearch = () => {
        setIsSearchOpen(true);
    };

    // Hàm đóng ô tìm kiếm
    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchKeyword('');
        setSearchResults([]);
    };

    const searchProducts = () => {
        // Gửi yêu cầu API để lấy danh sách sản phẩm
        axios.get('http://localhost:3000/products')
          .then((response) => {
            const allProducts = response.data;
            // Lọc các sản phẩm phù hợp với từ khóa tìm kiếm
            const filteredProducts = allProducts.filter(product =>
              product.name.toLowerCase().includes(searchKeyword.toLowerCase())
            );
            setSearchResults(filteredProducts);
          })
          .catch((error) => {
            console.error('Lỗi khi tìm kiếm sản phẩm:', error);
          });
      };
      

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
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
                const userCart = cartItems.filter((cartItem) => cartItem.userProfile.email === userProfile.email);
                setCartItemsFromAPI(userCart);
                // Tính tổng số tiền
                const total = userCart.reduce((acc, item) => {
                    return acc + item.quantity * item.product.price;
                }, 0);

                setTotalPrice(total);
                const totalItems = userCart.reduce((acc, item) => {
                    return acc + item.quantity;
                }, 0);
                setTotalItems(totalItems);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy dữ liệu giỏ hàng từ API:", error);
            });
    }, [userProfile.email]);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsSignedIn(isLoggedIn);
    }, []);

    useEffect(() => {
        if (productId) {
            // Chuyển hướng đến trang chi tiết sản phẩm khi có productId
            navigate(`/products/${productId}`);
        }
    }, [productId, navigate]);

    return (
        <div>
            <div className="responsive-div">
                <header>
                    <div className="container ">
                        <div className="header">
                            <div className="logo">
                                <a href="/"> <img src="https://f11-zpcloud.zdn.vn/3582383015173649842/d49467afac3e7b60222f.jpg" alt="" /></a>
                            </div>
                            <div className="tab">
                                <ul>
                                    <li><a href="/">Trang Chủ</a></li>
                                    <li><a href="/products">Sản Phẩm *</a></li>
                                    <li><a href="">Về ANNA</a></li>
                                    <li><a href="">STORE</a></li>
                                </ul>
                            </div>
                            <div className="option">
                                <ul>
                                    <li>
                                        <a href="#" onClick={openSearch}>
                                            <img className="a" src="https://cdn.icon-icons.com/icons2/1129/PNG/512/searchmagnifierinterfacesymbol_79894.png" alt="" />
                                        </a>
                                    </li>
                                    {user ? (
                                        <div>
                                            <a href="http://localhost:5173/signin"><img style={{ width: 40, borderRadius: 100 }} src={user.photoURL} alt="Ảnh đại diện" /></a>
                                        </div>
                                    ) : (
                                        <a href="http://localhost:5173/signin"><img style={{ width: 50, borderRadius: 100 }} src="https://media.istockphoto.com/id/1136995165/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-vector-ng%C6%B0%E1%BB%9Di-%C4%91%C3%A0n-%C3%B4ng-cho-thi%E1%BA%BFt-k%E1%BA%BF-%C4%91%E1%BB%93-h%E1%BB%8Da-logo-trang-web-ph%C6%B0%C6%A1ng-ti%E1%BB%87n-truy%E1%BB%81n-th%C3%B4ng.jpg?s=612x612&w=0&k=20&c=Lv8EXD1fsPwWdnzGXhpTbClUdsFr4qYpoo-G2HTUrbE=" alt="Ảnh đại diện" /></a>
                                    )}
                                    <li><a href="http://localhost:5173/thanhtoan"><img className="c" src="https://cdn.icon-icons.com/icons2/1302/PNG/512/onlineshoppingcart_85781.png" alt="" /></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>
                <nav>
                    <div className="value">
                        SEE BETTER THAN YESTERDAY - BOOKSTORE LOVE YOU!
                    </div>
                </nav>
                {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-box">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              className="search-btn"
              onClick={searchProducts}
            >
              Tìm kiếm
            </button>
            <button
              className="close-btn"
              onClick={closeSearch}
            >
              Đóng
            </button>
          </div>
          {searchResults.length > 0 && (
            <SearchResults searchResults={searchResults} onItemClick={handleProductClick} />
          )}
          {productId && (
            <a href={`/products/${productId}`} className="hidden-link"></a>
          )}
        </div>
      )}
                <ToastContainer />
            </div>
            <div className="formobile">
                <div className="logo">
                    <a href="/"> <img src="https://f11-zpcloud.zdn.vn/3582383015173649842/d49467afac3e7b60222f.jpg" alt="" /></a>
                </div>
                <div className="flex">
                    <ul className="flex gap-3 font-bold text-vvu">
                        <li><a href="/">Trang Chủ</a></li>
                        <li><a href="/products">Sản Phẩm *</a></li>
                        <li><a href="">Về ANNA</a></li>
                        <li><a href="">STORE</a></li>
                    </ul>
                </div>
                <div className="">
                    <ul className="flex utu">
                        <li>
                            <a href="#" onClick={openSearch}>
                                <img className="a" src="https://cdn.icon-icons.com/icons2/1129/PNG/512/searchmagnifierinterfacesymbol_79894.png" alt="" />
                            </a>
                        </li>
                        {user ? (
                            <div>
                                <a className="b" href="http://localhost:5173/signin"><img style={{ width: 40, borderRadius: 100 }} src={user.photoURL} alt="Ảnh đại diện" /></a>
                            </div>
                        ) : (
                            <a className="b" href="http://localhost:5173/signin"><img style={{ width: 50, borderRadius: 100 }} src="https://media.istockphoto.com/id/1136995165/vi/vec-to/bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-vector-ng%C6%B0%E1%BB%9Di-%C4%91%C3%A0n-%C3%B4ng-cho-thi%E1%BA%BFt-k%E1%BA%BF-%C4%91%E1%BB%93-h%E1%BB%8Da-logo-trang-web-ph%C6%B0%C6%A1ng-ti%E1%BB%87n-truy%E1%BB%81n-th%C3%B4ng.jpg?s=612x612&w=0&k=20&c=Lv8EXD1fsPwWdnzGXhpTbClUdsFr4qYpoo-G2HTUrbE=" alt="Ảnh đại diện" /></a>
                        )}
                        <li><a href="http://localhost:5173/thanhtoan"><img className="c" src="https://cdn.icon-icons.com/icons2/1302/PNG/512/onlineshoppingcart_85781.png" alt="" /></a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
