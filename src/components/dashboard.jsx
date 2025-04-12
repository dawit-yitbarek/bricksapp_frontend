import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate } from "react-router-dom";
import api from "./Api";

function Dashboard() {
    const [email, setEmail] = useState("---");
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            try {
                let token = localStorage.getItem("accessToken");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const refreshResponse = await api.post(
                    "https://bricksapp-backend.onrender.com/refresh",
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

                const result = await api.get("http://localhost:3000/dashboard", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (result.data.success) {
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
       await api.post("https://bricksapp-backend.onrender.com/logout")
       localStorage.removeItem("accessToken");
       navigate("/signin")
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

export default Dashboard;


