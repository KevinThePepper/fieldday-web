import React from "react";
import LoginForm from "./LoginForm";
import {AuthContext} from "../AuthContext/AuthContext";

export default props => (
      <AuthContext.Consumer>
      {({ isAuth, authenticate, signout, username }) => 
      	<LoginForm {...props} isAuth={isAuth} authenticate={authenticate} signout={signout} username={username} />}
      </AuthContext.Consumer>
);