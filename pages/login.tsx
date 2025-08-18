import {LoginForm, useAuthStore} from "@/src/features/auth";
import {NextPage} from "next";
import Head from "next/head";
import {useRouter} from "next/router";

const LoginPage: NextPage = () => {
  const isAuthorized = useAuthStore(state => state.isAuthorized);
  const router = useRouter();

  if (isAuthorized) {
    router.push((router.query.returnUrl as string) || "/");
  }
  return (
    <>
      <Head>
        <title>Логин</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <LoginForm />
    </>
  );
};

export default LoginPage;
