import React, { useEffect } from "react";
import api from "./Api";
const FrontEndUrl = import.meta.env.VITE_FRONTEND_URL;
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

const TelegramRedirect = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const telegramData = {};

    queryParams.forEach((value, key) => {
      telegramData[key] = value;
    });

    const connectTelegram = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await api.post(`${BackEndUrl}/connect-telegram`, { telegramData } , {headers: {Authorization: `Bearer ${accessToken}`,},});
        window.location.href = res.data.redirect;
      } catch (err) {
        console.error("Error:", err);
        window.location.href = `${FrontEndUrl}/tasks?tgError=failed to connect telegram account`;
      }
    };
    
    if (telegramData.id) {
      connectTelegram();
    }else {
      window.location.href = `${FrontEndUrl}/tasks?tgError=telegram id not found`;
    }
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white text-lg">
      Connecting your Telegram...
    </div>
  );
};

export default TelegramRedirect;
