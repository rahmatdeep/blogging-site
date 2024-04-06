import { useParams } from "react-router-dom";
import { usePost, useUser } from "../hooks";
import FullPost from "../components/FullPost";
import Spinner from "../components/Spinner";
import Appbar from "../components/AppBar";
import { useEffect, useState } from "react";

export default function Post() {
  const { id } = useParams();
  const { post, postLoading } = usePost({
    id: String(id),
  });
  const { userLoading, userName } = useUser();
  const [isUser, setisUser] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const { userId } = useUser();
  useEffect(() => {
    setisUser(post?.author.id === userId ? true : false);
    setIsUserLoading(false)
  }, [post, userId]);

  if (postLoading || userLoading || isUserLoading) {
    return (
      <>
        <Appbar />
        <div className="flex flex-col justify-center">
          <div className="absolute top-1/2 left-1/2 flex justify-center">
            <Spinner />
          </div>
        </div>
      </>
    );
  } else if (post && userName) {
    return (
      <>
        <div>
          <FullPost name={userName} post={post} isUser={isUser} />
        </div>
      </>
    );
  }
}
