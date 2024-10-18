import { Link } from "react-router-dom";
export default function AboutPage() {
  return (
    <>
      <h1>Pagina About</h1>
      <p>Esta es la pagina acerca de</p>
      <Link to="/">Ir a Home...</Link>
    </>
  );
}
