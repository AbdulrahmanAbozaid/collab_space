import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./containers/App";
import store from "./redux/store";
import { Provider } from "react-redux";
// import { Buffer } from "buffer";
// import process from "process";

// // // Make Buffer and process available globally
// // if (typeof globalThis !== "undefined") {
// //   globalThis.Buffer = Buffer;
// // }
// globalThis.process = process;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
