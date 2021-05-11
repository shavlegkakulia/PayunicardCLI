
import { NavigationActions, StackActions, NavigationPushActionPayload } from 'react-navigation';

let _navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(routeName: string, params?: any) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function push(options: NavigationPushActionPayload) {
    console.log(options)
    _navigator.dispatch(StackActions.push(options));
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  push
};