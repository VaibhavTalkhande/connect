"use client"
import useClipboard  from 'react-use-clipboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs'
import { ClipboardCopyIcon, ClipboardIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import { BarLoader } from 'react-spinners';
import toast, { Toaster } from 'react-hot-toast';
import { url } from 'inspector';

const DashBoard = () => {
    const {isLoaded,user} = useUser();
     console.log(user);
    const [isCopied, setCopied] = useClipboard('http://localhost:3000/'+user?.username
      , {
        successDuration: 1000,
      }
    );
  return (
    <div className='h-full w-full'>
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
                <form className="flex flex-row w-full items-center" > 
                  <input  type="text" placeholder="" defaultValue={user?.username || ""}
                      className='border  border-gray-300 p-2 rounded'
                  />
                  <button type='submit' className="bg-blue-500 text-white p-2 rounded">Update</button>
                </form>
                URL
                <div className="flex flex-row items-center">
                  <span className="border text-slate-300  border-gray-300 bg-slate-500 p-2 rounded">
                  http://localhost:3000/{user?.username}
                  </span>
                  <button onClick={setCopied} className={`${isCopied ? 'bg-green-500' : 'bg-blue-500'} text-white p-2 rounded`}>
                    <ClipboardIcon size={24} />
                  </button>
                </div>
                
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