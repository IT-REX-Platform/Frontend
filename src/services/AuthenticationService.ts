import * as AuthSession from "expo-auth-session";
import { loggerFactory } from "../../logger/LoggerConfig";
import { itRexVars } from "../constants/Constants";
import { ITREXRoles } from "../constants/ITREXRoles";
import { AsyncStorageService, StorageConstants } from "./StorageService";

export const discovery = {
    authorizationEndpoint: itRexVars().authEndpoint,
    tokenEndpoint: itRexVars().authTokenEndpoint,
};

export default class AuthenticationService {
    static instance: AuthenticationService;

    private AuthenticationService() {
        //this.refreshTimeout = null;
    }

    static getInstance(): AuthenticationService {
        if (AuthenticationService.instance == null) {
            AuthenticationService.instance = new AuthenticationService();
        }
        return AuthenticationService.instance;
    }
    private loggerApi = loggerFactory.getLogger("AuthenticationService");

    // Request a new access token this many seconds prior to expiration
    private requestNewAccessTokenBuffer = 5 * 1000;

    // Default token lifetime, 5 minutes -> refresh after
    private accessTokenLifeTime = 1000 * 60 * 5;

    private tokenResponse!: AuthSession.TokenResponseConfig;
    private roles: string[] = [];
    private refreshTimeout: NodeJS.Timeout | undefined;

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

    public refreshToken(): Promise<AuthSession.TokenResponseConfig> {
        return new Promise((resolve, reject) => {
            if (this.tokenResponse?.refreshToken != undefined) {
                AuthSession.refreshAsync(
                    {
                        clientId: itRexVars().authClientId,
                        refreshToken: this.tokenResponse.refreshToken,
                        extraParams: {
                            // You must use the extraParams variation of clientSecret.
                            // Never store your client secret on the client.
                            client_secret: "",
                        },
                    },
                    { tokenEndpoint: discovery.tokenEndpoint }
                )
                    .then((tResponse) => {
                        this.setTokenResponse(tResponse);
                        new AsyncStorageService().setItem(
                            StorageConstants.OAUTH_REFRESH_TOKEN,
                            JSON.stringify(tResponse)
                        );
                        resolve(tResponse);
                    })
                    .catch((reason) => {
                        // Refresh does not work
                        this.loggerApi.info("Could not refresh oauth2 token");
                        new AsyncStorageService().deleteItem(StorageConstants.OAUTH_REFRESH_TOKEN);
                        reject(false);
                    });
            } else {
                reject(false);
            }
        });
    }
    /**
     *
     */
    public autoRefresh(): void {
        this.refreshToken().then((resp) => {
            const expires = resp.expiresIn || this.accessTokenLifeTime;
            const nextRefresh = expires * 1000 - this.requestNewAccessTokenBuffer;
            this.loggerApi.debug("Next Token-Refresh in " + nextRefresh + " ms");
            this.refreshTimeout = setTimeout(() => this.autoRefresh(), nextRefresh);
        });
    }

    public clearAuthentication(): void {
        if (this.refreshTimeout !== undefined) {
            clearTimeout(this.refreshTimeout);
        }
        new AsyncStorageService().deleteItem(StorageConstants.OAUTH_REFRESH_TOKEN);
        this.setTokenResponse({} as AuthSession.TokenResponseConfig);
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
