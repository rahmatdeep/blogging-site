import { useNavigate } from "react-router-dom";
import Appbar from "../components/AppBar";

export default function User() {
  const navigate = useNavigate();
  return (
    <>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid px-10 gap-5 mb-6 md:grid-cols-2 max-w-screen-lg w-full pt-8">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Name
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Rahmatdeep"
              required
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Bio
            </label>
            <input
              type="text"
              id="last_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Bio"
              required
            />
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/signin");
            }}
            type="button"
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 md:col-span-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
