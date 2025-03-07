import { AppWrapper } from "@/app-context";
import { UserWrapper } from "@/user-context";
import SecuredLayout from "@/components/Layout/SecuredLayout";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { Spin } from "antd";
import { Suspense } from "react";

export default function App({ Component, pageProps }) {
   const router = useRouter();
   const isLoginPage = router.pathname === "/auth/login";

   return (
      <Suspense fallback={<Spin size="large" />}>
         <UserWrapper>
            <AppWrapper>
               {isLoginPage ? (
                  <Component {...pageProps} />
               ) : (
                  <SecuredLayout>
                     <Component {...pageProps} />
                  </SecuredLayout>
               )}
            </AppWrapper>
         </UserWrapper>
      </Suspense>
   );
}