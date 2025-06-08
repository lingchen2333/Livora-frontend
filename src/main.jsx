import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RWytiPOvEnRUhsVlQoCCLRbbHMDpRbzzzPLdoapwpJ6HiaHWVDWTIMvfC9oFzjlEfdCIUEi7l6oe3oDmrGURL1s00fMgaSezV"
); //stripe publishable key

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </Provider>
  </StrictMode>
);
