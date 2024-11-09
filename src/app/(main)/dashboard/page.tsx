"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { BarLoader } from 'react-spinners';

const DashBoard = () => {
    const {isLoaded,user} = useUser();
    // console.log(user);
  return (
    <div>
      {isLoaded ? (
        <div>
          <Card>
            <CardHeader>
                <CardTitle>
                    Welcome {user?.fullName}
                </CardTitle>
            </CardHeader>
            {/* update */}
            <CardContent>
                <form></form>
            </CardContent>
        </Card>
        </div>
        ) : (
            <BarLoader color="#2563EB" width={"100%"} />
        )}
    </div>
  )
}
export default DashBoard;