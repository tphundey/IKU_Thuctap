import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import './Signin.css';
import axios from 'axios';
import { Table, Button, Tag } from 'antd';


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
  const [userOrders, setUserOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  
  useEffect(() => {
    // Sử dụng onAuthStateChanged để kiểm tra trạng thái xác thực của người dùng
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Người dùng đã đăng nhập
        setUser(currentUser);
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

  const googleSignIn = async () => {
    // ... (code đăng nhập Google)
  };

  useEffect(() => {
    // Gửi yêu cầu API để lấy danh sách đơn hàng của người dùng
    axios
      .get(`http://localhost:3000/hoadon`)
      .then((response) => {
        // Lấy danh sách đơn hàng và tách ra thành danh sách đơn hàng đã hủy và chưa hủy
        const allOrders = response.data;
        const notCanceledOrders = allOrders.filter(order => order.status !== 'Hủy');
        const canceledOrders = allOrders.filter(order => order.status === 'Hủy');
        
        setUserOrders(notCanceledOrders);
        setCanceledOrders(canceledOrders);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, []);

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
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Button
          type="danger"
          onClick={() => handleCancelOrder(record.id)}
          disabled={record.status === 'Hủy'} // Chỉ cho phép hủy đơn hàng nếu trạng thái không phải 'Hủy'
        >
          Hủy đơn hàng
        </Button>
      ),
    },
  ];

  const handleCancelOrder = (orderId) => {
    // Gửi yêu cầu API để hủy đơn hàng
    axios
      .put(`http://localhost:3000/hoadon/${orderId}`, { status: 'Hủy' })
      .then(() => {
        // Hủy đơn hàng thành công, cập nhật lại danh sách đơn hàng
        const updatedOrders = userOrders.filter((order) => order.id !== orderId);
        const canceledOrder = userOrders.find((order) => order.id === orderId);
        
        setUserOrders(updatedOrders);
        setCanceledOrders([...canceledOrders, canceledOrder]);
        
        toast.success('Đã hủy đơn hàng thành công!');
      })
      .catch((error) => {
        console.error('Error canceling order:', error);
        toast.error('Không thể hủy đơn hàng.');
      });
  };

  return (
    <div className="container_signin">
      <h2>Lịch sử đơn hàng của bạn</h2>
      <Table dataSource={userOrders} columns={columns} />
      {user ? (
        <div>
          <p>Xin chào, {user.displayName}!</p>
          <button onClick={() => auth.signOut()}>Đăng xuất</button>
          {user.photoURL && <img src={user.photoURL} alt="Ảnh đại diện" />}
        </div>
      ) : (
        <button className="signin_google" onClick={googleSignIn}>
          <div className="icon"></div>
          Đăng nhập bằng Google
        </button>
      )}
      <h2>Danh sách đơn hàng đã hủy</h2>
      <Table dataSource={canceledOrders} columns={columns} />
      <ToastContainer />
    </div>
  );
};

export default Signin;
