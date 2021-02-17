import { TokenResponse } from "expo-auth-session";

export default class AuthenticationService {
    static instance: AuthenticationService;

    static getInstance(): AuthenticationService {
        if (AuthenticationService.instance == null) {
            AuthenticationService.instance = new AuthenticationService();
        }
        return AuthenticationService.instance;
    }

    private tokenResponse!: TokenResponse;

    public setTokenResponse(token: TokenResponse): void {
        this.tokenResponse = token;
    }
    public getToken(): TokenResponse {
        return this.tokenResponse;
    }

    public getRoles(): string[] {
        const jwt = JSON.parse(atob(this.tokenResponse.accessToken.split(".")[1]));
        return jwt.roles;
    }
}
