import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    //check if user is admin
    const isAdmin = false;
    const isUser = false;
    const isTutor = false;
    if (isAdmin) {
      //redirect to login page if user is not admin
      navigate("/admin/dashboard");
    }
    if (isTutor) {
      //redirect to login page if user is not admin
      navigate("/tutor/dashboard");
    }
    if (isUser) {
      //redirect to login page if user is not admin
      navigate("/user/dashboard");
    }
  });
  return (
    <>
      <h1>Pagina Home</h1>
      <p>Esta es la pagina inicial</p>
      <Link to="/about">Ir a About...</Link>
    </>
  );
}
