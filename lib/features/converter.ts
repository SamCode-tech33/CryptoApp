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
