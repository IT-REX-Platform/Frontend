import { TokenResponse } from "expo-auth-session";

export interface ILoginReducerState {
    isLoading?: boolean;
    userInfo?: TokenResponse | null;
}

export interface ILoginReducerAction {
    type: string;
    userInfo: TokenResponse;
    token?: string;
}
