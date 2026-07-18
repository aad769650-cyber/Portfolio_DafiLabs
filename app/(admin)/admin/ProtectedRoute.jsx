"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("isAuthenticate"));

    if (auth) {
      setIsAuth(true);
    } else {
      router.replace("/adminLogin");
    }
  }, [router]);

  if (isAuth === null) {
    return null; // or a loading spinner
  }

  return children;
};

export default ProtectedRoute;