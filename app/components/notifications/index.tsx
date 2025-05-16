import { useState, useEffect } from "react";

export const Notification = ({ noti, message, error }: any) => {
  const [inOut, setInOut] = useState(false);

  useEffect(() => {
    if (noti || error) {
      setInOut(true);
    }
    const timeout = setTimeout(() => setInOut(false), 1870);
    return () => clearTimeout(timeout);
  }, [noti, error]);

  return (
    <div>
      {noti ? (
        <div
          className={`absolute z-10 right-0 top-0 p-4 flex items-center rounded-md bg-green-500/50 ${
            inOut && "notification"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
          <span>{message}</span>
        </div>
      ) : error ? (
        <div
          className={`absolute z-10 right-12 top-0 p-4 flex items-center rounded-md bg-red-500/50 left ${
            inOut && "notification"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 mr-2"
          >
            <path
              fillRule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clipRule="evenodd"
            />
          </svg>
          <span>{message}</span>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
