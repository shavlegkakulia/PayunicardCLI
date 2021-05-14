import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import AuthReducer from './redusers/auth';

const reducers = combineReducers({AuthReducer});
const store = createStore(reducers, applyMiddleware(thunk));

export default store;