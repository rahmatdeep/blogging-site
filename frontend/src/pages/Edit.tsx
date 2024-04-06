import { SubmitHandler, useForm } from "react-hook-form";
import Appbar from "../components/AppBar";
import PublishComponent from "../components/PublishComponent";
import { PublishTypes } from "./Publish";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URl } from "../config";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

export default function Edit() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
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
        setLoading(false);
      });
  }, [id, setValue]);

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
  } else {
    return (
      <>
        <div>
          <Appbar />
        </div>
        <div className="flex flex-col items-center">
          <PublishComponent
            control={control}
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
}
