import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import AuthReducer from './reducers/auth';
import UserReducer from './reducers/user';
import TranslateReduser from './reducers/transtale';

const reducers = combineReducers({AuthReducer, UserReducer, TranslateReduser});
const store = createStore(reducers, applyMiddleware(thunk));

export default store;