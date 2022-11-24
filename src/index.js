import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if (process.env.NODE_ENV !== "development") {
  window.addEventListener("contextmenu", e => e.preventDefault(), false);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(reg => {
      var n = document.getElementById("sw_status");
      if (reg.installing) n.textContent = "installing";
      (reg.installing || reg.waiting || {}).onstatechange = e => {
        //"installing" -> "waiting" -> "activated"
        //Note that after "activated", you still need to reload page one more time
        //so that ServiceWorker can cache the external JS/CSS files before
        //you can go offline
        n.textContent = e.target.state;
      };
    });
  }
}
