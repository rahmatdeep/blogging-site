import { useEffect } from "react";
import Appbar from "../components/AppBar";
import PostCard from "../components/PostCard";
import Skeleton from "../components/Skeleton";
import { usePosts, useUser } from "../hooks";
import { useSearchParams } from "react-router-dom";

export default function Posts() {
  const [pageParams, SetPageParams] = useSearchParams({ page: "1" });
  const page = parseInt(pageParams.get("page") || "1");

  const { postsLoading, posts, totalPages, currentPage } = usePosts({
    getPage: Number(page),
  });
  const { userName, userLoading } = useUser();

  useEffect(() => {
    if (!postsLoading) {
      window.scrollTo(0, 0);
      // Or, if you want to scroll to the AppbarRef element specifically:
      // AppbarRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [postsLoading]);

  const navigateToPage = (newPage: number) => {
    SetPageParams({ page: String(newPage) });
  };

  if (postsLoading || userLoading) {
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
      <div>
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
                onClick={() => navigateToPage(page - 1)}
                type="button"
                className="mr-4 focus:outline-none text-black border  hover:bg-slate-50  font-small rounded-lg text-md px-3 py-2 "
              >
                Prev Page
              </button>
            )}
            {currentPage !== totalPages && (
              <button
                onClick={() => navigateToPage(page + 1)}
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
