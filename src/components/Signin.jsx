import React, { useState, useEffect, useContext } from "react";
import api from "./Api";
import GoogleLogin from "./GoogleBtn";
import TelegramLogin from "./TelegramBtn";
import { Navigate, useNavigate } from "react-router-dom";


function Signin() {
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();


    const emailLength = email.length === 0;
    const passwordLength = password.length === 0;

    useEffect(() => {
        const checkRegistration = async () => {
            try {
                const response = await api.post('https://bricksapp-backend.onrender.com/refresh')
                if (response.data.success) {
                    navigate("/")
                }
            } catch (error) {
                console.log("error on signin component refresh", error)
            }
        }
        checkRegistration()
    }, [navigate])


    const SigninBtn = async (event) => {
        setLoading(true)
        event.preventDefault();
        try {
            const response = await api.post('https://bricksapp-backend.onrender.com/signin', { email, password })
            console.log(response.data)
            if (response.data.success) {
                localStorage.setItem("accessToken", response.data.accessToken);
                navigate("/")
            } else {
                setError(response.data.message)
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false)
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
                    <span onClick={() => {
                        setVisible(!visible)
                    }}>{visible ? "hide" : "show"}</span>
                    <p> {passwordLength ? "Enter password" : null} </p>
                </div>


                {loading && <span className="spinner"></span>}
                <button className="signin-btn" disabled={emailLength || passwordLength}> {isLoading ? "Loading..." : "Signin"} </button>
            </form>
            <p>{error}</p>

            <GoogleLogin btnName="Signin with google" />
            <TelegramLogin />
        </div>
    )
}



export default Signin;