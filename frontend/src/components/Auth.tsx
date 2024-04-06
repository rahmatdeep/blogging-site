import { SingupInput, signupInput } from "@rahmatdeep/blogging-app-common";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URl } from "../config";
import { SubmitHandler, UseFormRegister, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Auth({ type }: { type: "signup" | "signin" }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<SingupInput>({
    resolver: zodResolver(signupInput),
  });

  const navigate = useNavigate();
  const sendRequest: SubmitHandler<SingupInput> = async (data) => {
    try {
      const response = await axios.post(
        `${BACKEND_URl}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        data
      );
      const jwt = response.data.jwt;
      localStorage.setItem("token", `Bearer ${jwt}`);
      const username = await axios.get(`${BACKEND_URl}/api/v1/user`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      localStorage.setItem("username",username.data.name)
      navigate("/posts");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.log(e.message);
        if (e.response) {
          setError("root", {
            message: e.response.data.msg,
          });
          // alert(e.response.data.msg);
        }
      } else {
        console.error("An unexpected error occurred", e);
      }
    }
  };

  return (
    <>
      <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center ">
          <div>
            <div
              className={`${
                type === "signup" ? "px-10" : "px-6"
              } flex flex-col items-center`}
            >
              <div className="text-3xl font-extra-bold ">
                {type === "signup"
                  ? "Create An Account"
                  : "Login to your Account"}
              </div>
              <div className="text-slate-400 pt-2">
                {type === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <Link
                  className="pl-2 underline"
                  to={type === "signin" ? "/signup" : "/signin"}
                >
                  {type === "signin" ? "Sign Up" : "Sign in"}
                </Link>
              </div>
            </div>
            <form onSubmit={handleSubmit(sendRequest)}>
              {type === "signup" && (
                <LabeledInput
                  label="Name"
                  placeholder="Rahmatdeep Singh"
                  register={register}
                  name="name"
                  disabled={isSubmitting}
                />
              )}
              {type === "signup" && errors.name && (
                <div className="text-red-500 w-full text-left pt-1">
                  {errors.name.message}
                </div>
              )}
              <LabeledInput
                label="Email"
                name="email"
                placeholder="rahmatdeep@gmail.com"
                register={register}
                disabled={isSubmitting}
              />
              {errors.email && (
                <div className="text-red-500 w-full text-left pt-1">
                  {errors.email.message}
                </div>
              )}
              <LabeledInput
                label="Password"
                placeholder="password"
                register={register}
                name="password"
                inputType="password"
                disabled={isSubmitting}
              />
              {errors.password && (
                <div className="text-red-500 w-full text-left pt-1">
                  {errors.password.message}
                </div>
              )}
              {errors.root && (
                <div className="text-red-500 w-full text-left pt-1">
                  {errors.root.message}
                </div>
              )}
              {isSubmitting ? (
                <button
                  disabled
                  type="button"
                  className="text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg w-full text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 inline-flex justify-center items-center"
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
                  Submitting...
                </button>
              ) : (
                <button
                  type="submit"
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium w-full rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-4"
                >
                  {type === "signup" ? "Sign up" : "Sign in"}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  register: UseFormRegister<SingupInput>;
  inputType?: string;
  name: keyof SingupInput;
  disabled: boolean;
}

function LabeledInput({
  label,
  placeholder,
  register,
  inputType,
  name,
  disabled,
}: LabelledInputType) {
  return (
    <div>
      <label className="mt-2 block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        disabled={disabled}
        {...register(name)}
        type={inputType || "text"}
        className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={placeholder}
        required
      />
    </div>
  );
}
