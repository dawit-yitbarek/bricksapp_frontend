import React, { useEffect, useState } from "react";
import api from "./Api";
import ValidateInput from "./ValidateInput";
import GoogleLogin from "./GoogleBtn"
import { useNavigate } from "react-router-dom";

function Register(props) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")
    const [passwordValid, setPasswordValid] = useState(false);
    const [validError, setValidError] = useState("")
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [matchError, setMatchError] = useState("")
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    const [error, setError] = useState("")

    const validated = passwordValid && passwordMatch && email.length > 0;

    useEffect(()=>{
        const checkRegistration = async () => {
            const response = await api.get('https://bricks-1i79.onrender.com/isAuthenticated')
            if (response.data.authenticated) {
                navigate("/")
            }
        } 
        checkRegistration()
   }, [navigate])

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await api.post('https://bricks-1i79.onrender.com/register', { email, password })
            // console.log(response.data)
            // if (response.data.success) {
            //     navigate("/")
            // }
            // && response.data.success === false
            if (response.data.message ) {
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
        const value = event.target.value;
        setPassword(value)
        setPasswordValid(ValidateInput(value))
        setValidError("Password must have 6 characters and have to contain number and letter")
        if (value !== confirmedPassword) {
            setPasswordMatch(false)
            setMatchError("Passwords must much each other")
        }else if(value === confirmedPassword){
            setPasswordMatch(true)
        }
    };

    const handlePasswordConfirm = (event) => {
        const value = event.target.value;
        setConfirmedPassword(value)
        if (value !== password) {
            setPasswordMatch(false)
            setMatchError("Passwords must much each other")
        }else{
            setPasswordMatch(true)
            setMatchError("")
        }
        
    };


    return (
        <div>
            <h1 className="register-title" id="register-title">Registration page</h1>
            <form onSubmit={handleSubmit} className="register-form" id="register-form">
                <div className="input-contain">
                <label htmlFor="register-email"> Email </label>
                <input type="email" name="email" value={email} onChange={handleEmailInput} className="register-email" id="register-email"></input>
                </div>

                <div className="input-contain">
                <label htmlFor="register-password">Password</label>
                <input type={visible ? "text" : "password"} name="password" value={password} onChange={handlePasswordInput} className="register-password" id="register-password"></input>
                <span onClick={()=>{
                    setVisible(!visible)
                }}>{visible ? "hide" : "show"}</span>
                {!passwordValid ? <p>{validError}</p> : null}
                </div>

                <div className="input-contain">
                <label htmlFor="confirm-password">Password</label>
                <input type={visible ? "text" : "password"} name="confirm-password" value={confirmedPassword} onChange={handlePasswordConfirm} className="confirm-password" id="confirm-password"></input>
                {!passwordMatch ? <p>{matchError}</p> : null}
                </div>

                <button type="submit" className="register-btn" id="register-btn" style={{backgroundColor: validated ? "white" : "black"}} disabled={!validated ? true : false} >Signup</button>
            </form>

            <p>{ error ? error : null }</p>

            <GoogleLogin btnName="Signup with google"/>
        </div>
    )

};

export default Register;



