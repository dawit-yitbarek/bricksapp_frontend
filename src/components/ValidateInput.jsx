import React from "react";

function ValidateInput(value){
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(value)
}

export default ValidateInput;