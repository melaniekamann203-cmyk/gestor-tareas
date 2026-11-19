import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, TaskFormValues } from "../types/task";

const tasksRef = collection(db, "tasks");

export function subscribeToTasks(
  userId: string,
  onData: (tasks: Task[]) => void,
  onError: (error: Error) => void
) {
  const q = query(tasksRef, where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) }))
        .sort((a, b) => b.createdAt - a.createdAt);
      onData(tasks);
    },
    onError
  );
}

export function createTask(userId: string, values: TaskFormValues) {
  return addDoc(tasksRef, {
    ...values,
    completed: false,
    userId,
    createdAt: Date.now(),
  });
}

export function updateTask(
  id: string,
  changes: Partial<TaskFormValues & { completed: boolean }>
) {
  return updateDoc(doc(db, "tasks", id), changes);
}

export function deleteTask(id: string) {
  return deleteDoc(doc(db, "tasks", id));
}