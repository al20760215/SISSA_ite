import "./App.css";
import Login from "./pages/Login.jsx";
import HomeAbout from "./pages/HomeAbout.jsx";
import Page404 from "./pages/404.jsx";
import Test from "./pages/Test.jsx";

import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
/* roles
 admin, user (alumno), responsable de proyecto (tutor)
*/
function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeAbout />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin">
            <Route path="dashboard" element={<h2>Admin Dashboard</h2>} />
            <Route path="manage">
              <Route path="users/:userId" element={<Test />} />
            </Route>
          </Route>

          <Route path="/user">
            <Route path="dashboard" element={<h2>User Dashboard</h2>} />
          </Route>
          {/* dejar el default para el final */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
