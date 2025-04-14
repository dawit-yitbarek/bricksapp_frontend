import React from "react";
import api from "./Api";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function GoogleLogin(props){
    async function login(){
        window.location.href = `${BackEndUrl}/auth/google`;
    }

    return(
        <button onClick={login}>{props.btnName}</button>
    )
}

export default GoogleLogin;