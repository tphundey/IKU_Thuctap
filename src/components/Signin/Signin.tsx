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
  const [email, setEmail] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);

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

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Không cần lưu thông tin người dùng lên local, người dùng đã được xác thực bởi Firebase
      toast.success('Đăng nhập thành công!', {
        className: 'thongbaothanhcong',
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('Không thành công');
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.email) {
        try {
          // Gọi API để lấy thông tin đơn hàng khi user đã đăng nhập
          const response = await axios.get(`http://localhost:3000/hoadon?email=${user.email}`);
          const allOrders = response.data;
          setUserOrders(allOrders.filter(order => order.status !== 'Hủy'));
          setCanceledOrders(allOrders.filter(order => order.status === 'Hủy'));
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };

    // Gọi API khi component được mount hoặc khi user đổi
    fetchOrders();
  }, [user]);


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
      {user ? (
        <div>
        <div className="flex gap-3 idki">
        <p className='font-bold'>Xin chào, {user.displayName}!</p>
          {user.photoURL && <img width={80} style={{borderRadius:100}} src={user.photoURL} alt="Ảnh đại diện" />}
        </div>
          <button onClick={() => auth.signOut()}>Đăng xuất</button>
       
        </div>
      ) : (
        <button className="signin_google" onClick={googleSignIn}>
          <div className="icon"></div>
          Đăng nhập bằng Google
        </button>
      )}
      <h2>Lịch sử đơn hàng của bạn</h2>
      <Table dataSource={userOrders} columns={columns} />
      <h2>Danh sách đơn hàng đã hủy</h2>
      <Table dataSource={canceledOrders} columns={columns} />
      <ToastContainer />
    </div>
  );
};

export default Signin;
