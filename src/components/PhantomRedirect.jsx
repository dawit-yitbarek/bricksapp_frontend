import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import nacl from "tweetnacl";
import bs58 from "bs58";
import api from "./Api";
import { useWalletError } from "./WalletErrorContext";

const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

const PhantomRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const phantomPublicKey = searchParams.get("phantom_encryption_public_key");
        const data = searchParams.get("data");
        const nonce = searchParams.get("nonce");

        if (!phantomPublicKey || !data || !nonce) {
          navigate("/dashboard", { state: { walletError: "Missing Phantom wallet parameters." } });
          return;
        }

        const stored = localStorage.getItem("dapp_keypair");
        if (!stored) {
          navigate("/dashboard", { state: { walletError: "No dApp keypair found. Please reconnect your wallet." } });
          return;
        }

        const { secretKey } = JSON.parse(stored);
        const dappSecretKey = new Uint8Array(secretKey);

        const phantomPublicKeyBytes = bs58.decode(phantomPublicKey);
        const nonceBytes = bs58.decode(nonce);
        const encryptedData = bs58.decode(data);

        const decrypted = nacl.box.open(
          encryptedData,
          nonceBytes,
          phantomPublicKeyBytes,
          dappSecretKey
        );

        if (!decrypted) {
          navigate("/dashboard", { state: { walletError: "Failed to decrypt Phantom payload." } });
          return;
        }

        const decoded = new TextDecoder().decode(decrypted);
        const payload = JSON.parse(decoded);
        const walletAddress = payload.public_key;

        const token = localStorage.getItem("accessToken");
        await api.post(`${BackEndUrl}/connect-wallet`, {
          walletAddress,
          walletName: "Phantom",
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/dashboard");
      } catch (error) {
        console.error("Error in PhantomRedirect:", error);
        navigate("/dashboard", { state: { walletError: "Unexpected error during wallet connection." } });
      }
    };

    run();
  }, [navigate]);

  return <div className="text-center mt-10 text-lg">Connecting...</div>;
};

export default PhantomRedirect;
