import { useEffect, useState } from "react";
import { BACKEND_URl } from "../config";
import axios from "axios";

interface Post {
  content: string;
  title: string;
  id: number;
  author: {
    name: string;
  };
}

export default function usePosts() {
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
