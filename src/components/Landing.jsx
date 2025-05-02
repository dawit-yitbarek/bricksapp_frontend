import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import checkAndRefreshToken from "./checkRegistration";
import api from "./Api";

const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function Landing() {
  const navigate = useNavigate();

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  useEffect(() => {
    const token = getCookie("accessToken");
    if (token) {
      localStorage.setItem("accessToken", token);
    }
  }, [])


  async function checkRegistration() {
    try {
      const isAuthenticated = await checkAndRefreshToken()
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.log("error on landing component refresh", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white font-sans">


      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-gray-800 bg-opacity-60 backdrop-blur-md shadow-lg rounded-b-2xl">
        <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          🚀 AirdropX
        </h1>
        <button
          onClick={checkRegistration}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-6 py-2 rounded-full font-semibold text-lg transition shadow-md"
        >
          Join Now
        </button>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 animate-fade-in">
        <h2 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent mb-8 drop-shadow-md py-3">
          Claim Free Crypto Airdrops Instantly
        </h2>
        <p className="text-lg sm:text-2xl text-gray-300 max-w-2xl mx-auto mb-10">
          Instant crypto rewards, no strings attached. Join the future of decentralized opportunity — where your wallet meets real value.
        </p>
        <button
          onClick={checkRegistration}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg transition hover:scale-105"
        >
          🚀 Get Started
        </button>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-3xl mx-6 p-12 shadow-2xl mb-20">
        <h3 className="text-4xl font-bold text-center mb-14 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          How It Works
        </h3>
        <div className="grid gap-12 sm:grid-cols-3 text-center">
          <div className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-6">🔗</div>
            <h4 className="text-2xl font-semibold mb-4">Connect Wallet</h4>
            <p className="text-gray-400">Use Phantom, Solflare, or any Solana wallet to get started.</p>
          </div>
          <div className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-6">📝</div>
            <h4 className="text-2xl font-semibold mb-4">Complete Tasks</h4>
            <p className="text-gray-400">Engage with projects, refer friends, and maximize your rewards.</p>
          </div>
          <div className="p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-5xl mb-6">🎁</div>
            <h4 className="text-2xl font-semibold mb-4">Claim Rewards</h4>
            <p className="text-gray-400">Unlock exclusive benefits and enjoy special perks.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Landing;
