import {RegisterForm, useAuthStore} from "@/src/features/auth";
import {useLoadingAppStore} from "@/src/shared/store";
import {NextPage} from "next";
import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect} from "react";

const RegisterPage: NextPage = () => {
  const isAuthorized = useAuthStore(state => state.isAuthorized);
  const router = useRouter();

  if (isAuthorized) {
    router.push((router.query.returnUrl as string) || "/");
  }

  useEffect(() => {
    useLoadingAppStore.getState().setLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>Регистрация</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <RegisterForm />
    </>
  );
};

export default RegisterPage;
