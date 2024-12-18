"use client"
import { UserType } from "@/types/ModelTypes";
import { useEffect, useState, useCallback } from 'react';
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";



const AuthContext = React.createContext < {
    user: UserType | undefined;
    setUser: React.Dispatch<React.SetStateAction<UserType | undefined>>;
} > ({
    user: undefined,
    setUser: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | undefined>(undefined);
    const router = useRouter();
    const value = {
        user,
        setUser,
    };
    const fetchUser = useCallback(async () => {
        if (!user) {
            return;
        }
        const userDetails = await axios.get("/api/user/ValidateUser");
        
        if (userDetails.data.user) {
            const userdata = userDetails.data.user;
            setUser(()=>userdata);
            if (!userdata.role) {
                router.push("/onboarding");
            }
        }
    }, [router,user]);
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export { AuthContext };