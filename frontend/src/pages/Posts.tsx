import { useState, useEffect, useRef } from "react";
import Appbar from "../components/AppBar";
import PostCard from "../components/PostCard";
import Skeleton from "../components/Skeleton";
import { usePosts, useUser } from "../hooks";

export default function Posts() {
  const [page, SetPage] = useState(1);
  const [pageUpdate, setPageUpdate] = useState(false);
  const { postsLoading, posts, totalPages, currentPage } = usePosts({
    getPage: Number(page),
  });
  const { userName, userLoading } = useUser();
  const AppbarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setPageUpdate(false);
    if (AppbarRef.current !== null) {
      window.scrollTo({ top: AppbarRef.current.offsetTop, behavior: "smooth" });
    }
  }, [currentPage]);

  if (postsLoading || userLoading || pageUpdate) {
    return (
      <div>
        <Appbar name="" />
        <div className="flex justify-center pt-4">
          <div>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div ref={AppbarRef}>
        <Appbar name={userName} />
        <div className="flex justify-center pt-4 flex-col items-center">
          <div className="">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                authorName={post.author.name || "Anon"}
                title={post.title}
                content={post.content}
                publishedDate={post.createdOn}
              />
            ))}
          </div>
          <div className="p-4">
            {currentPage > 1 && (
              <button
                onClick={() => {
                  SetPage((prevPage) => prevPage - 1);
                  setPageUpdate(true);
                }}
                type="button"
                className="mr-4 focus:outline-none text-black border  hover:bg-slate-50  font-small rounded-lg text-md px-3 py-2 "
              >
                Prev Page
              </button>
            )}
            {currentPage !== totalPages && (
              <button
                onClick={() => {
                  SetPage((prevPage) => prevPage + 1);
                  setPageUpdate(true);
                }}
                type="button"
                className="mr-4 focus:outline-none text-black border  hover:bg-slate-50  font-small rounded-lg text-md px-3 py-2 "
              >
                Next Page
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
