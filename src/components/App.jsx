import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./AuthContext";
import WalletProviderComponent from "./WalletProvider";
import Header from "./Header";
import Footer from "./Footer";
import TelegramLogin from './TelegramBtn';
import Dashboard from './dashboard';
import Signin from "./Signin";
import Register from "./Register";
import Home from "./Home";


const App = () => {


    return (
        <WalletProviderComponent>
            <AuthProvider>
                <div>

                    <Header />

                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/signin" element={<Signin />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                    </Router>

                    <TelegramLogin />
                    <Footer />

                </div>
            </AuthProvider>
        </WalletProviderComponent>
    );
};


export default App;
