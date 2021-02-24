import * as AuthSession from "expo-auth-session";
import { itRexVars } from "../constants/Constants";
import { ITREXRoles } from "../constants/ITREXRoles";
import { AsyncStorageService, StorageConstants } from "./StorageService";

export const discovery = {
    authorizationEndpoint: itRexVars().authEndpoint,
    tokenEndpoint: itRexVars().authTokenEndpoint,
};

export default class AuthenticationService {
    static instance: AuthenticationService;

    static getInstance(): AuthenticationService {
        if (AuthenticationService.instance == null) {
            AuthenticationService.instance = new AuthenticationService();
        }
        return AuthenticationService.instance;
    }

    // Request a new access token this many seconds prior to expiration
    private requestNewAccessTokenBuffer = 5 * 1000;

    // Default token lifetime, 5 minutes -> refresh after
    private accessTokenLifeTime = 1000 * 60 * 5;
    private autoTokenRefresh = true;
    private autoTokenRefreshRunning = false;

    private tokenResponse!: AuthSession.TokenResponseConfig;
    private roles: string[] = [];

    public setTokenResponse(token: AuthSession.TokenResponseConfig): void {
        this.tokenResponse = token;

        if (this.tokenResponse.accessToken != undefined) {
            const jwt = JSON.parse(atob(this.tokenResponse.accessToken.split(".")[1]));
            this.roles = jwt.roles;
        }
    }
    public getToken(): AuthSession.TokenResponseConfig {
        return this.tokenResponse;
    }

    public refreshToken(): void {
        if (this.tokenResponse?.refreshToken != undefined) {
            AuthSession.refreshAsync(
                {
                    clientId: "web_app",
                    refreshToken: this.tokenResponse.refreshToken,
                    extraParams: {
                        // You must use the extraParams variation of clientSecret.
                        // Never store your client secret on the client.
                        client_secret: "",
                    },
                },
                { tokenEndpoint: discovery.tokenEndpoint }
            ).then((tResponse) => {
                console.log(tResponse);

                this.setTokenResponse(tResponse);
                new AsyncStorageService().setItem(StorageConstants.OAUTH_REFRESH_TOKEN, JSON.stringify(tResponse));
                if (this.autoTokenRefresh) {
                    const expires = tResponse.expiresIn || this.accessTokenLifeTime;

                    setTimeout(() => this.refreshToken(), expires * 1000 - this.requestNewAccessTokenBuffer);
                }
            });
        }
    }

    public clearAuthentication(): void {
        new AsyncStorageService().setItem(StorageConstants.OAUTH_REFRESH_TOKEN, "");
    }

    public getRoles(): string[] {
        return this.roles;
    }

    public isStudent(): boolean {
        return this.roles.includes(ITREXRoles.ROLE_STUDENT);
    }

    public isLecturer(): boolean {
        return this.roles.includes(ITREXRoles.ROLE_LECTURER);
    }

    public isAdmin(): boolean {
        return this.roles.includes(ITREXRoles.ROLE_ADMIN);
    }
    public isLecturerOrAdmin(): boolean {
        return this.roles.includes(ITREXRoles.ROLE_ADMIN) || this.roles.includes(ITREXRoles.ROLE_LECTURER);
    }
}
