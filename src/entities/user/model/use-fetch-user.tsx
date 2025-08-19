import {useEffect} from "react";
import {useAuthStore} from "@/src/features/auth";
import {getUserByToken} from "../api";
import {useRouter} from "next/router";

export const useFetchUser = () => {
  const {user, isAuthorized, setIsAuthorization, setUser, logout} = useAuthStore(
    state => state
  );
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const router = useRouter();

  useEffect(() => {
    if (!token || isAuthorized || user) return;

    setIsAuthorization();

    (async () => {
      try {
        const res = await getUserByToken(token);

        if (res?.result) {
          setUser(res.result);
        }
      } catch (e) {
        console.error("Ошибка запроса пользователя:", e);
        logout();

        router.push("/");
      }
    })();
  }, [token, setUser]);
};
