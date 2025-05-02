import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import api from './Api';
import Footer from "./Footer";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function Leaderboard() {
  const navigate = useNavigate();
  const [topThree, setTopThree] = useState([]);
  const [others, setOthers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get(`${BackEndUrl}/leaderboard`, {headers: {Authorization: `Bearer ${accessToken}`,},});
        if (response.data?.success) {
          setTopThree(response.data?.topThree);
          setOthers(response.data?.others);
          setCurrentUser(response.data?.currentUser);
        } else {
          console.log("leaderboard response failed ", response.data?.message);
          navigate("/signin");
        }
      } catch (error) {
        console.log("error on fetching data from leaderboard ", error)
      }
    }

    fetchLeaderboard();
  }, []);

  return (

    <div className="min-h-screen w-full bg-[#0c0c1c] text-white font-sans">
      <main>
        <Header leaderboard={true} />

        <section className="px-4 py-12 flex flex-col items-center gap-10">
          <header className="max-w-2xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-purple-400 mb-4">Leaderboard</h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Welcome to the leaderboard! Here you can see the top performers based on points earned.
              Compete with others, climb the ranks, and earn your place among the best. Your current rank and score are shown below.
            </p>
          </header>

          {/* Top 3 */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full" aria-label="Top 3 Users">
            {topThree.map((user) => (
              <article
                key={user.id}
                className={`${user.rank === 1
                  ? "sm:col-span-2 md:col-span-1 order-1"
                  : "order-2"
                  } w-full h-64 rounded-xl flex flex-col items-center justify-center px-4 py-6 bg-[#1a1a2e] text-center`}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-4 border-purple-500">
                  <img src={user.avatar_url || "/img/placeholder.png"} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="font-bold text-white text-base">{user.name}</div>
                <div className="text-yellow-400 text-xl font-bold">{user.point.toLocaleString()}</div>
                <div className="text-sm text-gray-400 mt-1">
                  {user.rank == 1 ? "1st" : user.rank == 2 ? "2nd" : "3rd"}
                </div>
              </article>
            ))}
          </section>

          {/* Others */}
          <section className="bg-[#1a1a2e] w-full rounded-xl py-4 divide-y divide-[#292947]" aria-label="Other Ranked Users">
            {others.map((user, index) => (
              <article key={user.id} className="flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-4 mx-10">
                  <span className="text-gray-400 w-6 text-right">{user.rank}</span>
                  <img src={user.avatar_url || "/img/placeholder.png"} alt={user.name} className="w-10 h-10 rounded-full" />
                  <span className="font-semibold text-white text-base">{user.name}</span>
                </div>
                <div className="text-gray-300 font-semibold text-base mx-10">{user.point.toLocaleString()}</div>
              </article>
            ))}
          </section>

          {/* Current User */}
          <section className="bg-[#1a1a2e] w-full rounded-xl px-6 py-5 relative" aria-label="Current User Rank">
            <div className="absolute -top-3 left-6 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
              Your Rank
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 mx-10">
                <span className="bg-purple-700 text-purple-300 text-xs px-3 py-1 rounded-full font-bold">
                  #{currentUser.rank}
                </span>
                <img
                  src={currentUser.avatar_url || "/img/fallback.png"}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full"
                />
                <div>
                  <div className="text-white font-semibold text-base">{currentUser.name}</div>
                </div>
              </div>
              <div className="text-purple-400 font-bold text-lg mx-10">{currentUser.point?.toLocaleString()} pts</div>
            </div>
          </section>
        </section>
      </main>

      <Footer />
      </div>

  );
}

export default Leaderboard;
