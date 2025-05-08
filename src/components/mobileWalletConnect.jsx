import React, { useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";
import LoadingSpinner from "./LoadingSpinner";

const MobileConnectButton = () => {
  const [loading, setLoading] = useState(false);

  const connectViaDeepLink = () => {
    setLoading(true);

    const dappKeyPair = nacl.box.keyPair();
    localStorage.setItem("dapp_keypair", JSON.stringify({
      publicKey: Array.from(dappKeyPair.publicKey),
      secretKey: Array.from(dappKeyPair.secretKey),
    }));

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: "mainnet-beta",
      app_url: window.location.origin,
      redirect_link: `${window.location.origin}/phantom-redirect`,
    });

    const url = `phantom://v1/connect?${params.toString()}`;
    window.location.href = url;
  };

  return (
    <button
      onClick={connectViaDeepLink}
      disabled={loading}
      className="px-4 py-2 bg-purple-600 text-white rounded"
    >
      {loading ? <LoadingSpinner /> : "Connect Wallet mobile"}
    </button>
  );
};

export default MobileConnectButton;
