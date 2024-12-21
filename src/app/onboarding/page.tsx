"use client"
import OnboardingForm from '@/components/OnBoardingForm';
import {AuthContext} from '@/context/AuthContext';
import React, { useContext } from 'react';



const Onboarding = () => {
  const {user} = useContext(AuthContext);
  if(user?.role){
    if(user && String(user.role) === "MENTOR"){
      return <div className='min-h-screen'>Redirecting to Mentor Dashboard</div>
    }else if(user && String(user.role) === "MENTEE"){
      return <div className='min-h-screen'>Redirecting to Mentee Dashboard</div>
    }
  }
  return (
    <div className='h-full p-4 m-auto'>

        <OnboardingForm/>
    </div>
  );
}

export default Onboarding;
