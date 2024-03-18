import { useParams } from "react-router-dom";
import { usePost, useUser } from "../hooks";
import FullPost from "../components/FullPost";
import Spinner from "../components/Spinner";
import Appbar from "../components/AppBar";

export default function Post() {
  const { id } = useParams();
  const { post, loading } = usePost({
    id: String(id),
  });
  const { userId } = useUser();

  if (loading) {
    return (
      <>
        <Appbar />
        <div className="h-screen flex flex-col justify-center">
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </>
    );
  } else if (post) {
    return (
      <>
        <div>
          {userId}
          <FullPost post={post} />
        </div>
      </>
    );
  }
}
