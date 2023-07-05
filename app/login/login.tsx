"use client";

import { Input } from "@material-tailwind/react";
import Link from "next/link";
import { useState } from "react";
import { redirect } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

const getLogin = async ({
   username,
   password,
}: {
   username: string;
   password: string;
}): Promise<{ access_token: string }> => {
   try {
      const { data } = await axios("https://api.keluargamazni.com/api/login", {
         method: "post",
         data: {
            username,
            password,
         },
      });
      return data;
   } catch (error) {
      console.log(error);

      throw error;
   }
};

const Login = () => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const router = useRouter();
   const handleLogin = async () => {
      try {
         const { access_token } = await getLogin({ username, password });
         window.localStorage.setItem("access_token", access_token);
         router.push("/admin");
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <main className="flex flex-col h-screen items-center justify-between p-4 md:p-10">
         <div className="flex h-full w-full md:w-5/12 p-8 items-center justify-center flex-col bg-white rounded-md drop-shadow-sm">
            <Input
               value={username}
               onChange={(e) => {
                  setUsername(e.target.value);
               }}
               label="username"
            />
            <div className="w-full my-4">
               <Input
                  value={password}
                  type="password"
                  onChange={(e) => {
                     setPassword(e.target.value);
                  }}
                  label="password"
               />
            </div>
            <div className="flex flex-row px-8 py-4 w-full">
               <button
                  onClick={handleLogin}
                  className="me-auto bg-blue-200 p-2 rounded-lg"
               >
                  Login
               </button>
               <Link
                  className="bg-green-200 p-2 rounded-lg"
                  href={"/"}
               >
                  Go to Home
               </Link>
            </div>
         </div>
      </main>
   );
};

export default Login;
