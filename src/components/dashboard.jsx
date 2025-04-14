import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate } from "react-router-dom";
import api from "./Api";
import { useWallet } from "@solana/wallet-adapter-react";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
    const [email, setEmail] = useState("---");
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                let token = localStorage.getItem("accessToken");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const refreshResponse = await api.post(
                    `${BackEndUrl}/refresh`,
                    {},
                    { headers }
                );

                if (refreshResponse.data.success) {
                    // Update the token in localStorage if a new one is generated
                    token = refreshResponse.data.accessToken;
                    localStorage.setItem("accessToken", token);
                    console.log("Token refreshed successfully.");
                } else {
                    navigate("/signin");
                    return;
                }

                const result = await api.get(`${BackEndUrl}/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (result.data.success) {
                    console.log(result.data)
                    setEmail(result.data.email);
                } else {
                    navigate("/signin");
                }

            } catch (error) {
                console.log("error on loading dashboard page ", error)
            }
        }

        fetchData();
    }, [navigate])

    async function LogoutBtn() {
        setLoading(true)
        try {
            localStorage.removeItem("walletName"); // Remove adapter's stored wallet name
            localStorage.removeItem("accessToken"); // Remove auth token
            await api.post(`${BackEndUrl}/logout`); // Notify backend
            navigate("/signin");
        } catch (err) {
            console.error("Logout failed", err);
        }finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <h1> {email}</h1>

            <h1>Connect to Solana Wallet</h1>
            <WalletMultiButton className="connectSolBtn" />

            {loading && <span className="spinner"></span>}
            <button onClick={LogoutBtn} style={{display: loading ? "none" : "block"}} >Logout</button>
        </div>
    )

}

export default Dashboard;


