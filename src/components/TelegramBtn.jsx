import React from "react";

const TelegramConnect = () => {
  const handleTelegramLogin = () => {
    const botName = "Bricksappto_bot";
    const redirectUri = encodeURIComponent("https://bricksapp-backend.onrender.com/refresh");

    const url = `https://oauth.telegram.org/auth?bot=${botName}&origin=${window.location.origin}&embed=1&request_access=write&redirect_uri=${redirectUri}`;

    window.open(url, "_blank", "width=500,height=500");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <button
        onClick={handleTelegramLogin}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg text-lg font-semibold"
      >
        Connect Telegram
      </button>
    </div>
  );
};

export default TelegramConnect;
