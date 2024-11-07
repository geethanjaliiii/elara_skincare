import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "@/context/CartContext";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./store/store";
import { AddressProvider } from "./context/AddressContext.jsx";
import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const queryClient= new QueryClient();

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
          <AddressProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AddressProvider>
          </QueryClientProvider>
        </Provider>
      </BrowserRouter>
    </StrictMode>
  </GoogleOAuthProvider>
)
