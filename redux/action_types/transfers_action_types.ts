import { ITransferTemplate } from "../../services/TemplatesService";
import { IP2PTransactionResponse } from "../../services/TransactionService";
import { IAccountBallance, ICurrency } from "../../services/UserService";

export interface ITransfersState {
    isTemplatesLoading: boolean,
    transferTemplates: ITransferTemplate[],
    benificarAccount: string | undefined,
    benificarName: string | undefined,
    amount: string | undefined,
    transactionResponse: IP2PTransactionResponse | undefined,
    isTemplate: boolean,
    nomination: string | undefined,
    transferType: string | undefined,
    templateName: string | undefined,
    isLoading: boolean,
    fullScreenLoading: boolean,
    selectedFromAccount: IAccountBallance | undefined,
    selectedToAccount: IAccountBallance | undefined,
    selectedFromCurrency: ICurrency | undefined
    selectedToCurrency: ICurrency | undefined
}

export interface ITransfersActions extends ITransfersState {
    type: string;
}

export const TRANSFERS_ACTION_TYPES = {
    SET_ISTEMPLATES_LOADING: 'SET_ISTEMPLATES_LOADING',
    SET_TRANSFER_TEMPLATES: 'FETCH_TRANSFER_TEMPLATES',
    SET_BENIFICARY_NAME: 'SET_BENIFICARY_NAME',
    SET_BENIFICARY_ACCOUNT: 'SET_BENIFICARY_ACCOUNT',
    SET_AMOUNT: 'SET_AMOUNT',
    SET_TRANSACTION_RESPONSE: 'SET_TRANSACTION_RESPONSE',
    SET_IS_TEMPLATE: 'SET_IS_TEMPLATE',
    SET_NOMINATION: 'SET_NOMINATION',
    SET_TRASNSFER_TYPE: 'SET_TRASNSFER_TYPE',
    SET_TEMPLATE_NAME: 'SET_TEMPLATE_NAME',
    SET_ISLOADING: 'SET_ISLOADING',
    SET_FULLSCREEN_LODING: 'SET_FULLSCREEN_LODING',
    SET_SELECTED_FROM_ACCOUNT: 'SET_SELECTED_FROM_ACCOUNT',
    SET_SELECTED_TO_ACCOUNT: 'SET_SELECTED_TO_ACCOUNT',
    SET_SELECTED_FROM_CURRENCY: 'SET_SELECTED_FROM_CURRENCY',
    SET_SELECTED_TO_CURRENCY: 'SET_SELECTED_TO_CURRENCY',
    RESET_TRANSFER_STATES: 'RESET_TRANSFER_STATES'
}

export interface IGlobalState {
    TransfersReducer: ITransfersState
}