import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//CSS
import "./App.css";

//Components
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Error from "./components/error/Error";

//Functions
import ProtectedRoute from "./functions/ProtectedRoute";

const user = true;

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Login page */}
          <Route index element={<Login />} />

          {/* Home page */}
          <Route
            path="/home"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Error page */}
          <Route path="/error" element={<Error />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
