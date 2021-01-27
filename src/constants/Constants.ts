import Constants from "expo-constants";

interface ITREX_VARIABLES {
    apiUrl: string;
    authEndpoint: string;
    authTokenEndpoint: string;
    channel: string;
}

export default function ITREXVARS(): ITREX_VARIABLES {
    const releaseChannel = Constants.manifest.extra.variables;
    return releaseChannel;
}

export class ITRexVariables {
    RELEASE_CHANNEL = Constants.manifest.extra.variables;
}
