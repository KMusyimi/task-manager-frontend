import { useSearchParams } from "react-router-dom";

export function useProjectIDSearchParams() {
  const [searchParams] = useSearchParams();

  return searchParams.get('projectID');
}