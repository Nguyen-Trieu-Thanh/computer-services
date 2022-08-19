import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//CSS
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

//Components
import Login from "./components/login/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import ManageBooking from "./components/manageBooking/ManageBooking";
import CreateBooking from "./components/createBooking/CreateBooking";

import ManageOrder from "./components/manageOrder/ManageOrder";
import ManageStaff from "./components/manageStaff/ManageStaff";
import StaffDetail from "./components/staffDetail/StaffDetail";
import ManageCustomer from "./components/manageCustomer/ManageCustomer";
import CustomerDetail from "./components/customerDetail/CustomerDetail";
import ManageManager from "./components/manageManager/ManageManager";

import OrderDetail from "./components/orderDetail/OrderDetail";
import UserProfile from "./components/userProfile/UserProfile";
import ManageService from "./components/manageService/ManageService";
import CreateService from "./components/createService/CreateService";
import ServiceDetail from "./components/serviceDetail/ServiceDetail";

import ManageAccessory from "./components/manageAccessory/ManageAccessory";
import ManageSchedule from "./components/manageSchedule/ManageSchedule";
import CustomGoogleMap from "./components/customGoogleMap/CustomGoogleMap";
import CustomChart from "./components/customChart/CustomChart";

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
            {/* <Route path="/booking" element={<ManageBooking />} /> */}
            <Route
              path="/booking"
              element={
                <ProtectedRoute user={["manager"]}>
                  <ManageBooking />
                </ProtectedRoute>
              }
            />
            <Route path="/create-booking" element={<CreateBooking />} />
            <Route path="/order" element={<ManageOrder />} />
            <Route path="/staff" element={<ManageStaff />} />
            <Route path="/staff-detail/:account_id" element={<StaffDetail />} />
            <Route path="/customer" element={<ManageCustomer />} />
            <Route
              path="/customer-detail/:account_id"
              element={<CustomerDetail />}
            />
            <Route path="/manager" element={<ManageManager />} />
            <Route path="/order-detail" element={<OrderDetail />} />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/service" element={<ManageService />} />
            <Route path="/create-service" element={<CreateService />} />
            <Route path="/service-detail/:service_id" element={<ServiceDetail />} />
            <Route path="/accessory" element={<ManageAccessory />} />
            <Route path="/schedule" element={<ManageSchedule />} />
            <Route path="/google-map" element={<CustomGoogleMap />} />
            <Route path="/chart" element={<CustomChart />} />
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
