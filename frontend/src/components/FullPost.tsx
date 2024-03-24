import axios from "axios";
import { Post } from "../hooks";
import Appbar from "./AppBar";
import { Avatar } from "./PostCard";
import { BACKEND_URl } from "../config";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function FullPost({
  name,
  post,
  isUser,
}: {
  name: string;
  post: Post;
  isUser: boolean;
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
  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current === null) {
      return;
    }
    (contentRef.current as HTMLElement).innerHTML = post.content;
  }, [contentRef, post]);
  
  return (
    <>
      <div>
        <Appbar name={name} />
        <div className="flex justify-center">
          <div className="lg:grid lg:grid-cols-12 lg:gap-0 px-10 w-full pt-200 max-w-screen-2xl pt-12 flex flex-col gap-5">
            <div className=" lg:col-span-9">
              <div className="flex justify-between items-center">
                <div className="text-5xl font-extrabold">{post.title} </div>
                <p className="pl-6 lg:pr-6">
                  {isUser && (
                    <>
                      <button
                        type="button"
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
                        onClick={() => {
                          navigate(`/edit/${post.id}`);
                        }}
                      >
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
                  )}
                </p>
              </div>
              <div className="text-slate-500 pt-2">{formattedDate}</div>
              <div className="pt-4 anchorstyling" ref={contentRef} ></div>
            </div>
            <hr className="lg:hidden"></hr>
            <div className=" lg:border-l-2 lg:pl-6 lg:col-span-3">
              <div className="text-slate-600 text-lg">Author</div>

              <div className="flex pt-1">
                <div className="pr-4 flex flex-col justify-center">
                  <Avatar name={post.author.name || "Anon"} size="big" />
                </div>
                <div className="pt-1">
                  <div className="text-2xl font-bold">
                    {post.author.name || "Anon"}
                  </div>
                  <div className="pt-1 text-slate-500">{post.author.bio}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

