import { Link } from "react-router-dom";

interface PostCardProps {
  id: number
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
  return (
    <>
    <Link to={`/blog/${id}`}>
      <div className="p-4 border-b border-slate-200 pb-4 bg-slate-50 w-screen max-w-3xl cursor-pointer">
        <div className="flex">
          <div className="">
            <Avatar name={authorName} size={8} />
          </div>
          <div className="flex justify-center flex-col font-extralight pl-2 text-sm">
            {authorName}
          </div>

          <div className="flex justify-center flex-col pl-2 font-thin text-slate-500">
            {publishedDate}
          </div>
        </div>
        <div className="text-xl font-semibold pt-2">{title}</div>
        <div className="text-md font-thin">{content.slice(0, 150) + "..."}</div>
        <div className="pt-4 text-slate-500 text-sm font-thin">
          {`${Math.ceil(content.length / 100)} minute(s)`}
        </div>
      </div>
      </Link>
    </>
  );
}

export function Avatar({ name, size }: { name: string; size: number }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center w-${size} h-${size} overflow-hidden bg-gray-100 rounded-full`}
    >
      <span className="font-extralight text-gray-800">{name[0]}</span>
    </div>
  );
}
