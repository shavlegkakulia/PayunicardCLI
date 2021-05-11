
 import React from 'react';
 import Navigation from './navigation/index';
 import NavigationService from './services/NavigationService';

 const App = () => {
   return ( <Navigation ref={navigatorRef => {
      NavigationService.setTopLevelNavigator(navigatorRef);
    }} />
   );
 };


 export default App;
