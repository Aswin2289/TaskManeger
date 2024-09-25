import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceImage from "../assest/service_image1.jpg"; // Ensure correct path
import useLogin from "../hooks/use-login";
import errorMessages from "../services/errorMessages";

// Zod schema for form validation
const schema = z.object({
  username: z.string()
    .refine(val => /\S+@\S+\.\S+/.test(val) || /^[0-9]{10,}$/.test(val), {
      message: "Invalid email or phone number",
    }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const { getLogin } = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await getLogin.mutateAsync(data);
      toast.success("Login successful");

      const role = localStorage.getItem("role");
      switch (role) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
          navigate("/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errorCode
        ? errorMessages[error.response.data.errorCode] ||
          errorMessages["UNKNOWN_ERROR"]
        : "An unknown error occurred.";
      toast.error(errorMessage);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Navigate to the Forgot Password page
  };

  const handleSignUp = () => {
    navigate("/register"); // Navigate to the Sign Up page
  };
  const handleLogin=()=>{
    navigate("/dashboard");
  }

  return (
    <div className="flex h-screen">
      <ToastContainer theme="colored" autoClose={2000} closeOnClick />

      {/* Left Side - Image */}
      <div
        className="relative w-5/6 bg-cover bg-center"
        style={{ backgroundImage: `url(${ServiceImage})` }}
      >
        {/* Text Overlay */}
      </div>

      {/* Right Side - Form */}
      <div className="w-1/2 flex flex-col items-center justify-center">
        {/* Text Above Login Form */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Please Login to Continue
          </h1>
          <p className="text-gray-600">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-4/5 max-w-md bg-white p-8 rounded-lg shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Email or Phone Number
            </label>
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
              type="text"
              id="username"
              placeholder="Enter your email or phone number"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end mb-6">
            <button
              type="button"
              className="text-sm text-indigo-500 hover:text-indigo-700 focus:outline-none"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login and Sign Up Buttons */}
          <div className="flex flex-col space-y-4">
            <button
              className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
              type="button"
              onClick={handleSignUp}
            >
              Register Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
