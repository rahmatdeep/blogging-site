import { useParams } from "react-router-dom";
import { usePost } from "../hooks";
import FullPost from "../components/FullPost";
import Spinner from "../components/Spinner";
import Appbar from "../components/AppBar";

export default function Post() {
  const { id } = useParams();
  const { post, loading } = usePost({
    id: String(id),
  });

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
          <FullPost post={post} />
        </div>
      </>
    );
  }
}
