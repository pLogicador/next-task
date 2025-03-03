"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import Head from "next/head";
import { Textarea } from "@/components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

import { db } from "../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";

interface HomeProps {
  user: {
    email: string;
  };
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if (input === "" || !session?.user?.email) return;
    try {
      await addDoc(collection(db, "tasks"), {
        task: input,
        created: new Date(),
        user: session.user.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (err) {
      console.log(err);
    }
  }

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

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Welcome to your Dashboard</h1>

            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Type your task here..."
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(event.target.value)
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Make it public</label>
              </div>

              <button className={styles.button} type="submit">
                Register
              </button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>My Tasks</h1>

          <article className={styles.task}>
            <div className={styles.tagContainer}>
              <label className={styles.tag}>PUBLIC</label>
              <button className={styles.shareButton}>
                <FiShare2 size={22} color="#04d960" />
              </button>
            </div>

            <div className={styles.taskContent}>
              <p>My first example task!</p>
              <button className={styles.trashButton}>
                <FaTrash size={24} color="red" />
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
