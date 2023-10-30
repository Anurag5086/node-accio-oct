import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import CreateBlog from "./pages/CreateBlog";
import MyBlogs from "./pages/MyBlogs";
import Homepage from "./pages/Homepage";
import Header from "./components/common/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/create-blog" element={<CreateBlog />}></Route>
        <Route path="/my-blogs" element={<MyBlogs />}></Route>
        <Route path="/homepage" element={<Homepage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
