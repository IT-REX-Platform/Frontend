import Constants from "expo-constants";

interface IItrexVariables {
    apiUrl: string;
    authEndpoint: string;
    authTokenEndpoint: string;
    authTokenRevoke: string;
    channel: string;
    authClientId: string;
    authRedirectUrl: string;
    frontendUrl: string;
}

/**
 * This function returns the current valid IItrexVariables.
 * The IItrexVariables will be defined during build time with the help of the "release_channel"
 * See app.config.ts
 * @returns the current valid IItrexVariables
 */
export function itRexVars(): IItrexVariables {
    const releaseChannel = Constants.manifest.extra;
    return releaseChannel;
}
