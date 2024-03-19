import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Post from "./pages/Post";
import Posts from "./pages/Posts";

import "./App.css";
import Publish from "./pages/Publish";
import Edit from "./pages/Edit";
import User from "./pages/User";
import Home from "./pages/Home";
import PrivateRoutes from "./utils/PrivateRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Home />} path="/" />
            <Route path="/user" element={<User />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/publish" element={<Publish />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
