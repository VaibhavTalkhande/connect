"use client"
import React, { use, useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import { GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Role } from "@/types/ModelTypes";
import { Trash2Icon, Youtube } from "lucide-react";



// Define the roles


// Define the Zod schema for form validation
const UserSchema = z.object({
  role: z.enum(["MENTOR", "MENTEE"]),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be at most 500 characters"),
  expertise: z
    .array(z.string())
    .min(1, "Please specify at least one area of expertise")
    .max(10, "You can specify up to 10 areas of expertise"),
  socials: z
    .array(z.object({
      platform: z.string(),
      link: z.string().optional(),
    }))
    .optional(),
});

const socials = [
  { platform: "LinkedIn", link: "" },
  { platform: "Twitter", link: "" },
  { platform: "GitHub", link: "" },
  { platform: "Instagram", link: "" },
  { platform: "YouTube", link: "" },
];

 const suggestedFields = [
   "web development",
   "machine learning",
   "data science",
   "blockchain",
   "artificial intelligence",
   "cloud computing",
   "cyberSecurity",
 ];
// Type for the form inputs
type UserFormInput = z.infer<typeof UserSchema>;

const OnboardingForm: React.FC = () => {
  const {user,setUser} = useContext(AuthContext)
  const [expertise, setExpertise] = useState<string[]>([]);
  const [social, setSocial] = useState<{ platform: string; link: string }[]>(socials);
  const [Tag, setTag] = useState("");
  const router = useRouter();

  const handleSocialChange = (platform: string, link: string) => {
    const newSocial = social.map((social) =>
      social.platform === platform ? { ...social, link } : social
    );
    setSocial(() => newSocial);
    
    setValue("socials", newSocial);
  };
 const {
   control,
   register,
   handleSubmit,
   setValue,
   watch,
   getValues,
   formState: { errors},
 } = useForm<UserFormInput>({
   resolver: zodResolver(UserSchema),
   defaultValues: {
     role: "MENTEE",
     name: "",
     bio: "",
     expertise: [],
     socials: [],
   },
 });
  const setRole = (e: string) => {
    if (e === "MENTEE") {
      setValue("role", e);
    }
    if (e === "MENTOR") {
      setValue("role", e);
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
  const watchValue = watch("socials");

  // Form submit handler
  const onSubmit = async (data: UserFormInput) => {
    console.log("Form data:", data);
    try {
      const res = await axios.post("/api/user/onboarding", data);
      if (res.status === 200) {
        console.log(res.data.message);

        const updatedUser = res.data.user; // Use the updated user directly
        setUser(updatedUser);
        console.log(updatedUser);
        console.log("User updated successfully");
  
         if (updatedUser.role === Role.MENTEE) {
          console.log("User is a mentee");
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  useEffect(() => {
    if (user && user.role) {
      router.push("/dashboard");
    }
  }
  , [user]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="onboarding-form max-w-2xl mx-auto p-6 bg-white shadow-md rounded-3xl space-y-6 flex flex-col"
    >
      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <Controller
          render={({ field }) => (
            <select
            {...field}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            id="role"
            onChange={(e) => {
              setRole(e.target.value)
            }}
            >
              <option value="MENTOR">Mentor</option>
              <option value="MENTEE">Mentee</option>
            </select>
          )}
          name="role"
          control={control}
        />
        {errors.role && (
          <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="Enter your name"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700"
        >
          Bio
        </label>
        <textarea
          id="bio"
          placeholder="Tell us a bit about yourself"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...register("bio")}
        />
        {errors.bio && (
          <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>

      {/* Expertise */}
      <div>
        <Label
          htmlFor="expertise"
          className="block text-sm font-medium text-gray-700"
        >
          Domain
        </Label>
        <div className="flex flex-row space-x-2">
          <input
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="text"
            value={Tag}
            onChange={(e) => setTag(e.target.value)}
            id="expertise"
          />
          <Button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleExpertise(Tag, "add")}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-start space-x-2 space-y-2 mt-2 ">
          {suggestedFields.map((tag) => (
            <Button
              key={tag}
              type="button"
              className="bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleExpertise(tag, "add")}
            >
              {tag}
            </Button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-start  space-x-2 justify-start">
          {expertise.map((tag) => (
            <div key={tag} className="h-full flex items-center justify-between bg-blue-500  max-w-1/2  border-none rounded">
              <p className="text-white px-2">{tag}</p>
              <Button
                type="button"
                className="h-full  text-red-700 font-bold bg-inherit text-2xl pl-0 rounded-r-xl border-none items-center text-center  "
                onClick={() => handleExpertise(tag, "remove")}
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
        </div>
        {errors.expertise && (
          <p className="text-red-500 text-sm">{errors.expertise.message}</p>
        )}
      </div>

      {/* Social links */}
      <div className="flex flex-col w-full ">
        <label className="block text-sm font-medium text-gray-700">
          Social links(optional)
        </label>
        <div className="flex items-center flex-row flex-wrap gap-2">
          {socials.map((social) => (
            <div key={social.platform} className="mt-2 min-w-[45%]">
              <Label
                htmlFor={social.platform}
                className="flex items-center space-x-2"
              >
                {social.platform === "YouTube" && <Youtube />}
                {social.platform === "LinkedIn" && <LinkedInLogoIcon />}
                {social.platform === "Twitter" && <TwitterLogoIcon />}
                {social.platform === "GitHub" && <GitHubLogoIcon />}
                {social.platform === "Instagram" && <InstagramLogoIcon />}
                <span>{social.platform}</span>
              </Label>
              <input
                type="text"
                id={social.platform}
                onChange={(e) =>
                  handleSocialChange(social.platform, e.target.value)
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          ))}
          {errors.socials && (
            <p className="mt-2 text-sm text-red-600">{errors.socials.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center w-full">
        <Button
          type="submit"
          className="bg-black lg:w-1/2 hover:bg-blue-700 text-white items-center justify-center font-bold py-2 px-4 rounded"
          
        >
          submit
        </Button>
      </div>
    </form>
  );
};

export default OnboardingForm;
