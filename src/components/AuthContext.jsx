import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isRegistered, setIsRegistered] = useState(false);

    const updateRegistrationStatus = (status) => {
        setIsRegistered(status);
    };

    return (
        <AuthContext.Provider value={{ isRegistered, updateRegistrationStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
