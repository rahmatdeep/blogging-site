import axios from "axios";
import Appbar from "../components/AppBar";
import { BACKEND_URl } from "../config";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import PublishComponent from "../components/PublishComponent";

export type PublishTypes = {
  title: string;
  content: string;
};

export default function Publish() {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { isSubmitting, errors },
  } = useForm<PublishTypes>();

  const navigate = useNavigate();

  const sendRequest: SubmitHandler<PublishTypes> = async (data) => {
    try {
      const response = await axios.post(`${BACKEND_URl}/api/v1/post`, data, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
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
