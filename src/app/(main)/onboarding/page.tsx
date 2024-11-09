
"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import { UserType } from "../../../types/ModelTypes";

import { Alert } from "@/components/ui/alert";
import axios from "axios";

const MentorFormSchema = z.object({
  role: z.enum(["MENTOR", "MENTEE"]),
  bio: z.string().optional(),
  expertise: z.array(z.string()).optional(),
});

type MentorFormType = z.infer<typeof MentorFormSchema>;

const Onboarding = () => {
  const user = useUser();
  const userId = useSearchParams().get("userId") as string;
  const [currentUserInfo, setCurrentUserInfo] = useState<UserType>();
  const [expertise, setExpertise] = useState<string[]>([]);
  const [Tag, setTag] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<MentorFormType>({
    resolver: zodResolver(MentorFormSchema),
    defaultValues: {
      role: "MENTEE",
      bio: "",
      expertise: [],
    },
  });
  const [serverResponse, setServerResponse] = useState<string>("");
  const onSubmit = async (data: MentorFormType) => {
    console.log(data);
    const response = await axios.post(`/api/onboarding/${userId}`, data);
    if (response.status === 200) {
      console.log(response.data.name);
      setCurrentUserInfo(response.data);
      setServerResponse("Successfully onboarded!");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
        setServerResponse("");
      }, 3000);
      if (roleofuser === "MENTEE") {
        router.push("/find-mentors");
      } else {
        router.push("/availability");
      }
    }
  };
  const watchedValues = watch(); // Watch for changes
  console.log(watchedValues); // This will log the current form values
  const [alert, setAlert] = useState(false);
  const [roleofuser, setRoleofuser] = useState<string>("");
  const setRole = (e: string) => {
    if (e === "MENTEE") {
      setValue("role", e);
      setRoleofuser(e);
      console.log(e);
    }
    if (e === "MENTOR") {
      setValue("role", e);
      setRoleofuser(e);
      console.log(e);
    }
  };

  const handleExpertise = (e: string, action: string) => {
    if (action === "add" && e && !expertise.includes(e)) {
      const data = [...expertise, e];
      setExpertise(() => data);
      setValue("expertise", data);
      setTag("");
    } else if (action === "remove") {
      const data = expertise.filter((tag) => tag !== e);
      setExpertise(() => data);
      setValue("expertise", data);
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    setCount(() => count + 1);
    if (!userId) {
      return;
    }
    try {
      const user = await fetch(`/api/getuser/${userId}`)
        .then((res) => res.json())
        .then((data) => data);
      setCurrentUserInfo(user);
      console.log(user);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const getUserCallback = useCallback(getUser, []);
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    getUserCallback();
  }, []);
  const suggestedFields = [
    "web development",
    "machine learning",
    "data science",
    "blockchain",
    "artificial intelligence",
    "cloud computing",
    "cyberSecurity",
  ];
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-10 px-5">
      Onboarding {count}
      {!user.isLoaded && <BarLoader color="#2563EB" width={"100%"} />}
      <div className="text-center mb-6">
        {isSubmitSuccessful && alert && (
          <Alert
            onMouseDown={() => setAlert(false)}
            className="dark:bg-gray-800 dark:text-gray-100"
          >
            {serverResponse}
          </Alert>
        )}
        <Image
          src={
            currentUserInfo?.imageUrl ??
            "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yb0lGcm4zRWt2SFZiSlh2T1EwY3RBYmlISDcifQ"
          }
          alt="user"
          width={100}
          height={100}
          className="rounded-full mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800">{`Welcome ${currentUserInfo?.name}`}</h1>
        <h2 className="text-lg text-gray-600 mt-2">
          Please fill the following details to get started
        </h2>
      </div>
      <div className="text-center mb-8">
        {isLoading && <BarLoader color="#2563EB" width={"100%"} />}
        <h1 className="text-xl font-medium text-gray-700">
          {currentUserInfo?.clerkUserId}
        </h1>
        <h2 className="text-lg font-medium text-gray-700">
          {currentUserInfo?.name}
        </h2>
        <p className="text-gray-600">{currentUserInfo?.username}</p>
        <p className="text-gray-600">{currentUserInfo?.email}</p>
        <p className="text-gray-600">{currentUserInfo?.role}</p>
        <p className="text-gray-600">{currentUserInfo?.bio}</p>
        <p className="text-gray-600">{currentUserInfo?.expertise}</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Who are You, Mentee or Mentor?
            </h3>
            <p className="text-sm text-gray-600">
              Mentees are the people who are looking for mentor/expert. Mentors
              are the people who are mentoring others.
            </p>
            <div className="flex space-x-4">
              <Button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setRole("MENTEE")}
              >
                Mentee
              </Button>
              <Button
                type="button"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setRole("MENTOR")}
              >
                Mentor
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="block text-gray-700">
              What is your bio?
            </Label>
            <textarea
              id="bio"
              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm">{errors.bio.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-700">
              {roleofuser === "MENTEE"
                ? "What do you want to learn?"
                : "What expertise do you have?"}
            </h3>
            <Label htmlFor="expertise" className="block text-gray-700">
              Expertise
            </Label>
            <div className="flex flex-row  w-full ">
              <input
                className="mt-1 block  relative rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                value={Tag}
                onChange={(e) => setTag(e.target.value)}
              />

              <Button
                type="button"
                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleExpertise(Tag, "add")}
              >
                Add
              </Button>
            </div>
            <div className="flex relative flex-wrap items-center space-x-2 space-y-2 mt-2">
              {suggestedFields.map((tag) => {
                return (
                  <Button
                    key={tag}
                    type="button"
                    className="bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleExpertise(tag, "add")}
                  >
                    {tag}
                  </Button>
                );
              })}
            </div>
            <div className="mt-2 space-y-1">
              {expertise.map((tag) => (
                <div key={tag} className="flex items-center justify-between">
                  <p className="text-gray-700">{tag}</p>
                  <Button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    onClick={() => handleExpertise(tag, "remove")}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {errors.expertise && (
              <p className="text-red-500 text-sm">{errors.expertise.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;
