import React, { ReactNode } from 'react';

const SignInLayout = ({ children }: { children: ReactNode }): React.JSX.Element => { 
    return (
        <div className=" absolute top-0 left-0 flex items-center justify-center bg-teal-600  z-10 w-full h-[100vh]">
            <main>
                {children}
            </main>

        </div>
    );
};

export default SignInLayout;