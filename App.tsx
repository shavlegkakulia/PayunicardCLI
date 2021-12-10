
 import React from 'react';
 import Navigation from './navigation/index';
 import { Provider } from 'react-redux'
 import store from './redux/store';

 const App = () => {
   return (
     <Provider store={store} >
        <Navigation />
     </Provider>
   )
 };

 export default App;
