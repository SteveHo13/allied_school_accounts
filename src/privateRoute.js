import React from "react";
import { Route, Redirect } from "react-router-dom";
import firebase from "firebase";

import AdminLayout from "layouts/Admin/Admin.js";
import RTLLayout from "layouts/RTL/RTL.js";
import PublicLayout from "layouts/Public/Public.js";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const currentUser = JSON.parse(localStorage.getItem("uid"));
  if (currentUser === null) 
  return <Redirect to="/public" />;


  return (
    <>
      {/* <Route path="/rtl" render={(props) => <RTLLayout {...props} />} /> */}
          
          <Route
            path="/admin"
            render={(props) => <AdminLayout {...props} />}
          />
        {/* <FlashMessage show={true} /> */}
    </>
  );
};
export default PrivateRoute;
