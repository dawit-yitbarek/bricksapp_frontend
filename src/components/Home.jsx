import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate } from "react-router-dom";
import api from "./Api";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function Home() {
    const [email, setEmail] = useState("no email");
    const { isRegistered, updateRegistrationStatus} = useContext(AuthContext);
    const navigate = useNavigate()
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await api.get(`${BackEndUrl}/home`)
                if (!response.data.registered) {
                    navigate("/signin")
                }
                setEmail(response.data.email)
                updateRegistrationStatus(response.data.registered)
            } catch (error) {
                console.log("error on loading home page ", error)
            }
        }

        fetchData();
    }, [updateRegistrationStatus])

    async function LogoutBtn(){
       const response = await api.post(`${BackEndUrl}/logout`)
       if (!response.data.failed) {
        navigate("/signin")
       }
    }

    return (
        <div>
            <h1> {email}</h1>

            <h1>Connect to Solana Wallet</h1>
            <WalletMultiButton className="connectSolBtn" />

            <button onClick={LogoutBtn}>Logout</button>
        </div>
    )

}

export default Home;

