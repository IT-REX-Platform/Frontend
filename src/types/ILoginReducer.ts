import { TokenResponseConfig } from "expo-auth-session";

export interface ILoginReducerState {
    isLoading?: boolean;
    userInfo?: TokenResponseConfig | null;
}

export interface ILoginReducerAction {
    type: string;
    userInfo: TokenResponseConfig;
    token?: string;
}
