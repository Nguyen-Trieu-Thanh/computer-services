import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

//Components
import Login from "./components/login/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import ManageBooking from "./components/manageBooking/ManageBooking";
import ManageOrder from "./components/manageOrder/ManageOrder";
import ManageStaff from "./components/manageStaff/ManageStaff";
import ManageCustomer from "./components/manageCustomer/ManageCustomer";
import OrderDetailInformation from "./components/orderDetailInformation/OrderDetailInformation";
import UserProfile from "./components/userProfile/UserProfile";
import Error from "./components/error/Error";

//Functions
import ProtectedRoute from "./functions/ProtectedRoute";

//Date in Vietnamese
import "moment/locale/vi";
import RequireAuth from "./functions/RequireAuth";

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
              // <ProtectedRoute user={["manager", "admin"]}>
              //   <Layout />
              // </ProtectedRoute>
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/booking" element={<ManageBooking />} />
            <Route path="/order" element={<ManageOrder />} />
            <Route path="/staff" element={<ManageStaff />} />
            <Route path="/customer" element={<ManageCustomer />} />
            <Route
              path="/order-detail-information"
              element={<OrderDetailInformation />}
            />
            <Route path="/userProfile" element={<UserProfile />} />
          </Route>

          {/* Error page */}
          <Route path="/*" element={<Error />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
