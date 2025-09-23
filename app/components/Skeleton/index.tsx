import { HTMLAttributes } from "react";

export const Skeleton = ({
  classTail,
}: { classTail?: string } & HTMLAttributes<HTMLDivElement>) => {
  return <div className={`blinking-load ${classTail}`}></div>;
};
