import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./store/store";import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
// import ErrorBoundary from "./components/errorBoundary/ErrorBoundary.jsx";
// import ErrorPage from "./pages/404page.jsx";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const queryClient= new QueryClient();

createRoot(document.getElementById("root")).render(

    <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            {/* <ErrorBoundary fallback={<ErrorPage />}> */}
              <App />
            {/* </ErrorBoundary> */}
          </QueryClientProvider>
        </Provider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
)
