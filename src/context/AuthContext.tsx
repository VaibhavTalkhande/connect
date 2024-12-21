"use client"
import { UserType } from "@/types/ModelTypes";
import { useEffect, useState, useCallback } from 'react';
import React from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { checkUser } from "@/lib/checkUser";



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

    const pathname = usePathname();
    const value = {
        user,
        setUser,
    };
    const fetchUser = useCallback(async () => {

        try {
            if(user) return user;
            const userDetails = await axios.get("/api/user/ValidateUser");
            if (userDetails.data.user) {
                console.log("this is one",userDetails.data.user);
                const userdata = userDetails.data.user;
                setUser(userdata);
                return userdata;  // Return the data instead
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }, []); // Remove user from dependencies

    useEffect(() => {
        const checkAndRedirect = async () => {
            const userData = await fetchUser();
            if (userData && !userData.role && pathname !== "/onboarding") {
                router.push("/onboarding");
            }
        };
        
        if(!user) checkAndRedirect();
    }, [fetchUser, router,pathname]);
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export { AuthContext };