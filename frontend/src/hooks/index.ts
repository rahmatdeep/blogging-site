import { useEffect, useState } from "react";
import { BACKEND_URl } from "../config";
import axios from "axios";

export interface Post {
  content: string;
  title: string;
  id: number;
  createdOn: string;
  author: {
    name: string;
    id: string;
    bio: string;
  };
}



export function usePosts() {
  const [postsLoading, setPostsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URl}/api/v1/post/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setPosts(response.data.posts);
        setPostsLoading(false);
      });
  }, []);

  return {
    postsLoading,
    posts,
  };
}

export function usePost({ id }: { id: string }) {
  const [postLoading, setPostLoading] = useState(true);
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URl}/api/v1/post/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setPost(response.data.post);
        setPostLoading(false);
      });
  }, [id]);

  return {
    postLoading,
    post,
  };
}

export function useUser() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`${BACKEND_URl}/api/v1/user`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setUserId(response.data.id);
        setUserName(response.data.name);
        setUserLoading(false);
      });
  }, []);

  return { userLoading, userId, userName };
}
