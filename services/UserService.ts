import axios from 'axios';
import { from } from 'rxjs';
import envs from './../config/env';
import { IUserResponse } from './../interfaces/responses/IUserResponse';

class UserService { 
    GetUserDetails () {
    const promise = axios.get<IUserResponse>(`${envs.API_URL}User/GetUserDetails`);
    return from(promise);
  }
}

export default new UserService();