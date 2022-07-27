import AsyncStorage from '@react-native-async-storage/async-storage'
import { Callback } from '@react-native-async-storage/async-storage/lib/typescript/types';

export default AsyncStorage;

export const getItem = (key: string, callback?: Callback  | undefined) => {
    return AsyncStorage.getItem(key, callback);
}

export const setItem = (key: string, value: string, callback?: Callback  | undefined) => {
    return AsyncStorage.setItem(key, value, callback);
}

export const removeItem = (key: string, callback?: Callback  | undefined) => {
    return AsyncStorage.removeItem(key, callback);
}

export const clear = (callback?: Callback  | undefined) => {
    return AsyncStorage.clear(callback);
}