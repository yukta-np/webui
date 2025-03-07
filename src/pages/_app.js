import { AppWrapper } from "@/app-context";
import SecuredLayout from "@/components/Layout/SecuredLayout";
import "@/styles/globals.css";
import { UserWrapper } from "@/user-context";
import { Spin } from "antd";
import { Suspense } from "react";

export default function App({ Component, pageProps }) {
   return (
      <Suspense fallback={<Spin size="large" />} >
         <UserWrapper>
            <AppWrapper>
               <SecuredLayout>
                  <Component {...pageProps} />;
               </SecuredLayout>
            </AppWrapper>
         </UserWrapper>
      </Suspense>
   )
}