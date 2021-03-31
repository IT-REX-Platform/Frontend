import AsyncStorage from "@react-native-async-storage/async-storage";

export interface IStorageService {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): void;
    deleteItem(key: string): void;
}

export class StorageConstants {
    static OAUTH_REFRESH_TOKEN = "oauth.refresh_token";
}

/**
 * Storage-Service which stores/retreives key-value pairs.
 * https://docs.expo.io/versions/latest/sdk/async-storage/
 */
export class AsyncStorageService implements IStorageService {
    async getItem(key: string): Promise<string | null> {
        const jsonValue = await AsyncStorage.getItem("@" + key);
        return jsonValue;
    }
    async setItem(key: string, value: string): Promise<void> {
        await AsyncStorage.setItem("@" + key, value);
    }
    async deleteItem(key: string): Promise<void> {
        await AsyncStorage.removeItem("@" + key);
    }
}
