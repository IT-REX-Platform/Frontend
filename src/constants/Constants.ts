import Constants from "expo-constants";

interface IItrexVariables {
    apiUrl: string;
    authEndpoint: string;
    authTokenEndpoint: string;
    channel: string;
}

export function itRexVars(): IItrexVariables {
    const releaseChannel = Constants.manifest.extra;
    return releaseChannel;
}
