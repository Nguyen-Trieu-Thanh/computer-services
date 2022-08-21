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
import ManagerDetail from "./components/managerDetail/ManagerDetail";

import OrderDetail from "./components/orderDetail/OrderDetail";
import UserProfile from "./components/userProfile/UserProfile";
import ManageService from "./components/manageService/ManageService";
import CreateService from "./components/createService/CreateService";
import ServiceDetail from "./components/serviceDetail/ServiceDetail";

import ManageAccessory from "./components/manageAccessory/ManageAccessory";
import CreateAccessory from "./components/createAccessory/CreateAccessory";
import AccessoryDetail from "./components/accessoryDetail/AccessoryDetail";

import ManageSchedule from "./components/manageSchedule/ManageSchedule";
import CustomGoogleMap from "./components/customGoogleMap/CustomGoogleMap";
import CustomChart from "./components/customChart/CustomChart";
import NoInternetConnectionError from "./components/noInternetConnectionError/NoInternetConnectionError";

import Error from "./components/error/Error";

//Functions
import ProtectedRoute from "./functions/ProtectedRoute";

//Date in Vietnamese
import "moment/locale/vi";
import RequireAuth from "./functions/RequireAuth";
import PersistLogin from "./functions/PersistLogin";
import RememberMeLogin from "./functions/RememberMeLogin";
import CheckInternetConnection from "./functions/CheckInternetConnection";

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
            <Route
              path="/dashboard"
              element={
                <CheckInternetConnection>
                  <Dashboard />
                </CheckInternetConnection>
              }
            />
            <Route
              path="/booking"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["manager"]}>
                    <ManageBooking />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            <Route
              path="/create-booking"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["manager"]}>
                    <CreateBooking />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            {/* <Route path="/order" element={<ManageOrder />} /> */}
            <Route
              path="/staff"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["manager"]}>
                    <ManageStaff />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            <Route
              path="/staff-detail/:account_id"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["manager"]}>
                    <StaffDetail />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            <Route
              path="/customer"
              element={
                <CheckInternetConnection>
                  <ManageCustomer />
                </CheckInternetConnection>
              }
            />
            <Route
              path="/customer-detail/:account_id"
              element={
                <CheckInternetConnection>
                  <CustomerDetail />
                </CheckInternetConnection>
              }
            />
            <Route
              path="/manager"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["admin"]}>
                    <ManageManager />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            {/* <Route
              path="/manager-detail/:account_id"
              element={<ManagerDetail />}
            /> */}
            <Route
              path="/order-detail/:order_id"
              element={
                <CheckInternetConnection>
                  <OrderDetail />
                </CheckInternetConnection>
              }
            />
            <Route
              path="/userProfile"
              element={
                <CheckInternetConnection>
                  <UserProfile />
                </CheckInternetConnection>
              }
            />
            <Route
              path="/service"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["manager"]}>
                    <ManageService />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            <Route
              path="/create-service"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["manager"]}>
                    <CreateService />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            <Route
              path="/service-detail/:service_id"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["manager"]}>
                    <ServiceDetail />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            <Route
              path="/accessory"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["manager"]}>
                    <ManageAccessory />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            <Route
              path="/create-accessory"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["manager"]}>
                    <CreateAccessory />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            <Route
              path="/accessory-detail/:accessory_id"
              element={
                <CheckInternetConnection>
                  <ProtectedRoute user={["manager"]}>
                    <AccessoryDetail />
                  </ProtectedRoute>
                </CheckInternetConnection>
              }
            />
            {/* <Route path="/schedule" element={<ManageSchedule />} /> */}
            {/* <Route path="/google-map" element={<CustomGoogleMap />} /> */}
            {/* <Route path="/chart" element={<CustomChart />} /> */}
            {/* Error page */}
            <Route path="/*" element={<Error />} />
            <Route path="/error" element={<Error />} />
            {/* <Route
              path="/no-connection"
              element={<NoInternetConnectionError />}
            /> */}
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
