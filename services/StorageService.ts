import AsyncStorage from "@react-native-community/async-storage";

export default AsyncStorage;

export const getItem = (key: string, callback?: ((error?: Error | undefined, result?: string | undefined) => void) | undefined) => {
    return AsyncStorage.getItem(key, callback);
}

export const setItem = (key: string, value: string, callback?: ((error?: Error | undefined) => void) | undefined) => {
    return AsyncStorage.setItem(key, value, callback);
}

export const removeItem = (key: string, callback?: ((error?: Error | undefined) => void) | undefined) => {
    return AsyncStorage.removeItem(key, callback);
}

export const clear = (callback?: ((error?: Error | undefined) => void) | undefined) => {
    return AsyncStorage.clear(callback);
}