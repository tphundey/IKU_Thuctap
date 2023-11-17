import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store/index";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { initializeApp, FirebaseApp } from "firebase/app";
import { Spin } from 'antd';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
}


const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyB1EWRdSA6tMWHHB-2nHwljjQIGDL_-x_E",
    authDomain: "course23-c0a29.firebaseapp.com",
    projectId: "course23-c0a29",
    storageBucket: "course23-c0a29.appspot.com",
    messagingSenderId: "1090440812389",
    appId: "1:1090440812389:web:e96b86b4d952f89c0d738c",
    measurementId: "G-51L48W6PCB"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Root = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(true);
            }
        });
        return () => unsubscribe();
    }, []);

    if (!isAuthenticated) {
        return (
            <Spin
                size="large"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                }}
            />
        );
    }

    return (
        <Provider store={store}>
            <App user={user} />
        </Provider>
    );
};

ReactDOM.render(<Root />, document.getElementById("root"));
