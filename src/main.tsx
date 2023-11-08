import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App.tsx";
import store from "./store/index.ts";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { Spin } from 'antd';

const firebaseConfig: any = {
    apiKey: "AIzaSyB1EWRdSA6tMWHHB-2nHwljjQIGDL_-x_E",
    authDomain: "course23-c0a29.firebaseapp.com",
    projectId: "course23-c0a29",
    storageBucket: "course23-c0a29.appspot.com",
    messagingSenderId: "1090440812389",
    appId: "1:1090440812389:web:e96b86b4d952f89c0d738c",
    measurementId: "G-51L48W6PCB"
};

const app: any = initializeApp(firebaseConfig);
const auth: any = getAuth(app);

const Root = () => {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe: any = onAuthStateChanged(auth, (currentUser: any) => {
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Root />
);
