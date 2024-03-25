import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface PostCardProps {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

export default function PostCard({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: PostCardProps) {
  const timestamp = publishedDate;
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "Asia/Kolkata",
  };
  const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(date);
  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current === null) {
      return;
    }
    (contentRef.current as HTMLElement).innerHTML = content;
  });
  return (
    <>
      <Link to={`/post/${id}`}>
        <div className="p-4 border-b border-slate-200 pb-4 overflow-clip w-screen lg:max-w-3xl max-w-screen  cursor-pointer">
          <div className="flex">
            <div className="">
              <Avatar name={authorName} size={"small"} />
            </div>
            <div className="flex justify-center flex-col font-extralight pl-2 text-sm">
              {authorName}
            </div>

            <div className="flex justify-center flex-col pl-2 font-thin text-slate-500">
              {formattedDate}
            </div>
          </div>
          <div className="text-xl font-semibold pt-2">{title}</div>
          <div
            className="text-md font-thin line-clamp-2"
            ref={contentRef}
          ></div>
          <div className="pt-4 text-slate-500 text-sm font-thin ">
            {`${Math.ceil(content.length / 500)} minute(s)`}
          </div>
        </div>
      </Link>
    </>
  );
}

export function Avatar({
  name,
  size = "small",
}: {
  name: string;
  size?: "small" | "big";
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${
        size === "small" ? "w-6 h-6" : "w-14 h-14"
      } overflow-hidden bg-gray-100 rounded-full`}
    >
      <span className="font-extralight text-gray-800">
        {name[0]?.toUpperCase()}
      </span>
    </div>
  );
}
