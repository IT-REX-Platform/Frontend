import Constants from "expo-constants";

interface ITREX_VARIABLES {
    apiUrl: string;
    authEndpoint: string;
    authTokenEndpoint: string;
    channel: string;
}

export default function ITREXVARS(): ITREX_VARIABLES | undefined {
    const releaseChannel = Constants.manifest.extra.variables;
    return releaseChannel;
}
