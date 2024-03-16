import { Link } from "react-router-dom";
import { Avatar } from "./PostCard";

export default function Appbar() {
  return (
    <>
      <div className="border-b flex justify-between px-10 py-4 items-center">
        <Link className="cursor-pointer" to={"/posts"}>
          <div>Blogging App</div>
        </Link>
        <div>
          <Link to={"/publish"}>
            <button
              type="button"
              className="mr-4 focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-2xl text-sm px-5 py-2.5 me-2 mb-2"
            >
              New Post
            </button>
          </Link>

          <Avatar name="Rahmatdeep" size={"big"} />
        </div>
      </div>
    </>
  );
}
