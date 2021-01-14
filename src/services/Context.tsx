import { AuthenticationService } from "./AuthenticationService";
import React from "react";

export const authenticationService = new AuthenticationService();
export const AuthenticationContext = React.createContext<AuthenticationService>(authenticationService);
