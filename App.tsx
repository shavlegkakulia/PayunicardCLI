
 import React from 'react';
 import Navigation from './navigation/index';
 import { Provider } from 'react-redux'
 import store from './redux/store';
 import * as Sentry from "@sentry/react-native";

 import {
  KvalifikaSDK,
  KvalifikaSDKLocale,
  KvalifikaSDKError,
} from '@kvalifika/react-native-sdk';

 Sentry.init({
   dsn: "https://f8e0cee893a3496983c38d2e82cb1e7a@o1043853.ingest.sentry.io/6013619",
 });
 
 const App = () => {
   return (
     <Provider store={store} >
        <Navigation />
     </Provider>
   )
 };

 export default App;
