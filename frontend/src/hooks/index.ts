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
  };
}

interface User {
  userName: string;
  userId: string;
}

export function usePosts() {
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      });
  }, []);

  return {
    loading,
    posts,
  };
}

export function usePost({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      });
  }, [id]);

  return {
    loading,
    post,
  };
}

export function useUser(): User {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

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
      });
  }, []);

  return { userId, userName };
}
