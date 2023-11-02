import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';

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
    }
  }, [auth]);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const { user, credential } = userCredential;

      // Log dữ liệu người dùng và thông tin đăng nhập
      console.log('Dữ liệu người dùng:', user);
      console.log('Thông tin đăng nhập:', credential);

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


  return (
    <div className="container_signin">
      {/* Rest of your JSX code here */}
      {user ? (
        <div>
          <p>Xin chào, {user.displayName}!</p>
          <button onClick={() => auth.signOut()}>Đăng xuất</button>
          {user.photoURL && (
            <img src={user.photoURL} alt="Ảnh đại diện" />
          )}
        </div>
      ) : (
        <button className="signin_google" onClick={googleSignIn}>
          <div className="icon"></div>
          Đăng nhập bằng Google
        </button>
      )}
      <ToastContainer />
    </div>
  );
};

export default Signin;




