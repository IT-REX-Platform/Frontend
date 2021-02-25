import { TokenResponseConfig } from "expo-auth-session";

export type ILoginReducerState = {
    isLoading?: boolean;
    userInfo?: TokenResponseConfig | null;
};

export type ILoginReducerAction = {
    type: string;
    userInfo: TokenResponseConfig;
    token?: string;
};
