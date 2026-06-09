import Link from "next/link";
import AppLoading from "../components/app-loading";
import { Suspense } from "react";
import { getApiVersion } from "@/services/api-service";

async function ApiVersion() {
  const apiInfo = await getApiVersion();

  return <p>API Version: {apiInfo.data.version}</p>;
}

// http://localhost:3000/about
export default function AboutPage() {
  return (
    <main>
      <Suspense fallback={ <AppLoading /> }>
        <ApiVersion />
      </Suspense>     
      <hr />
      <Link href="/" className="underline">
        Home Page
      </Link>
    </main>
  );
}
