import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ProfileProvider } from "components/ProfileProvider";

import ErrorBoundary from "components/ErrorBoundary";
import LazyLoading from "components/LazyLoading";

import MainLayout from "components/layouts/Main";

//routes
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

//lazy loaded routes
const Test = lazySuspense(() => import("./pages/Test"));

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="login" element={<Login />} />
          <Route path="test" element={<Test />} />
        </Route>
      </Routes>
    </Router>
  );
}

const qc = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={qc}>
      <ProfileProvider>
        <AppRoutes />
      </ProfileProvider>
    </QueryClientProvider>
  );
}

function lazySuspense(fn) {
  const Component = lazy(
    fn //n => new Promise(ok => setTimeout(() => ok(fn()), 5000))
  );
  return function (props) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LazyLoading />}>
          <Component {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
}

export default App;
