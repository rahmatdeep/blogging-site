import axios from "axios";
import { Post } from "../hooks";
import Appbar from "./AppBar";
import { Avatar } from "./PostCard";
import { BACKEND_URl } from "../config";
import { useNavigate } from "react-router-dom";

export default function FullPost({
  post,
  userId,
}: {
  post: Post;
  userId: string;
}) {
  const navigate = useNavigate();
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
          <div className="lg:grid lg:grid-cols-12 lg:gap-0 px-10 w-full pt-200 max-w-screen-2xl pt-12 flex flex-col gap-5">
            <div className=" lg:col-span-8">
              <div className="flex justify-between items-center">
                <div className="text-5xl font-extrabold">{post.title} </div>
                <p className="">
                  {userId === post.author.id ? (
                    <>
                      <button
                        type="button"
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
                      onClick={()=>{
                        navigate(`/edit/${post.id}`)
                      }}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
                        onClick={() => {
                          axios
                            .delete(`${BACKEND_URl}/api/v1/post/${post.id}`, {
                              headers: {
                                Authorization: localStorage.getItem("token"),
                              },
                            })
                            .then(() => {
                              navigate("/posts");
                            });
                        }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </p>
              </div>
              <div className="text-slate-500 pt-2">{formattedDate}</div>
              <div className="pt-4">{post.content}</div>
            </div>
            <hr className="lg:hidden"></hr>
            <div className=" lg:col-span-4">
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
