import {NavigationContainerRef} from '@react-navigation/core';
import {CommonActions} from '@react-navigation/routers';
import Routes from '../navigation/routes';

let _navigator: NavigationContainerRef | undefined = undefined;
export let OpenDrawer: Function[] = [() => {}, () => {}];
export let CloseDrawer: Function[] = [() => {}, () => {}];
export let ToggleDrawer: Function[] = [() => {}, () => {}];

let backHandler = () => {}

const setBackHandler = (fn: () => void) => {
  backHandler = fn;
}

let currentRoute: string = Routes.Home;

function setCurrentRoute(routeName: string) {
  currentRoute = routeName;
}

function setDrawerOpen(ref: Function, index: number) {
  OpenDrawer[index] = ref;
}

function setDrawerClose(ref: Function, index: number) {
  CloseDrawer[index] = ref;
}

function setDrawerToggle(ref: Function, index: number) {
  ToggleDrawer[index] = ref;
}

function setTopLevelNavigator(navigatorRef: NavigationContainerRef) {
  _navigator = navigatorRef;
}

interface IParams {
  routeName: string;
  params?: any;
}

function navigate(routeName: any, params?: any) {
  if(routeName === currentRoute) return;
  
  let parameters: IParams = {
    routeName: routeName,
  };
  if (params) {
    parameters = {routeName: parameters.routeName, params: params};
  }
  
  setCurrentRoute(routeName);
  _navigator?.dispatch(
    CommonActions.navigate({
      name: routeName,
      params: params,
    }),
  );
}

function dispatch({type,
  payload,
  source,
  target}: {type: string, payload?: object | undefined, source?: string | undefined, target?: string | undefined}) {

  
  
  _navigator?.dispatch(
    {
      type,
      payload,
      source,
      target
    
    });
}

const GoBack = () => {
  backHandler();
  _navigator?.goBack();
}

// add other navigation functions that you need and export them

export default {
  _navigator,
  navigate,
  setTopLevelNavigator,
  setDrawerOpen,
  setDrawerClose,
  setDrawerToggle,
  setCurrentRoute,
  currentRoute,
  dispatch,
  setBackHandler,
  GoBack
};
