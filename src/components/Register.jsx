import React, { useEffect, useState } from "react";
import api from "./Api";
import ValidateInput from "./ValidateInput";
import GoogleLogin from "./GoogleBtn"
import { useNavigate } from "react-router-dom";

function Register(props) {
   const navigate = useNavigate()
       const [email, setEmail] = useState("")
       const [password, setPassword] = useState("")
       const [confirmedPassword, setConfirmedPassword] = useState("")
       const [passwordValid, setPasswordValid] = useState(false);
       const [validError, setValidError] = useState("")
       const [passwordMatch, setPasswordMatch] = useState(false);
       const [matchError, setMatchError] = useState("")
       const [visible, setVisible] = useState(false)
       const [error, setError] = useState("")
       const [code, setCode] = useState("")
       const [isCodeError, setIsCodeError] = useState(false)
       const [codeMessage, setCodeMessage] = useState("")
       const [visibleVerify, setVisibleVerify] = useState(false)
       const [loading, setLoading] = useState(false)
   

    const validated = passwordValid && passwordMatch && email.length > 0;

    useEffect(()=>{
        const checkRegistration = async () => {
            const response = await api.post('https://bricksapp-backend.onrender.com/refresh')
            if (response.data.success) {
                navigate("/")
            }
        } 
        checkRegistration()
   }, [navigate])

    const handleSubmit = async (event) => {
        setLoading(true)
        event.preventDefault();

        try {
            const response = await api.post('https://bricksapp-backend.onrender.com/register', { email, password })
            console.log(response.data)
             if (response.data.success) {
                setVisibleVerify(true)
             }
            
            if (response.data.message  && !response.data.success ) {
                setError(response.data.message)
            }
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
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

    const handleVerifyInput = (event) => {
        const val = event.target.value;
        if (/^\d*$/.test(val)) setCode(val); // Allow only digits
    };

    const handleCodeSubmit = async(event)=>{
        setLoading(true)
        event.preventDefault()
        try {
            const response = await api.post('https://bricksapp-backend.onrender.com/verify-email', { code, email });
            if (response.data.success) {
                localStorage.setItem("accessToken", response.data.accessToken);
                navigate("/")
            }
    
            setIsCodeError(true);
            setCodeMessage(response.data.message)
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }


    return (
        <div>

            <div style={ visibleVerify ? {display: "none"} : {display: "block"} }>
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

                {loading && <span className="spinner"></span>}
                <button type="submit" className="register-btn" id="register-btn" style={{display: loading ? "none" : "block"}}  disabled={!validated || loading} >Signup</button>
            </form>

            <p>{ error ? error : null }</p>
            <GoogleLogin btnName="Signup with google"/>
            </div>


            <div style={ visibleVerify ? {display: "block"} : {display: "none"} }>
                <h1>Verify email</h1>
                <p>Verification code sent to {email} Enter the 6 didgit number that sent to your email</p>
                <form onSubmit={handleCodeSubmit}>
                <input type="text" maxLength={6} pattern="\d{6}" name="code" value={code} onChange={handleVerifyInput}></input>
                {loading && <span className="spinner"></span>}
                <button style={{display: loading ? "none" : "block"}}>Verify</button>
                </form>
                <p>{ isCodeError ? codeMessage : null }</p>
            </div>
        </div>
    )

};

export default Register;



