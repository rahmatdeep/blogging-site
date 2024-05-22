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
    formState: { isSubmitting },
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
    <div className="my-4">
      <form onSubmit={handleSubmit(handleCommentSubmit)}>
        <textarea
          {...register("content")}
          placeholder="Write your comment..."
          rows={4}
          className="border rounded-md w-full p-2 focus:outline-none mt-4"
        ></textarea>

        {isSubmitting ? (
          <button
            disabled
            type="button"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-500 rounded-lg focus:ring-4 focus:ring-blue-200  hover:bg-blue-600"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Posting...
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-500 rounded-lg focus:ring-4 focus:ring-blue-200  hover:bg-blue-600"
          >
            Publish Comment
          </button>
        )}
      </form>
      <div>
        <ul className="border-l-4 pl-2 mt-8">
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
                    className="text-red-500 self-start hover:text-red-600 mt-0.5 ml-1 hidden group-hover:block"
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
