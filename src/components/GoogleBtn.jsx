import React from "react";
import api from "./Api";

function GoogleLogin(props){
    async function login(){
        window.location.href = "https://bricks-1i79.onrender.com/auth/google";
    }

    return(
        <button onClick={login}>{props.btnName}</button>
    )
}

export default GoogleLogin;