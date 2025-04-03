import React, { useEffect, useMemo, useState, useContext } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useWallet } from "@solana/wallet-adapter-react";
import api from "./Api";


 
// This component will handle the wallet context and the wallet address display
const WalletContextConsumer = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState("no address");

    const { select, wallets, connected, publicKey, disconnect } = useWallet();
    const walletAddress = connected && publicKey ? publicKey.toBase58() : "No Wallet Connected";

    useEffect(() => {
        async function fetchData() {
            const response = await api.get("https://bricks-1i79.onrender.com/get-wallet")
            // , { credentials: "include" }
            const result = response.data
            if (result) {
                setAddress(result.address)
                console.log(result);

                // const walletProvider = wallets.find((w) => w.readyState === "Installed");
                // if (walletProvider) select(walletProvider.adapter.name);
            } else {
                setAddress("Not connected")
            }

        }
        fetchData()
    }, [])

    useEffect(() => {
        const handleDisconnect = async () => {
            console.log("🚫 Wallet disconnected");
            try {
                await api.post("https://bricks-1i79.onrender.com/disconnect-wallet")
                setAddress("No Wallet Connected");
                setIsConnected(false);
            } catch (error) {
                console.log(error);
            }

        };

        if (window.solana) {
            window.solana.on("disconnect", handleDisconnect);
        }

        return () => {
            if (window.solana) {
                window.solana.off("disconnect", handleDisconnect);
            }
        };
    }, []);



    useEffect(() => {
        if (connected && publicKey) {
            console.log("✅ Connection started");
            const walletAddress = publicKey.toBase58();
            setAddress(walletAddress);

            async function fetchData() {
                try {
                    const response = await api.post("https://bricks-1i79.onrender.com/connect-wallet", { address: walletAddress })
                    const result = response.data.address
                    if (result) {
                        setAddress(result)
                    }
                    console.log("Backend response:", response.data)
                } catch (error) {
                    console.error("Error sending wallet address:", error)
                }
            }
            fetchData();
        } else {
            console.log("❌ Wallet not connected");
            setAddress("No Wallet Connected");
        }

    }, [connected, publicKey]);

};

// This component will wrap the app in the necessary providers
const WalletProviderComponent = ({ children }) => {
    const endpoint = clusterApiUrl("devnet");

    // Initialize wallet adapter list correctly
    const wallet = useMemo(() => [], []);


    return (
        <ConnectionProvider endpoint={endpoint}>
       <WalletProvider wallets={wallet} autoConnect>
           <WalletModalProvider>
              <WalletContextConsumer />
               { children }
           </WalletModalProvider>
       </WalletProvider>
   </ConnectionProvider>
    );
};

export default WalletProviderComponent;
