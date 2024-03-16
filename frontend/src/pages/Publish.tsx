import axios from "axios";
import Appbar from "../components/AppBar";
import { BACKEND_URl } from "../config";
import { ChangeEvent, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Publish() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();
  return (
    <>
      <div>
        <Appbar />
      </div>
      <div className="flex flex-col items-center">
        <div className="max-w-screen-lg w-full pt-8">
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            placeholder="Title"
          ></input>
          <div className="pt-2">
            <TextEditor
              onChange={(e) => {
                setContent(e.target.value);
              }}
            >
              <button
                onClick={async () => {
                  const response = await axios.post(
                    `${BACKEND_URl}/api/v1/post`,
                    {
                      title,
                      content,
                    },
                    {
                      headers: {
                        Authorization: localStorage.getItem("token"),
                      },
                    }
                  );
                  navigate(`/post/${response.data.id}`);
                }}
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-500 rounded-lg focus:ring-4 focus:ring-blue-200  hover:bg-blue-600"
              >
                Publish Post
              </button>
            </TextEditor>
          </div>
        </div>
      </div>
    </>
  );
}

interface TextEditorProps {
  children: ReactNode;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

function TextEditor(props: TextEditorProps) {
  return (
    <div>
      <div className="w-full  mb-4 border border-gray-300 rounded-lg bg-gray-50 ">
        <div className="px-1 py-1 bg-white rounded-t-lg ">
          <textarea
            onChange={props.onChange}
            rows={4}
            className="w-full px-0 text-sm text-gray-900 bg-white border-0  focus:outline-none "
            placeholder="Write the content"
            required
          />
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t ">
          {props.children}
        </div>
      </div>
    </div>
  );
}
