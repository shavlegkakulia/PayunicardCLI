import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import AuthReducer from './reducers/auth';
import UserReducer from './reducers/user';

const reducers = combineReducers({AuthReducer, UserReducer});
const store = createStore(reducers, applyMiddleware(thunk));

export default store;