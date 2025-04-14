import React, { useEffect, useRef } from "react";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function TelegramLogin() {
  const telegramWrapperRef = useRef(null);

  useEffect(() => {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://telegram.org/js/telegram-widget.js?22';
    scriptElement.setAttribute('data-telegram-login', 'Bricksappto_bot'); // Your bot username
    scriptElement.setAttribute('data-size', 'large');
    scriptElement.setAttribute('data-auth-url',`${BackEndUrl}/auth/telegram`); 
    scriptElement.async = true;

    if (telegramWrapperRef.current) {
      telegramWrapperRef.current.appendChild(scriptElement);
    }
  }, []);

  return (
    <div ref={telegramWrapperRef}></div>
  );
}

export default TelegramLogin;
