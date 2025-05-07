import React, { useEffect, useMemo, useState } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter
} from "@solana/wallet-adapter-wallets";
import api from "./Api";
import { WalletErrorContext } from "./WalletErrorContext";
import checkAndRefreshToken from "./CheckRegistration";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

// Wallet Context Consumer to handle connection/disconnection
const WalletContextConsumer = ({ children }) => {
  const [error, setError] = useState(null);
  const { wallet, connected, publicKey, disconnect } = useWallet();

  const handleDisconnect = async () => {
    try {
      await checkAndRefreshToken();
      const accessToken = localStorage.getItem("accessToken");
      await api.post(`${BackEndUrl}/disconnect-wallet`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      await disconnect();
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
      const walletAddress = publicKey.toBase58();
      const name = wallet?.adapter?.name;

      async function fetchData() {
        try {
          await checkAndRefreshToken();
          const accessToken = localStorage.getItem("accessToken");
          const response = await api.post(`${BackEndUrl}/connect-wallet`, {
            address: walletAddress,
            walletName: name,
          }, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (!response.data.success) {
            setError(response.data.message);
            await handleDisconnect();
            return;
          }

          setError(null);
        } catch (error) {
          setError("Failed to connect wallet");
          console.error("Error sending wallet address:", error);
        }
      }

      fetchData();
    }
  }, [connected, publicKey]);

  return (
    <WalletErrorContext.Provider value={{ error, setError }}>
      {children}
    </WalletErrorContext.Provider>
  );
};

// Main Wallet Provider Component
const WalletProviderComponent = ({ children }) => {
  const endpoint = clusterApiUrl("devnet");

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextConsumer>
            {children}
          </WalletContextConsumer>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProviderComponent;
