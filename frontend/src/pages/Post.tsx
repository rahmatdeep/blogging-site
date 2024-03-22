import { useParams } from "react-router-dom";
import { usePost, useUser } from "../hooks";
import FullPost from "../components/FullPost";
import Spinner from "../components/Spinner";
import Appbar from "../components/AppBar";

export default function Post() {
  const { id } = useParams();
  const { post, postLoading } = usePost({
    id: String(id),
  });
  const { userLoading, userName } = useUser();

  const { userId } = useUser();

  if (postLoading || userLoading) {
    return (
      <>
        <Appbar name="" />
        <div className="h-screen flex flex-col justify-center">
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </>
    );
  } else if (post && userName) {
    return (
      <>
        <div>
          <FullPost name={userName} post={post} userId={userId} />
        </div>
      </>
    );
  }
}
