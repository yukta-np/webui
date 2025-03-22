import { AppWrapper } from "@/app-context";
import { UserWrapper } from "@/user-context";
import SecuredLayout from "@/components/Layout/SecuredLayout";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { Spin } from "antd";
import { Suspense, useEffect } from "react";
import { clearStorageAndRedirect, getLoggedInUser } from "@/utils";

export default function App({ Component, pageProps }) {
   const router = useRouter();
   const path = router.pathname;
   const isLoginPage = path === "/auth/login";

   useEffect(() => {
      if (!getLoggedInUser()?.userId) {
         clearStorageAndRedirect();
      }
   }, []);

   if (
      path.endsWith("/") ||
      path.endsWith("/auth/login") ||
      path.endsWith("/auth/verify") ||
      path.endsWith("/auth/set-password") ||
      path.endsWith("/auth/reset-password")
   ) {
      return (
         <AppWrapper>
            <Component {...pageProps} />
         </AppWrapper>
      );
   }

   if (!getLoggedInUser()?.userId) {
      return null; 
   }

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
      // </Suspense>
   );
}