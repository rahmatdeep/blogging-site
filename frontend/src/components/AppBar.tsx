import { Link } from "react-router-dom";
import { Avatar } from "./PostCard";
import { useUser } from "../hooks";

export default function Appbar() {
  const { userName } = useUser();

  return (
    <>
      <div className="border-b flex justify-between px-10 py-4 items-center">
        <Link className="cursor-pointer" to={"/posts"}>
          <div className="text-xl font-medium">Blogging App</div>
        </Link>
        <div>
          <Link to={"/publish"}>
            <button
              type="button"
              className="mr-4 focus:outline-none text-black bg-slate-100 hover:bg-slate-200  font-small rounded-lg text-md px-3 py-2 "
            >
              New Post
            </button>
          </Link>

          <Avatar name={userName} size={"big"} />
        </div>
      </div>
    </>
  );
}
