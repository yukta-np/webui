import SecuredLayout from "@/components/Layout/SecuredLayout";
import "@/styles/globals.css";
import { Spin } from "antd";
import { Suspense } from "react";

export default function App({ Component, pageProps }) {
   return (
      <Suspense fallback={<Spin size="large" />} >
         <SecuredLayout>
            <Component {...pageProps} />;
         </SecuredLayout>
      </Suspense>
   )
}