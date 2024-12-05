import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <>
      <div>
        <h1>Error 404: Página no encontrada</h1>
        <img
          src="https://midu.dev/images/this-is-fine-404.gif"
          alt="gif del perro this is fine"
        />
      </div>
      <Link to="/">Volver a Home</Link>
    </>
  );
}
