import axios from 'axios';
import { from } from 'rxjs';
import envs from './../config/env';
import { ISignInResponse } from './../interfaces/responses/IAuthResponse';

class AuthService {
    
  SignIn (username: string, password: string) {
    const loginObj = new FormData();
    loginObj.append("username", username);
    loginObj.append("password", password);
    loginObj.append("scope", "Wallet_Api.Full offline_access");
    loginObj.append("client_id", "WalletApi");
    loginObj.append("client_secret", "abcd123");
    loginObj.append("grant_type", "password");
    const promise = axios.post<ISignInResponse>(`${envs.CONNECT_URL}connect/token`, loginObj);
    return from(promise);
  }

  SignOut (currentState: any) {
    const { token } = currentState.auth;
    const promise = axios.post(`${envs.CONNECT_URL}/user/logout`, {}, { headers: { authorization: `Bearer ${token}`}});
    return from(promise);
  }
}

export default new AuthService();