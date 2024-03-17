import { Post } from "../hooks";
import Appbar from "./AppBar";
import { Avatar } from "./PostCard";

export default function FullPost({ post }: { post: Post }) {
  const timestamp = post.createdOn;
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
  return (
    <>
      <div>
        <Appbar />
        <div className="flex justify-center">
          <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-2xl pt-12">
            <div className=" col-span-8">
              <div className="text-5xl font-extrabold">{post.title}</div>
              <div className="text-slate-500 pt-2">{formattedDate}</div>
              <div className="pt-4">{post.content}</div>
            </div>
            <div className=" col-span-4">
              <div className="text-slate-600 text-lg">Author</div>

              <div className="flex pt-1">
                <div className="pr-4 flex flex-col justify-center">
                  <Avatar name={post.author.name || "Anon"} size="big" />
                </div>
                <div className="pt-1">
                  <div className="text-2xl font-bold">
                    {post.author.name || "Anon"}
                  </div>
                  <div className="pt-2 text-slate-500">
                    Random catch phrase about the author
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
