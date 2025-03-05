"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@styles/page.module.css";
import heroImg from "../../public/assets/images/hero.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

export default function Home() {
  const [posts, setPosts] = useState(0);
  const [comments, setComments] = useState(0);

  async function loadData() {
    try {
      const commentRef = collection(db, "comments");
      const postRef = collection(db, "tasks");

      const commentSnapshot = await getDocs(commentRef);
      const postSnapshot = await getDocs(postRef);

      setPosts(postSnapshot.size);
      setComments(commentSnapshot.size);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    loadData(); // Load data on first render

    // Updates every 60 seconds
    const interval = setInterval(() => {
      loadData();
    }, 60000);

    return () => clearInterval(interval); // Clear the range when leaving the page
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Task logo"
            src={heroImg}
            priority
          />
        </div>

        <h1 className={styles.title}>
          Your time, your rules. Organize your routine and achieve your goals
          without stress.
        </h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{posts} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{comments} comments</span>
          </section>
        </div>
      </main>
    </div>
  );
}
