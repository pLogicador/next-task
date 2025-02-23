import Image from "next/image";
import Head from "next/head";

import styles from "@styles/page.module.css";
import heroImg from "../../public/assets/images/hero.png";

export default function Home() {
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
            <span>+12 posts</span>
          </section>
          <section className={styles.box}>
            <span>+90 comments</span>
          </section>
        </div>
      </main>
    </div>
  );
}
