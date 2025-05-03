import React, { useState, useEffect } from "react";
import checkAndRefreshToken from "./CheckRegistration";
import { Flame } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner"
import api from "./Api"
const BackendUrl = import.meta.env.VITE_BACKEND_URL;

const StreakCard = (props) => {
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [resetDate, setResetDate] = useState(null);
  const [claimError, setClaimError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const now = new Date();
    let initialReset = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0
    ));

    if (now.getTime() > initialReset.getTime()) {
      initialReset = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0
      ));
    }

    setResetDate(initialReset);
  }, []);

  useEffect(() => {
    if (!resetDate) return;

    const tick = () => {
      const now = new Date();
      const diff = resetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        console.log("Triggering refresh from StreakCard...");
        props.refresh();

        // Set next day's resetDate
        const nextReset = new Date(Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          0, 0, 0
        ));
        setResetDate(nextReset);
        return;
      }

      const hrs = String(Math.floor(diff / 3_600_000)).padStart(2, '0');
      const mins = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0');
      const secs = String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0');
      setTimeLeft(`${hrs}:${mins}:${secs}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [resetDate, props]);

  async function claimDailyReward() {
    setLoading(true)
    await checkAndRefreshToken();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.post(`${BackendUrl}/claim-daily-reward`, {}, { headers: { Authorization: `Bearer ${accessToken}`, }, });
      if (!response.data.success) {
        setClaimError("failed to claim reward");
      }
    } catch (error) {
      setClaimError("failed to claim reward");
      console.error("Error claiming daily reward:", error);
    } finally {
      setLoading(false)
      props.refresh();
    }
  }


  return (
    <div className="bg-gray-900 text-white rounded-3xl shadow-xl p-6 w-full max-w-md mx-auto mt-10">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center mb-4">
          <Flame className="text-white w-12 h-12" />
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-1">{props.currentStreak}</h1>
        <p className="text-lg font-semibold text-white">{props.currentStreak < 2 ? "Day" : "Days"} Streak</p>

        <p className="text-md font-medium mb-6">
          {props.isClaimed
            ? "You've claimed your reward today!"
            : `🎁 Claim today's bonus: ${props.currentStreak * 1000} points`}
        </p>

        {!loading && !props.streakLoding ?
          <button
            onClick={claimDailyReward}
            disabled={props.isClaimed || props.streakLoding}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${props.isClaimed
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
              }`}
          >
            {props.isClaimed ? "Already Claimed Today" : "Claim Now"}
          </button> :
          <LoadingSpinner />}

        <p className="text-sm text-gray-400 mt-2">
          {props.isClaimed ? (
            <>
              Next reward in <span className="text-purple-400">{timeLeft}</span>
            </>
          ) : (
            <>
              You have <span className="text-purple-400">{timeLeft}</span> to claim today's reward
            </>
          )}
        </p>

        <p className="text-red-500 my-1">{claimError}</p>
      </div>
    </div>
  );
};

export default StreakCard;
