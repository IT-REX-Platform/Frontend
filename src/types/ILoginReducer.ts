import { TokenResponse } from "expo-auth-session";

export type ILoginReducerState = {
    isLoading?: boolean;
    userInfo?: TokenResponse | null;
};

export type ILoginReducerAction = {
    type: string;
    userInfo: TokenResponse;
    token?: string;
};
