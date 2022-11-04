import "./Main.css";
import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";

const ANIM1 = {
  transformOrigin: "top",
  animation: "layout1-anim1 0.3s ease-in-out",
};
const ANIM2 = {
  transformOrigin: "top",
  animation: "layout1-anim2 0.3s ease-in-out",
};

export default function Layout() {
  const path = useLocation().pathname;

  const old = useRef(path);
  const klass = useRef(ANIM1);

  if (old.current !== path) {
    old.current = path;
    klass.current = klass.current === ANIM1 ? ANIM2 : ANIM1;
  }

  return (
    <>
      <div className="flex flex-col items-stretch grow" style={klass.current}>
        <Outlet />
      </div>
    </>
  );
}
