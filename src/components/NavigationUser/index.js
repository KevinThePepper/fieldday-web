import React from "react";
import NavigationUser from "./NavigationUser";
import {AuthContext} from "../AuthContext/AuthContext";

export default props => (
      <AuthContext.Consumer>
      {({ isAuth, authenticate, signout, username }) => 
      	<NavigationUser {...props} isAuth={isAuth} authenticate={authenticate} signout={signout} username={username} />}
      </AuthContext.Consumer>
);