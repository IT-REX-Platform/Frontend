import Constants from "expo-constants";

interface ITREX_VARIABLES {
    apiUrl: string;
    authEndpoint: string;
    authTokenEndpoint: string;
    channel: string;
}

export function itRexVars(): ITREX_VARIABLES {
    const releaseChannel = Constants.manifest.extra;
    return releaseChannel;
}
