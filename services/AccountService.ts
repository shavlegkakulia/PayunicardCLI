import axios from 'axios';
import { from } from 'rxjs';
import envs from './../config/env';
import { IError } from './TemplatesService';

export interface IBlockCardRequest {
    cardId?: number;
    description?: string | undefined;
}

export interface IBlockCardResponse {
    ufcCardId?: number;
}

export interface IBlockCardResponseData {
    ok: boolean;
    errors?: IError[] | undefined;
    data?: IBlockCardResponse | undefined;
}

export interface IGetPinRequest {
    cardid?: number;
    otp?: string | undefined;
}

export interface IGetPinResponse {
}

export interface IGetPinResponseData {
    Ok: boolean;
    errors?: IError[] | undefined;
    data?: IGetPinResponse | undefined;
}

class AccountServise {
    Block(data: IBlockCardRequest) {
        let form: IBlockCardRequest = {
            cardId: data.cardId
        };
        if (data.description) {
            form = { ...form, description: data.description };
        }
        const promise = axios.post<IBlockCardResponseData>(`${envs.API_URL}Card/Block`, form);
        return from(promise);
    }

    pin(data: IGetPinRequest) {
        const form: IGetPinRequest = {
            cardid: data.cardid,
            otp: data.otp
        }

        const promise = axios.post<IGetPinResponseData>(`${envs.API_URL}Card/pin`, form);
        return from(promise);
    }
}

export default new AccountServise();