import { createReducer, createAction } from "@reduxjs/toolkit";

const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const REMOVE_TODO = "REMOVE_TODO";

const todosReducer = createReducer(
  [
    {
      value: "todo 1",
      id: 1,
      completed: false,
    },
    {
      value: "todo 2",
      id: 2,
      completed: false,
    },
    {
      value: "todo 3",
      id: 3,
      completed: false,
    },
  ],
  (builder) => {
    builder
      .addCase("ADD_TODO", (state) => {
        state.push({ id: Math.random(), value: "4", completed: false });
      })
      .addCase("TOGGLE_TODO", (state, action: any) => {
        const todo = state[action.payload];
        todo.completed = !todo.completed;
      })
      .addCase("REMOVE_TODO", (state, action: any) => {
        return state.filter((todo: any) => todo.id !== action.payload.id);
      });
  }
);

export const addTodo = createAction(ADD_TODO);
export const toggleTodo = createAction(TOGGLE_TODO);
export const removeTodo = createAction(REMOVE_TODO);

export default todosReducer;
