import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import AuthReducer from './reducers/auth';
import UserReducer from './reducers/user';
import TranslateReduser from './reducers/transtale';
import ErrorReducer from './reducers/error';
import TransfersReducer from './reducers/transfersReducer';
import NavigationReducer from './reducers/navigationReducer';
import PaymentsReducer from './reducers/paymentsReducer';

const reducers = combineReducers({AuthReducer, UserReducer, TranslateReduser, ErrorReducer, TransfersReducer, NavigationReducer, PaymentsReducer});
const store = createStore(reducers, applyMiddleware(thunk));

export default store;