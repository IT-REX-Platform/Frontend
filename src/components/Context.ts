import React from "react";
import * as AuthSession from "expo-auth-session";
import { ILocalizationContext } from "../types/ILocalizationContext";

export interface IAuthContext {
    signIn(userInfo: AuthSession.TokenResponse): void;
    signOut(): void;
}

export const AuthContext = React.createContext({} as IAuthContext);

export const LocalizationContext = React.createContext({} as ILocalizationContext);
