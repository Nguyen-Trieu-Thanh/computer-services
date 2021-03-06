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
import ManageService from "./components/manageService/ManageService";
import ManageAccessory from "./components/manageAccessory/ManageAccessory";
import Error from "./components/error/Error";

//Functions
import ProtectedRoute from "./functions/ProtectedRoute";

//Date in Vietnamese
import "moment/locale/vi";
import RequireAuth from "./functions/RequireAuth";
import PersistLogin from "./functions/PersistLogin";
import RememberMeLogin from "./functions/RememberMeLogin";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Login page */}
          <Route
            index
            element={
              <RememberMeLogin>
                <Login />
              </RememberMeLogin>
            }
          />

          {/* Home page */}
          <Route
            path="/"
            element={
              <PersistLogin>
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              </PersistLogin>
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
            <Route path="/service" element={<ManageService />} />
            <Route path="/accessory" element={<ManageAccessory />} />
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
