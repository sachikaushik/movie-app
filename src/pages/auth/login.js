import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(email, password);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    console.log(response);
    localStorage.setItem("token", response.token);
    alert("Login successful");
    setTimeout(() => {
      router.push("/movie");
    }, 1000);
  }

  return (
    <>
      <div class="p-8 w-[400px]">
        <h2 class="text-center text-white text-6xl font-semibold mb-8 text-[var(--font-montserrat)]">
          Sign in
        </h2>

        <form action="#" onSubmit={handleSubmit}>
          <div class="mb-6">
            <label for="email" class="block mb-2 text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              class="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block mb-2 text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              class="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-gray-400">
                Remember me
              </label>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-[#2BD17E] text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
