import { useParams } from "react-router-dom";
export default function Test() {
  const params = useParams();
  console.log(params);
  return <h2>Administrar usuario con ID = {params.userId}</h2>;
}
