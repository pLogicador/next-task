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
          Seu tempo, suas regras. Organize sua rotina e conquiste seus objetivos
          sem estresse.'
        </h1>
      </main>
    </div>
  );
}
