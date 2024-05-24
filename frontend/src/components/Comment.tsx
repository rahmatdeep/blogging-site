import axios from "axios";
import { BACKEND_URl } from "../config";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { Comment } from "../hooks";

interface CommentFormData {
  content: string;
}

export function CommentComponent({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<CommentFormData>();

  useEffect(() => {
    getComments();
  }, []);

  function getComments() {
    axios
      .get(`${BACKEND_URl}/api/v1/comment/${postId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setComments(response.data.comments);
      });
  }

  const handleCommentSubmit: SubmitHandler<CommentFormData> = async (data) => {
    if (!data.content) return;

    axios
      .post(
        `${BACKEND_URl}/api/v1/comment`,
        {
          content: data.content,
          postId: postId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            userId: localStorage.getItem("userId"),
          },
        }
      )
      .then(() => {
        reset();
        getComments();
      })
      .catch((error) => {
        console.error("Error while adding comment:", error);
      });
  };

  const handleDeleteComment = async (commentId: string) => {
    axios
      .delete(`${BACKEND_URl}/api/v1/comment/${commentId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
          userId,
        },
      })
      .then(() => {
        console.log("Deleted comment successfully");
        getComments();
      })
      .catch((error) => {
        console.error("Error while deleting comment:", error);
      });
  };

  const userId = localStorage.getItem("userId");

  return (
    <div className="lg:mt-10 lg:mb-3">
      <form onSubmit={handleSubmit(handleCommentSubmit)} className="flex flex-col gap-2">
        <textarea
          {...register("content")}
          placeholder="What are your thoughts?"
          rows={1}
          className="border rounded-md w-full p-2 focus:outline-none lg:mt-4"
        ></textarea>

        <button
          type="submit"
          className="inline-flex lg:self-end w-fit items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-500 rounded-lg focus:ring-4 focus:ring-blue-200  hover:bg-blue-600"
        >
          Publish Comment
        </button>
      </form>
      <div>
        <ul className="border-l-2 pl-2 mt-8">
          {comments.map((comment: Comment) => (
            <li key={comment.id} className="mb-5 group">
              <div className="flex gap-1 items-baseline">
                <p className="font-medium">{comment.author.name}</p>
                <p className="text-xs">
                  at{" "}
                  <time>
                    {new Date(comment.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </time>{" "}
                  on{" "}
                  <time>
                    {new Date(comment.createdAt).toLocaleDateString([], {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </p>
                {comment.authorId === userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 self-start hover:text-red-600 mt-0.5 ml-1 lg:hidden lg:group-hover:block"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <p className="ml-1">{comment.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
