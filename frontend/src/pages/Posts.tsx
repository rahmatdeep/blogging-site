import Appbar from "../components/AppBar";
import PostCard from "../components/PostCard";
import usePosts from "../hooks";

export default function Posts() {
  const { loading, posts } = usePosts();

  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <>
      <div>
        <Appbar />
        <div className="flex justify-center pt-4">
          <div className="">
            {posts.map((post) => (
              <PostCard
                id={post.id}
                authorName={post.author.name || "Anon"}
                title={post.title}
                content={post.content}
                publishedDate="X"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
