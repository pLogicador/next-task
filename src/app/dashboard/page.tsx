"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import Head from "next/head";

export default function Dashboard() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      // Fetch the user session
      const sessionData = await getSession();
      setSession(sessionData);
      if (!sessionData?.user) {
        router.push("/");
      }
    };

    fetchSession();
  }, [router]);

  // Returns `null` to prevent the page from rendering while the redirect happens
  if (!session?.user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>My Task Dashboard</title>
      </Head>

      <h1>Welcome to your Dashboard</h1>
    </div>
  );
}
