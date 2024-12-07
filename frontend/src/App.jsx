import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import HomeAbout from "./pages/HomeAbout.jsx";
import HomeAbout2 from "./pages/HomeAbout2.jsx";
import Page404 from "./pages/404.jsx";
import Test from "./pages/Test.jsx";

import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import Dashboard from "./pages/DashboardAdmin.jsx";
import DashboardAlumno from "./pages/DashboardAlumno.jsx";
/* roles
 admin, user (alumno), responsable de proyecto (tutor)
*/
function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeAbout2 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

          <Route path="/admin">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="manage">
              <Route path="users/:userId" element={<Test />} />
            </Route>
          </Route>

          <Route path="/user">
            <Route path="dashboard" element={<DashboardAlumno />} />
          </Route>
          {/* dejar el default para el final */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
