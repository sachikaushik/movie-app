import toastr from "@/lib/toastr";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Email is invalid";
        isValid = false;
      }
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        toastr.success("Login successful");
        setTimeout(() => {
          router.push("/movie");
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error("Login error:", errorData);
        toastr.error("Login failed: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Network error:", error);
      toastr.error("Login failed due to a network error.");
    }
  }

  return (
    <div className="p-8 w-[400px]">
      <h2 className="text-center text-white text-6xl font-semibold mb-8 text-[var(--font-montserrat)]">
        Sign in
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-2 border-red-500 focus:ring-red-500"
                : "focus:ring-green-500"
            }`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) validateInputs();
            }}
          />
          {errors.email && <p className="mt-2 text-red-500">{errors.email}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            className={`w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-2 border-red-500 focus:ring-red-500"
                : "focus:ring-green-500"
            }`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) validateInputs();
            }}
          />
          {errors.password && (
            <p className="mt-2 text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-gray-400">
              Remember me
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#2BD17E] text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Login
        </button>
      </form>
    </div>
  );
}
