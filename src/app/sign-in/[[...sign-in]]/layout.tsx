import React, { ReactNode } from 'react';

const SignInLayout = ({ children }: { children: ReactNode }): React.JSX.Element => { 
    return (
        <div className="flex items-center justify-center bg-green-900 bg-opacity-50 z-10 w-full h-screen">
            <main>
                {children}
            </main>

        </div>
    );
};

export default SignInLayout;