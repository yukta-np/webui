import SecuredLayout from "@/components/Layout/SecuredLayout";
import "@/styles/globals.css";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
   const router = useRouter();
   const isLoginPage = router.pathname === "/auth/login";

   return isLoginPage ? (
      <Component {...pageProps} />
   ) : (
      <SecuredLayout>
         <Component {...pageProps} />
      </SecuredLayout>
   );
}
