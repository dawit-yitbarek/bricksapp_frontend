import React, { useEffect, useMemo, useState, useContext } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useWallet } from "@solana/wallet-adapter-react";
import api from "./Api";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;


 
// This component will handle the wallet context and the wallet address display
const WalletContextConsumer = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [error , setError] = useState(null);

    const { select, wallet, connected, publicKey, disconnect } = useWallet();
    const walletAddress = connected && publicKey ? publicKey.toBase58() : "No Wallet Connected";

    const handleDisconnect = async () => {
        console.log("🚫 Wallet disconnected");
        try {
            await api.post(`${BackEndUrl}/disconnect-wallet`)
            await disconnect()  // Disconnect the wallet from the app
            console.log("wallet disconnect attempt")
            setIsConnected(false);
        } catch (error) {
            console.log(error);
        }

    };


    useEffect(() => {

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
            const name = wallet?.adapter?.name
            console.log("current wallet name", name)

            async function fetchData() {
                try {
                    const response = await api.post(`${BackEndUrl}/connect-wallet`, { address: walletAddress, walletName: name });
                    if (!response.data.success) {
                        setError(response.data.message);
                        console.log(response.data.message);
                        await handleDisconnect();
                        return;
                    }

                    setError(null);
                    console.log("Backend response:", response.data)
                } catch (error) {
                    console.error("Error sending wallet address:", error)
                }
            }
            fetchData();
        } else {
            console.log("❌ Wallet not connected");
        }

    }, [connected, publicKey]);

    return ( <> {error && <p style={{ color: "red" }}>{error}</p>} </> )

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
