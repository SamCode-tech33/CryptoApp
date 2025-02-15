import { createReducer, createAction } from "@reduxjs/toolkit";

const GO_CONVERT = "GO_CONVERT";

const convertReducer = createReducer(
  [
    {
      value: "Bitcoin ",
      id: 1,
      completed: false,
    },
    {
      value: "Etherium ",
      id: 2,
      completed: false,
    },
    {
      value: "Monero ",
      id: 3,
      completed: false,
    },
  ],
  (builder) => {
    builder.addCase("GO_CONVERT", () => {});
  }
);

export const goCoin = createAction(GO_CONVERT);

export default convertReducer;

// const List = () => {
//   const todos = useAppSelector((state: any) => state.todos);
//   const dispatch = useAppDispatch();

//   return (
//     <div>
//       <button onClick={() => dispatch(addTodo())}>Add Stuff</button>
//       {todos.map((todo: any, index: any) => (
//         <li key={todo.id}>
//           {todo.value}
//           <button onClick={() => dispatch(toggleTodo(index))}>
//             {todo.completed ? "done" : "pending"}
//           </button>
//           <button onClick={() => dispatch(removeTodo(todo))}>DELETE</button>
//         </li>
//       ))}
//     </div>
//   );
// };
