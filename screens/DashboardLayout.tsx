import React, {useEffect} from 'react';
import {FetchUserDetail} from './../redux/actions/user_actions';
import {useDispatch, useSelector} from 'react-redux';
import {
  IAuthState,
  IGlobalState,
} from '../redux/action_types/auth_action_types';
import NetworkService from '../services/NetworkService';
import DashboardLayoutRightDarwer from '../navigation/DashboardLayoutRightDarwer';

const DashboardLayout: React.FC = props => {
  const dispatch = useDispatch();
  const state = useSelector<IGlobalState>(
    state => state.AuthReducer,
  ) as IAuthState;

  useEffect(() => {
    NetworkService.CheckConnection(() => {
      dispatch(FetchUserDetail(state.remember));
    });
  }, []);

  return <DashboardLayoutRightDarwer children={props.children} />;
};

export default DashboardLayout;
