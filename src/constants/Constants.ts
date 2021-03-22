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

export function itRexVars(): IItrexVariables {
    const releaseChannel = Constants.manifest.extra;
    return releaseChannel;
}
