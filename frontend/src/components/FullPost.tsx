import axios from "axios";
import { Post } from "../hooks";
import Appbar from "./AppBar";
import { Avatar } from "./PostCard";
import { BACKEND_URl } from "../config";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function FullPost({
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
        <Appbar />
        <div className="flex justify-center">
          <div className="lg:grid lg:grid-cols-12 lg:gap-0 px-10 w-full pt-200 max-w-screen overflow-clip lg:max-w-screen-2xl pt-12 flex flex-col gap-5">
            <div className=" lg:col-span-9">
              <div className="flex lg:flex-row flex-col-reverse lg:justify-between lg:items-center">
                <div className="text-5xl font-extrabold overflow-clip">
                  {post.title}
                </div>
                <p className="lg:pl-6 lg:pr-6 ">
                  {isUser && (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2.5 py-1.5  "
                        onClick={() => {
                          navigate(`/edit/${post.id}`);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="30"
                          height="30"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5.034,43.754l2.928-11.7	c0.044-0.175,0.135-0.336,0.263-0.464l23.39-23.395c1.599-1.599,4.196-1.599,5.795,0l4.392,4.392c1.601,1.603,1.604,4.2-0.001,5.799	L18.411,41.781c-0.128,0.128-0.289,0.219-0.465,0.263l-11.7,2.924C5.515,45.15,4.851,44.486,5.034,43.754z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M5.001,41.985v2.001h1.001v-2.001	H5.001z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M42.001,13.539v2.001h1.001v-2.001	H42.001z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill="#fff"
                            fill-rule="evenodd"
                            d="M6.005,41.997	l2.928-11.7l23.39-23.395c1.208-1.208,3.172-1.208,4.38,0l4.392,4.392c1.212,1.212,1.212,3.176,0,4.384l-23.39,23.395L6.005,41.997z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M6.005,41.997l1.756-7.015	l5.259,5.259L6.005,41.997z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M5.034,41.754l2.928-11.7	c0.044-0.175,0.135-0.336,0.263-0.464l23.39-23.395c1.599-1.599,4.196-1.599,5.795,0l4.392,4.392c1.601,1.603,1.604,4.2-0.001,5.799	L18.411,39.781c-0.128,0.128-0.289,0.219-0.465,0.263l-11.7,2.924C5.515,43.15,4.851,42.486,5.034,41.754z M7.379,40.623	l9.813-2.453l23.196-23.199c0.819-0.817,0.821-2.148-0.001-2.969L35.995,7.61c-0.817-0.817-2.148-0.817-2.965,0L9.835,30.809	L7.379,40.623z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M33.807,21.506l-7.312-7.312	c-0.391-0.391-0.391-1.024,0-1.415c0.391-0.391,1.024-0.391,1.415,0l7.312,7.312c0.391,0.391,0.391,1.024,0,1.415	C34.831,21.897,34.198,21.897,33.807,21.506z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M36.731,18.582l-7.312-7.312	c-0.391-0.391-0.391-1.024,0-1.415c0.391-0.391,1.024-0.391,1.415,0l7.312,7.312c0.391,0.391,0.391,1.024,0,1.415	C37.755,18.973,37.122,18.973,36.731,18.582z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-1.5 me-2 "
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="30"
                          height="30"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M6.998,11.997l0.001-1.999	c0-1.656,1.343-3,3-3h28c1.656,0,3,1.344,3,3v1.999c0,0.552-0.449,1-1,1H7.998C7.445,12.997,6.997,12.549,6.998,11.997z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M8.999,40.993l-0.001-2.001h30.001v2	c0,1.657-1.344,3-3,3h-24C10.342,43.991,8.999,42.649,8.999,40.993z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill="#fff"
                            fill-rule="evenodd"
                            d="M9.999,38.997v-29h28v29	c0,1.104-0.899,1.997-2.003,1.997h-24C10.893,40.994,9.999,40.101,9.999,38.997z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M8.999,38.997v-29	c0-0.551,0.448-1,1-1h28c0.551,0,1,0.449,1,1v29c0,1.66-1.351,2.997-3.003,2.997h-24C10.339,41.994,8.999,40.654,8.999,38.997z M36.999,38.997v-28h-26v28c0,0.552,0.445,0.997,0.997,0.997h24C36.551,39.994,36.999,39.546,36.999,38.997z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill="#fff"
                            fill-rule="evenodd"
                            d="M7.998,9.997	l0.001-1.999c0-1.104,0.896-2,2-2h28c1.104,0,2,0.896,2,2v1.999H7.998z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M6.998,9.997l0.001-1.999	c0-1.656,1.343-3,3-3h28c1.656,0,3,1.344,3,3v1.999c0,0.552-0.449,1-1,1H7.998C7.445,10.997,6.997,10.549,6.998,9.997z M38.999,8.997V7.998c0-0.551-0.449-1-1-1h-28c-0.552,0-1,0.449-1,1.001L8.998,8.997H38.999z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M17.999,4.997c0-2.207,1.792-4,4-4h4	c2.207,0,4,1.793,4,4c0,0.552-0.449,1-1,1c-0.552,0-1-0.448-1-1c0-1.101-0.899-2-2-2h-4c-1.103,0-2,0.899-2,2c0,0.552-0.449,1-1,1	C18.447,5.997,17.999,5.549,17.999,4.997z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M22.998,34.998v-19	c0-0.551,0.448-1,1-1c0.551,0,1,0.449,1,1v19c0,0.552-0.449,1-1,1C23.446,35.998,22.998,35.55,22.998,34.998z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M14.998,34.998v-19	c0-0.551,0.448-1,1-1c0.551,0,1,0.449,1,1v19c0,0.552-0.449,1-1,1C15.446,35.998,14.998,35.55,14.998,34.998z"
                            clip-rule="evenodd"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            d="M30.997,34.998v-19	c0-0.551,0.448-1,1-1c0.551,0,1,0.449,1,1v19c0,0.552-0.449,1-1,1C31.445,35.998,30.997,35.55,30.997,34.998z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </p>
              </div>
              <div className="text-slate-500 pt-2">{formattedDate}</div>
              <div className="pt-4 anchorstyling" ref={contentRef}></div>
            </div>
            <hr className="lg:hidden"></hr>
            <div className=" lg:border-l-2 lg:pl-6 lg:col-span-3 pb-4 lg:pb-4">
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
