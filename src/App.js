import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

//Components
import Login from "./components/login/Login";
import Layout from "./components/layout/Layout";
import ManageBooking from "./components/manageBooking/ManageBooking";
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
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/booking" element={<ManageBooking />} />
          </Route>

          {/* Error page */}
          <Route path="/error" element={<Error />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
