import { Link } from "react-router-dom";
import { Avatar } from "./PostCard";

export default function Appbar() {
  return (
    <>
      <div className="border-b flex justify-between px-10 py-4 items-center">
        <Link className="cursor-pointer" to={"/posts"}>
          <div className="text-xl font-medium">Blogging App</div>
        </Link>
        <div className="flex items-center">
          <Link to={"/publish"}>
            <button
              type="button"
              className="mx-4 focus:outline-none text-black border  hover:bg-slate-50  font-small rounded-lg text-md px-3 py-2 "
            >
              New Post
            </button>
          </Link>
          <Link to={"/user"}>
            <Avatar
              name={String(localStorage.getItem("username"))}
              size={"big"}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
