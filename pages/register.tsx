import {RegisterForm, useAuthStatus} from "@/src/features/auth";
import {NextPage} from "next";
import Head from "next/head";
import {useRouter} from "next/router";

const RegisterPage: NextPage = () => {
  const isAuthorized = useAuthStatus(state => state.isAuthorized);
  const router = useRouter();

  if (isAuthorized) {
    router.push((router.query.returnUrl as string) || "/");
  }

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
