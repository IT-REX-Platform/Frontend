import React from "react";
import * as AuthSession from "expo-auth-session";

export interface IAuthContext {
    signIn(userInfo: AuthSession.TokenResponse): void;
    signOut(): void;
}

export const AuthContext = React.createContext({} as IAuthContext);
