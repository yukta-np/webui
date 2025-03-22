import { AppWrapper } from "@/app-context";
import { UserWrapper } from "@/user-context";
import SecuredLayout from "@/components/Layout/SecuredLayout";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { Spin } from "antd";
import { Suspense, useEffect, useState } from "react";
import { clearStorageAndRedirect, getLoggedInUser } from "@/utils";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App({ Component, pageProps }) {
   const router = useRouter();
   const path = router.pathname;
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
      setIsClient(true); // Mark that we're on the client side
   }, []);

   // Client-side only logic
   useEffect(() => {
      if (
         !path.endsWith("/") &&
         !path.endsWith("/auth/login") &&
         !path.endsWith("/auth/register") &&
         !path.endsWith("/auth/verify") &&
         !path.endsWith("/auth/password") &&
         !path.endsWith("/auth/reset-password")
      ) {
         const user = getLoggedInUser();
         if (!user?.userId) {
            clearStorageAndRedirect();
         }
      }
   }, [path]);

   if (
      path.endsWith("/") ||
      path.endsWith("/auth/login") ||
      path.endsWith("/auth/register") ||
      path.endsWith("/auth/verify") ||
      path.endsWith("/auth/password") ||
      path.endsWith("/auth/reset-password")
   ) {
      return (
         <AppWrapper>
            <Component {...pageProps} />
         </AppWrapper>
      );
   }

   if (!isClient) {
      // Render a loading state or nothing during server-side rendering
      return <Spin size="large" />;
   }

   return (
      <ErrorBoundary>
         <UserWrapper>
            <AppWrapper>
               <SecuredLayout>
                  <Component {...pageProps} />
               </SecuredLayout>
            </AppWrapper>
         </UserWrapper>
      </ErrorBoundary>
   );
}