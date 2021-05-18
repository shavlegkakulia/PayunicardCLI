import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet, Button, Alert } from "react-native";

export function Register() {
    axios.interceptors.request.use(async (Config: any) => {
        const data = await AsyncStorage.getItem("access_token");
        if(data) {
            Config.headers.Authorization = `Bearer ${data}`;
        }
        return Promise.resolve(Config);
    })

    axios.interceptors.response.use(async (Config: any) => {
       
        return Promise.resolve(Config);
    }, error => {console.log(error)
      //  if(error.response.status.toString().startsWith('40')) {
            Alert.alert(
                "Alert Title",
                error.message,
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
      
            return error
       //   }
    })
}