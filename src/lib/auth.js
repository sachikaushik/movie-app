import { useRouter } from "next/router";
import { useEffect } from "react";

export const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token"); // Check if a token exists
      if (!token) {
        router.replace("/auth/login"); // Redirect to login if not authenticated
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};
