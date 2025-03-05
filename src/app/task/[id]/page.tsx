"use client";

import Head from "next/head";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import styles from "./style.module.css";
import { Textarea } from "@/components/textarea/index";
import { useSession } from "next-auth/react";
import { RiDeleteBinLine } from "react-icons/ri";

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

export default function TaskDetail() {
  const [item, setItem] = useState<any>(null);
  const [comments, setComments] = useState<CommentProps[]>([]);
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

      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      };

      setComments((oldItems) => [...oldItems, data]);
      setInput("");
      loadComments();
    } catch (err) {
      console.log(err);
    }
  }

  async function loadComments() {
    if (!id) return;

    const q = query(collection(db, "comments"), where("taskId", "==", id));
    const snapshotComments = await getDocs(q);

    let allComments: CommentProps[] = [];
    snapshotComments.forEach((doc) => {
      allComments.push({
        id: doc.id,
        comment: doc.data().comment,
        user: doc.data().user,
        name: doc.data().name,
        taskId: doc.data().taskId,
      });
    });

    setComments(allComments);
  }

  async function handleDeleteComment(id: string) {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);

      const deleteComment = comments.filter((item) => item.id !== id);

      alert("Comment successfully removed!");
      setComments(deleteComment);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function loadTask() {
      if (!id) return;

      await loadComments();

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

      <section className={styles.commentsContainer}>
        <h2>All comments</h2>

        {comments.length === 0 && <span>No comments yet...</span>}

        {comments.map((item) => (
          <article key={item.id} className={styles.comment}>
            <div className={styles.headComment}>
              <label className={styles.commentsLabel}>{item.name}</label>

              {item.user === session?.user?.email && (
                <button
                  className={styles.buttonTrash}
                  onClick={() => handleDeleteComment(item.id)}
                >
                  <RiDeleteBinLine size={24} color="red" />
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
