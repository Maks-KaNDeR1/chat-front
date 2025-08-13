import {LoginForm} from "@/src/features/login";
import {NextPage} from "next";
import Head from "next/head";
import {useRouter} from "next/router";

const LoginPage: NextPage = () => {
  const isAuthorized = true;
  const router = useRouter();

  //   if (isAuthorized) {
  //     router.push((router.query.returnUrl as string) || "/");
  //   }

  return (
    <>
      <Head>
        <title>login</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <LoginForm />
    </>
  );
};

export default LoginPage;
