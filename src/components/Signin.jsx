import React, { useState, useEffect, useContext } from "react";
import api from "./Api";
import GoogleLogin from "./GoogleBtn";
import TelegramLogin from "./TelegramBtn";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";


function Signin() {
    const [isLoading, setisLoading] = useState(false);
    const { isRegistered, updateRegistrationStatus } = useContext(AuthContext);
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
     const [visible, setVisible] = useState(false)
    const navigate = useNavigate();
  

    const emailLength = email.length === 0;
    const passwordLength = password.length === 0;

    useEffect(()=>{
        const checkRegistration = async () => {
            const response = await api.get('https://bricks-1i79.onrender.com/isAuthenticated')
            if (response.data.authenticated) {
                navigate("/")
            }
        } 
        checkRegistration()
   }, [navigate])


    const SigninBtn = async (event) => {
        event.preventDefault();
        try {
            const response = await api.post('https://bricks-1i79.onrender.com/signin', { email, password })
            console.log(response.data)
            if (response.data.success) {
                navigate("/")
            }else{
                setError(response.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleEmailInput = (event) => {
        setEmail(event.target.value)
    };

    const handlePasswordInput = (event) => {
        setPassword(event.target.value)
    };


    return (
        <div>
            <form onSubmit={SigninBtn} className="signin-form">

                <div className="input-contain">
                <label htmlFor="signin-email">Email</label>
                <input onChange={handleEmailInput} type="email" id="signin-email"></input>
                <p> {emailLength ? "Enter Email" : null} </p> 
                </div>

                <div className="signin-contain">
                <label htmlFor="signin-password">Password</label>
                <input onChange={handlePasswordInput} type={visible ? "text" : "password"} id="signin-password"></input>
                <span onClick={()=>{
                    setVisible(!visible)
                }}>{visible ? "hide" : "show"}</span>
                <p> {passwordLength ? "Enter password" : null} </p> 
                </div>

                <button className="signin-btn" disabled={emailLength || passwordLength }> {isLoading ? "Loading..." : "Signin"} </button>
            </form>
            <p>{error}</p>

            <GoogleLogin btnName="Signin with google"/>
           <TelegramLogin />
        </div>
    )
}



export default Signin;