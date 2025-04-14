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

        <AuthProvider>
            <div>

                <Header />

                <Router>
                    <Routes>
                        <Route path="/" element={
                            <WalletProviderComponent>
                                <Dashboard />
                            </WalletProviderComponent>
                            } />
                        <Route path="/signin" element={<Signin />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </Router>

                <TelegramLogin />
                <Footer />

            </div>
        </AuthProvider>
    );
};


export default App;
