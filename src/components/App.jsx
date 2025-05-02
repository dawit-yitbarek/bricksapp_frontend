import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WalletProviderComponent from "./WalletProvider";
import Dashboard from './Dashboard'
import Signin from "./Signin";
import Register from "./Register";
import Landing from "./Landing";
import Tasks from './Tasks';
import Leaderboard from './Leaderboard';
import ForgotPassword from './ForgotPassword';
import AuthRedirect from './AuthRedirect';
import NotFound from './Notfound';
import Terms from './Terms';
import Privacy from './Privacy';



const App = () => {


    return (

        <div>

            <Router>
                <Routes>

                    <Route path="/" element={
                        <WalletProviderComponent>
                            <Landing />
                        </WalletProviderComponent>
                    } />


                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <AuthRedirect signin_up={false}>
                            <WalletProviderComponent>
                                <Dashboard />
                            </WalletProviderComponent>
                        </AuthRedirect>
                    } />


                    <Route path="/tasks" element={
                        <AuthRedirect signin_up={false}>
                            <WalletProviderComponent>
                                <Tasks />
                            </WalletProviderComponent>
                        </AuthRedirect>
                    } />

                    <Route path="/leaderboard" element={
                        <AuthRedirect signin_up={false}>
                            <Leaderboard />
                        </AuthRedirect>
                    } />
                    {/* Protected Routes */}


                    <Route path="/signin" element={
                        <AuthRedirect signin_up={true}>
                            <Signin />
                        </AuthRedirect>
                    } />


                    <Route path="/register" element={
                        <AuthRedirect signin_up={true}>
                            <Register />
                        </AuthRedirect>
                    } />

                    <Route path="/forgot-password" element={
                        <AuthRedirect signin_up={true}>
                            <ForgotPassword />
                        </AuthRedirect>
                    } />

                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>


        </div>
    );
};


export default App;
