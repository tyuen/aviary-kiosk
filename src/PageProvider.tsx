import { useMemo, useState, createContext, useContext } from "react";

const PageContext = createContext({});

export function usePage() {
  return useContext(PageContext);
}

export function PageProvider({ children, def }) {
  const [page, setPage] = useState(def);
  const state = useMemo(() => ({ page, setPage }), [page]);

  return <PageContext.Provider value={state}>{children}</PageContext.Provider>;
}
