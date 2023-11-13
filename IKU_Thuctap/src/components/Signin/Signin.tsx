import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import './Signin.css';
import axios from 'axios';
import { Table, Tag } from 'antd';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const firebaseConfig = {
  apiKey: "AIzaSyB1EWRdSA6tMWHHB-2nHwljjQIGDL_-x_E",
  authDomain: "course23-c0a29.firebaseapp.com",
  projectId: "course23-c0a29",
  storageBucket: "course23-c0a29.appspot.com",
  messagingSenderId: "1090440812389",
  appId: "1:1090440812389:web:e96b86b4d952f89c0d738c",
  measurementId: "G-51L48W6PCB"
};


// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Signin = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    // Sử dụng onAuthStateChanged để kiểm tra trạng thái xác thực của người dùng
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {

        setUser(currentUser);
        // Người dùng đã đăng nhậpd
        setEmail(currentUser.email)
        console.log(email);

      } else {
        // Người dùng chưa đăng nhập
        setUser(null);
      }
    });

    return () => {
      // Hủy đăng ký sự kiện khi component unmount
      unsubscribe();
    };
  }, [auth]);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        // Check if the email already exists
        axios.get(`http://localhost:3000/googleAccount?email=${user.email}`)
          .then((response) => {
            if (response.data.length === 0) {
              // If email doesn't exist, proceed to post user information to your API
              axios.post('http://localhost:3000/googleAccount', {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                // Add other user information as needed
              })
                .then((response) => {
                  // Handle success if needed
                  console.log('User information sent to API:', response.data);
                  toast.success('Đăng nhập thành công!', {
                    className: 'thongbaothanhcong',
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                  });
                })
                .catch((error) => {
                  // Handle error if needed
                  console.error('Error sending user information to API:', error);
                  alert('Không thành công');
                });
            } else {
              // Email already exists, handle accordingly
              console.log('Email already exists:', user.email);
            }
          })
          .catch((error) => {
            // Handle error if needed
            console.error('Error checking email existence:', error);
            alert('Không thành công');
          });
      })
      .catch((error) => {
        console.error('Authentication failed:', error);
        alert('Không thành công');
      });
  };



  useEffect(() => {
    // Sử dụng onAuthStateChanged để kiểm tra trạng thái xác thực của người dùng
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Khi người dùng đã đăng nhập, lấy danh sách đơn hàng của họ
        fetchUserOrders(currentUser.email);
      } else {
        setUser(null);
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);


  // Hàm để lấy đơn hàng dựa trên email người dùng
  const fetchUserOrders = (userEmail) => {
    axios.get('http://localhost:3000/hoadon')
      .then(response => {
        const allOrders = response.data;
        // Lọc các đơn hàng phù hợp với email người dùng
        const userOrders = allOrders.filter(order => order.email === userEmail);
        setOrders(userOrders);
      })
      .catch(error => {
        toast.error('Lỗi khi lấy thông tin đơn hàng');
        console.error('Error fetching orders:', error);
      });
  };
  // Hàm hủy đơn hàng
  const handleCancelOrder = (orderId) => {
    axios.delete(`http://localhost:3000/hoadon/${orderId}`)
      .then(() => {
        // Loại bỏ đơn hàng đã hủy khỏi state
        const remainingOrders = orders.filter(order => order.id !== orderId);
        setOrders(remainingOrders);
        toast.success('Đơn hàng đã được hủy thành công!');
      })
      .catch((error) => {
        console.error('Error canceling order:', error);
        toast.error('Không thể hủy đơn hàng.');
      });
  };






  // Định nghĩa cột cho bảng Ant Design
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Hủy' ? 'red' : 'blue'}>{status}</Tag>
      ),
    },
    {
      title: 'Tổng giá trị',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice: any) => (
        <span>{totalPrice}.000đ</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        record.status !== 'Hủy' && (
          <Button type="primary" danger onClick={() => handleCancelOrder(record.id)}>
            Hủy đơn hàng
          </Button>
        )
      ),
    }

  ];

  return (
    <div className="container_signin">
      {user ? (
        <div>
          <div className="flex gap-3 idki">
            <p className='font-bold'>Xin chào, {user.displayName}!</p>
            {user.photoURL && <img width={80} style={{ borderRadius: 100 }} src={user.photoURL} alt="Ảnh đại diện" />}
          </div>
          {user.email === "maitranthi651@gmail.com" && (

            <Button className='mr-4 mb-3' onClick={() => navigate('/admin')}>
              Đăng nhập trang quản trị
            </Button>

          )}
          <Button onClick={() => auth.signOut()}>Đăng xuất</Button>
        </div>
      ) : (
        <button className="signin_google" onClick={googleSignIn}>
          <div className="icon"></div>
          Đăng nhập bằng Google
        </button>
      )}
      <h2>Lịch sử đơn hàng của bạn</h2>
      <Table dataSource={orders} columns={columns} />

      <ToastContainer />
    </div>
  );
};

export default Signin;
