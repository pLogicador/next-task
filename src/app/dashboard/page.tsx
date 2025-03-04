"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import Head from "next/head";
import { Textarea } from "@/components/textarea";

import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdContentCopy } from "react-icons/md";

interface HomeProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: string;
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadTasks() {
      if (!session?.user?.email) return;

      const tasksRef = collection(db, "tasks");
      const q = query(
        tasksRef,
        orderBy("created", "desc"),
        where("user", "==", session.user.email)
      );

      onSnapshot(q, (snapshot) => {
        let list = [] as TaskProps[];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            created: doc.data().created,
            public: doc.data().public,
            task: doc.data().task,
            user: doc.data().user,
          });
        });

        setTasks(list);
      });
    }

    loadTasks();
  }, [session?.user?.email]);

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

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );

    alert("URL copied successfully!");
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tasks", id);
    await deleteDoc(docRef);
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

          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PUBLIC</label>
                  <button
                    className={styles.shareButton}
                    onClick={() => handleShare(item.id)}
                  >
                    <MdContentCopy size={22} color="#04d960" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.task}</p>
                  </Link>
                ) : (
                  <p>{item.task}</p>
                )}

                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteTask(item.id)}
                >
                  <RiDeleteBinLine size={24} color="red" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
