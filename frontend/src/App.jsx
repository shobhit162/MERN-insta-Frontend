import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/Router";
import { UserProvider } from "./context/UserProvider";
import { LoaderProvider } from "./context/LoaderProvider";
import NavBar from "./components/NavBar";
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <LoaderProvider>
          <NavBar />
          <AppRoutes />
        </LoaderProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
