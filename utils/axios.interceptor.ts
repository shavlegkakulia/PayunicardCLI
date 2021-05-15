import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export function Register() {
    axios.interceptors.request.use(async (Config: any) => {
        const data = await AsyncStorage.getItem("access_token");
        if(data) {
            Config.headers.Authorization = `Bearer ${data}`;
        }
        return Promise.resolve(Config);
    })
}