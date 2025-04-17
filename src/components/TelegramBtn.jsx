import React, { useEffect } from "react";

const TelegramConnectPage = () => {
  useEffect(() => {
    window.TelegramLoginWidget = {
      dataOnauth: (user) => {
        console.log("Telegram user connected:", user);
      },
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.setAttribute("data-telegram-login", "Bricksappto_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-radius", "10");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)");
    script.async = true;

    document.getElementById("telegram-button-container").appendChild(script);
  }, []);

  return (
    <div>
      <div>
        <h1>Connect your Telegram</h1>
        <div id="telegram-button-container" />
      </div>
    </div>
  );
};

export default TelegramConnectPage;
