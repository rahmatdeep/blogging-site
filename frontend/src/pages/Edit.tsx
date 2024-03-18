import { SubmitHandler, useForm } from "react-hook-form";
import Appbar from "../components/AppBar";
import PublishComponent from "../components/PublishComponent";
import { PublishTypes } from "./Publish";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URl } from "../config";
import { useEffect } from "react";

export default function Edit() {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<PublishTypes>({
    defaultValues: {
      content: "",
      title: "",
    },
  });

  const navigate = useNavigate();

  const sendRequest: SubmitHandler<PublishTypes> = async (data) => {
    try {
      const response = await axios.put(
        `${BACKEND_URl}/api/v1/post/${id}`,
        data,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      navigate(`/post/${response.data.id}`);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.log(e.message);

        if (e.response) {
          setError("root", {
            message: e.response.data.msg,
          });
        }
      }
    }
  };

  useEffect(() => {
    axios
      .get(`${BACKEND_URl}/api/v1/post/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setValue("title", response.data.post.title);
        console.log(response.data.post.title);

        setValue("content", response.data.post.content);
      });
  }, [id, setValue]);


  return (
    <>
      <div>
        <Appbar />
      </div>
      <div className="flex flex-col items-center">
        <PublishComponent
          errors={errors}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          register={register}
          sendRequest={sendRequest}
        />
      </div>
    </>
  );
}
