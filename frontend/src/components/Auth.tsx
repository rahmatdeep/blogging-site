import { SingupInput } from "@rahmatdeep/blogging-app-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URl } from "../config";

export default function Auth({ type }: { type: "signup" | "signin" }) {
  const [postInputs, setPostInputs] = useState<SingupInput>({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URl}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      const jwt = response.data.jwt;
      localStorage.setItem("token", `Bearer ${jwt}`);
      navigate("/posts");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.log(e.message);
        if (e.response) {
          alert(e.response.data.msg);
          setPostInputs({
            name: "",
            email: "",
            password: "",
          });
        }
      } else {
        console.error("An unexpected error occurred", e);
      }
    }
  }
  return (
    <>
      <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center ">
          <div>
            <div className="px-10">
              <div className="text-3xl font-extra-bold ">
                {type === "signup"
                  ? "Create An Account"
                  : "Login to your Account"}
              </div>
              <div className="text-slate-400">
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
                  value={postInputs.name || ""}
                  onChange={(e) => {
                    setPostInputs((c) => ({
                      ...c,
                      name: e.target.value,
                    }));
                  }}
                />
              )}
              <LabeledInput
                label="email"
                value={postInputs.email}
                placeholder="rahmatdeep@gmail.com"
                onChange={(e) => {
                  setPostInputs((c) => ({ ...c, email: e.target.value }));
                }}
              />
              <LabeledInput
                label="password"
                placeholder="password"
                value={postInputs.password}
                onChange={(e) => {
                  setPostInputs((c) => ({ ...c, password: e.target.value }));
                }}
                inputType="password"
              />
              <button
                onClick={sendRequest}
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
  value: string;
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputType?: string;
}

function LabeledInput({
  value,
  label,
  placeholder,
  onChange,
  inputType,
}: LabelledInputType) {
  return (
    <div>
      <label className="mt-2 block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        type={inputType || "text"}
        className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={placeholder}
        required
      />
    </div>
  );
}
