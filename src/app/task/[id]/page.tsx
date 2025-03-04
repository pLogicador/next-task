"use client";

import Head from "next/head";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/services/firebaseConnection";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import styles from "./style.module.css";
import { Textarea } from "@/components/textarea/index";
import { useSession } from "next-auth/react";

export default function TaskDetail() {
  const [item, setItem] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: session } = useSession();
  const [input, setInput] = useState("");

  async function handleComment(event: FormEvent) {
    event.preventDefault();

    if (input === "") return;
    if (!session?.user?.email || !session?.user?.name) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      });

      setInput("");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function loadTask() {
      if (!id) return;

      const docRef = doc(db, "tasks", id);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        router.push("/");
        return;
      }

      const data = snapshot.data();
      const miliseconds = data?.created?.seconds * 1000;

      const taskData = {
        task: data?.task,
        public: data?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: data?.user,
        taskId: id,
      };

      setItem(taskData);
    }

    loadTask();
  }, [id, router]);

  if (!item) return null;

  return (
    <div className={styles.container}>
      <Head>
        <title>Task - task detail</title>
      </Head>

      <main className={styles.main}>
        <h1> {session?.user?.name}</h1>
        <article className={styles.task}>
          <p>
            <strong>Task</strong> {item.task}
          </p>
          <div className={styles.divider}></div>

          <p>
            <strong>Created</strong> {item.created}
          </p>
          <div className={styles.divider}></div>

          <p>
            <strong>Public:</strong> {item.public ? "Yes" : "No"}
          </p>
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Leave your comment below</h2>

        <form onSubmit={handleComment}>
          <Textarea
            placeholder="Type your comment..."
            value={input}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(event.target.value)
            }
          />
          <button disabled={!session?.user} className={styles.button}>
            Send comment
          </button>
        </form>
      </section>
    </div>
  );
}
