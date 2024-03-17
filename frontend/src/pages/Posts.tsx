import Appbar from "../components/AppBar";
import PostCard from "../components/PostCard";
import Skeleton from "../components/Skeleton";
import { usePosts } from "../hooks";

export default function Posts() {
  const { loading, posts } = usePosts();

  if (loading) {
    return (
      <div>
        <Appbar />
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
        <Appbar />
        <div className="flex justify-center pt-4">
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
        </div>
      </div>
    </>
  );
}
