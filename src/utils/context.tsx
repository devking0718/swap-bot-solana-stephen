import React, { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

interface UserProps {
    id: number;
    email: string;
    password: string;
    status: boolean;
}
interface MainContextProps {
    isLogin: boolean;
    user: UserProps | null;
    setIsLogin: Dispatch<SetStateAction<boolean>>;
    setUser: Dispatch<SetStateAction<UserProps | null>>;
}



const MainContext = createContext<MainContextProps | undefined>(undefined);

export const MainContextProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [user, setUser] = useState<UserProps | null>(null);

    const constextValue: MainContextProps = {
        isLogin,
        user,
        setIsLogin,
        setUser
    }
    return <MainContext.Provider value={constextValue}>{children}</MainContext.Provider>
}

export const useMainContext = () => {
    const context = useContext(MainContext);

    if (!context) {
        throw new Error('MainContext must be used within a MaincontextProvider');
    }
    return context;
}