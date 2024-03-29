import React from "react";
import * as AuthSession from "expo-auth-session";
import { ILocalizationContext } from "../types/ILocalizationContext";
import { ICourse } from "../types/ICourse";

export interface IAuthContext {
    signIn(userInfo: AuthSession.TokenResponse): void;
    signOut(): void;
}

export const AuthContext = React.createContext({} as IAuthContext);

export const LocalizationContext = React.createContext({} as ILocalizationContext);

export const CourseContext = React.createContext({} as ICourseContext);

export type ICourseContext = {
    course: ICourse;
    setCourse(arg0: ICourse): void;
};
