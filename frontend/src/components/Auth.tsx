import { SingupInput } from "@rahmatdeep/blogging-app-common";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URl } from "../config";
import { SubmitHandler, UseFormRegister, useForm } from "react-hook-form";

export default function Auth({ type }: { type: "signup" | "signin" }) {
  const { register, handleSubmit } = useForm<SingupInput>();

  const navigate = useNavigate();
  const sendRequest: SubmitHandler<SingupInput> = async (data) => {
    try {
      const response = await axios.post(
        `${BACKEND_URl}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        data
      );
      const jwt = response.data.jwt;
      localStorage.setItem("token", `Bearer ${jwt}`);
      navigate("/posts");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.log(e.message);
        if (e.response) {
          alert(e.response.data.msg);
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
            <div>
              {type === "signup" && (
                <LabeledInput
                  label="Name"
                  placeholder="Rahmatdeep Singh"
                  register={register}
                  name="name"
                />
              )}
              <LabeledInput
                label="Email"
                name="email"
                placeholder="rahmatdeep@gmail.com"
                register={register}
              />
              <LabeledInput
                label="Password"
                placeholder="password"
                register={register}
                name="password"
                inputType="password"
              />
              <button
                onClick={handleSubmit(sendRequest)}
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium w-full rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-4"
              >
                {type === "signup" ? "Sign up" : "Sign in"}
              </button>
            </div>
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
}

function LabeledInput({
  label,
  placeholder,
  register,
  inputType,
  name,
}: LabelledInputType) {
  return (
    <div>
      <label className="mt-2 block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        {...register(name)}
        type={inputType || "text"}
        className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={placeholder}
        required
      />
    </div>
  );
}
