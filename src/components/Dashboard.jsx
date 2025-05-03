import React, { useEffect, useState } from "react";
import { RefreshCw, Copy, LogOut } from "lucide-react";
import StreakCard from "./StreakCard";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletError } from "./WalletErrorContext";
import Header from "./Header";
import Footer from "./Footer";
import api from "./Api";
import { LogoutBtn } from './Header';

const BackendUrl = import.meta.env.VITE_BACKEND_URL;
const FrontendUrl = import.meta.env.VITE_FRONTEND_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const { connected, publicKey, disconnect } = useWallet();
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [userInfo, setUserInfo] = useState();
  const [referBonus, setReferBonus] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [streakLoding, setStreakLoading] = useState(false);
  const { error } = useWalletError();

  useEffect(() => {
    async function fetchData() {
      setStreakLoading(true);
      setIsSpinning(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const referbonus = await api.get(`${BackendUrl}/get-referral-bonus`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const response = await api.get(`${BackendUrl}/dashboard`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.data.success) {
          setUserInfo(response.data);
        } else {
          await LogoutBtn();
          return;
        }

        setReferBonus(referbonus.data?.updated.total_bonus);
      } catch (error) {
        console.log("error on fetching data from dashboard ", error);
      } finally {
        setStreakLoading(false);
        setTimeout(() => {
          setIsSpinning(false);
        }, 1000);
      }
    }

    fetchData();
  }, [refreshFlag]);

  return (
    <div className="min-h-screen bg-gray-950 text-white w-full">
      <Header dashboard={true} />

      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
          Welcome Back 👋
        </h2>

        {/* Profile Section */}
        <section className="flex justify-center mb-10 px-2">
          <div className="bg-gray-900 p-5 sm:p-6 rounded-2xl shadow-md flex flex-col items-center text-center border border-gray-800 w-full max-w-md relative">
            <button
              onClick={() => setRefreshFlag((prev) => prev + 1)}
              className="absolute top-4 right-4 text-purple-400 hover:text-purple-200 transition"
              title="Refresh"
            >
              {isSpinning ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
            </button>

            <img
              src={userInfo?.avatar_url || "/img/fallback.png"}
              alt="Avatar"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">{userInfo?.name}</h3>

            {connected && publicKey ? (
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <p className="font-mono text-purple-400">
                  <abbr title={publicKey?.toBase58()} className="cursor-pointer no-underline">
                    {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                  </abbr>
                </p>
                <button onClick={disconnect} className="text-red-400 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <div className="mt-3">
                  <WalletMultiButton />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-2">
                    {error}
                  </p>
                )}
              </>
            )}

            <div className="flex justify-between items-center w-full mt-6 text-sm sm:text-base text-gray-400">
              <div className="text-left">
                <p className="uppercase text-xs mb-1">Your Points</p>
                <p className="text-purple-500 text-xl sm:text-2xl font-bold">{userInfo?.point?.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="uppercase text-xs mb-1">Referrals</p>
                <p className="text-purple-500 text-xl sm:text-2xl font-bold">
                  {userInfo?.referral_number} {userInfo?.referral_number < 2 ? "friend" : "friends"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 px-2">
          <div className="bg-gray-800 p-5 rounded-2xl shadow-md animate-float">
            <h3 className="text-base font-medium mb-2">Referral Earnings</h3>
            <p className="text-2xl sm:text-3xl font-bold text-purple-400">{referBonus?.toLocaleString()} pts</p>
            <p className="text-sm text-gray-300 mt-1">
              You earn <span className="text-purple-400 font-semibold">10%</span> from each referral's points.
            </p>
          </div>

          <div className="bg-gray-800 p-5 rounded-2xl shadow-md animate-float">
            <h3 className="text-base font-medium mb-2">Referrals</h3>
            <p className="text-sm">Get <span className="text-purple-400 font-semibold">500</span> points per referral</p>
            <small className="text-gray-400 break-words text-xs flex items-center gap-2 mt-1">
              {`${FrontendUrl}/register?ref=${userInfo?.referral_code}`}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${FrontendUrl}/register?ref=${userInfo?.referral_code}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
                className="hover:text-purple-300"
              >
                {!copied ? <Copy className="w-4 h-4" /> : "Copied"}
              </button>
            </small>
          </div>

          <div className="bg-gray-800 p-5 rounded-2xl shadow-md animate-float">
            <h3 className="text-base font-medium mb-2">Current Streak</h3>
            <p className="text-2xl sm:text-3xl font-bold text-purple-400">{userInfo?.streak} 🔥</p>
            <p className="text-sm text-gray-300 mt-1">
              Keep it up! <a href="#streakSection" className="text-purple-400 underline">Claim</a> daily to grow your bonus.
            </p>
          </div>
        </section>

        {/* Go to Tasks */}
        <section className="mb-10 px-2">
          <div className="bg-gray-800 p-5 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-1">Wanna earn more points?</h3>
              <p className="text-sm text-gray-400">Explore daily tasks and grow your rewards.</p>
            </div>
            <button
              onClick={() => navigate(`/tasks`)}
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded text-sm w-full sm:w-auto"
            >
              Go to Tasks
            </button>
          </div>
        </section>

        {/* Streak Bonus */}
        <section
          id="streakSection"
          className="bg-gradient-to-r from-purple-800 to-indigo-800 p-5 sm:p-6 rounded-2xl shadow-md border border-purple-700 text-center text-white px-2"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2">🔥 Streak Bonus</h3>
          <p className="text-sm text-gray-200 mb-4">Log in daily to maintain your streak and earn increasing bonus points.</p>

          <StreakCard
            currentStreak={userInfo?.streak}
            currentName={userInfo?.name}
            userInfo={userInfo}
            isClaimed={userInfo?.claimed}
            refresh={() => setRefreshFlag((prev) => prev + 1)}
            streakLoding={streakLoding}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;

