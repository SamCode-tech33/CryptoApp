"use client";
import StoreProvider from "./StoreProvider";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { addTodo, toggleTodo, removeTodo } from "@/lib/features/todo";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

//eslint-disable-next-line
const List = () => {
  const todos = useAppSelector((state: any) => state.todos);
  const dispatch = useAppDispatch();

  return (
    <div>
      <button onClick={() => dispatch(addTodo())}>Add Stuff</button>
      {todos.map((todo: any, index: any) => (
        <li key={todo.id}>
          {todo.value}
          <button onClick={() => dispatch(toggleTodo(index))}>
            {todo.completed ? "done" : "pending"}
          </button>
          <button onClick={() => dispatch(removeTodo(todo))}>DELETE</button>
        </li>
      ))}
    </div>
  );
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/coins");
  }, [router]);

  return (
    <StoreProvider>
      <div></div>
    </StoreProvider>
  );
}
