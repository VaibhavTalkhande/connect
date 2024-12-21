import React, { ReactNode } from 'react';

const SignInLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className=" flex items-center justify-center bg-teal-600  z-10 w-full h-[100vh]">
            <main>
                {children}
            </main>

        </div>
    );
};

export default SignInLayout;