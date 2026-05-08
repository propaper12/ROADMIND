import { Navigate, useParams } from "react-router-dom";

export function ResultPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <Navigate to="/" replace />;
  }
  return <Navigate to={`/projects/${id}`} replace />;
}
