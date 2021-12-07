import axios from 'axios';
import {from} from 'rxjs';
import envs from './../config/env';
import {IError} from './TemplatesService';

export interface IUserDetails {
  customerVerificationStatusCode?: string | '';
  customerVerificationStatusDesc?: string;
  documentVerificationStatusCode?: string;
  documentVerificationStatusDesc?: string;
  email?: string | '';
  emailVerificationStatusCode?: string;
  emailVerificationStatusDesc?: string;
  imageUrl?: string | '';
  isOtpAuthorization?: boolean;
  name?: string;
  password?: string;
  personalId?: number;
  phoneVerificationStatusCode?: string;
  phoneVerificationStatusDesc?: string;
  sex?: number;
  surname?: string;
  userId?: number;
  username?: string | '';
  phone?: string;
  citizenshipCountryID?: number;
  passportNumber?: string;
  citizenshipCountryName?: string;
  defaultAccountID?: number;
  customerID?: number;
  customerCategoryTypeId?: number;
  claims?: any[];
}

export interface IUserResponse {
  data?: IUserDetails;
}

export interface ICurrency {
  key?: string | undefined;
  value?: string;
  title?: string;
  balance: number;
  available: number;
  availableBal: number;
}

export interface ICard {
  maskedCardNumber?: string | undefined;
  status?: number;
  cardID?: number;
  cardTypeID?: number;
  hrm?: number;
}

export interface IAccountBallance {
  accountNumber?: string | undefined;
  accountNumberId?: number;
  accountName?: string | undefined;
  accountId?: number;
  type?: number;
  availableInGEL?: number;
  availableInUSD?: number;
  availableInEUR?: number;
  balanceInGEL?: number;
  balanceInUSD?: number;
  balanceInEUR?: number;
  reserve?: number;
  accountTypeName?: string | undefined;
  customerAccountType?: number;
  customerPaketId?: number;
  availableInGBP?: number;
  availableInTRY?: number;
  availableInRUB?: number;
  balanceInGBP?: number;
  balanceInTRY?: number;
  balanceInRUB?: number;
  imageUrl?: string | undefined;
  isActive?: boolean;
  accountNumberID?: number;
  mAskedCard?: string | undefined;
  ccyPriority?: string | undefined;
  cards?: ICard[] | undefined;
  currencies?: ICurrency[] | undefined;
  //additional
  card?: string | undefined;
  isChecked?: boolean;
}

export interface IAccountBallances {
  accountBallances: IAccountBallance[];
}

export interface IUserAccountResponse {
  data?: IAccountBallances;
}

export interface IGetUserTotalBalanceResponse {
  balance?: number;
  ccy?: string | undefined;
  points?: number;
  isStarred?: boolean;
}

export interface IUserTotalBalance {
  data?: IGetUserTotalBalanceResponse;
}

export interface IStatements {
  accountID?: number;
  opClassType?: string | undefined;
  classCode?: string | undefined;
  classCodeDescription?: string | undefined;
  tranID?: number;
  amount?: number;
  tranDate?: Date;
  transactionStatus?: number;
  transactionStatusDescription?: string | undefined;
  description?: string | undefined;
  accountNumberID?: string | undefined;
  accountNumber?: string | undefined;
  ccy?: string | undefined;
  accounttype?: string | undefined;
  imageUrl?: string | undefined;
  cardTranDate?: Date;
  abvrName?: string | undefined;
  shortDescription?: string | undefined;
}

export interface IBallances {
  startBallance?: number;
  endBallance?: number;
  deb?: number;
  cred?: number;
}

export interface IGetUserAccountsStatementResponse {
  statements?: IStatements[] | undefined;
  statementBallances?: IBallances | undefined;
}

export interface IUserAccountsStatementRequest {
  accountID?: number | undefined;
  rowIndex?: number | undefined;
  rowCount?: number | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  opClass?: string | undefined;
  opExclude?: boolean | undefined;
}

export interface IUserAccountsStatement {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IGetUserAccountsStatementResponse;
}

export interface IProduct {
  productID?: number;
  balance?: number | undefined;
  color?: string | undefined;
  imageURL?: string | undefined;
  order?: number;
  personalID?: string | undefined;
  points?: number | undefined;
  productFrom?: string | undefined;
  productName?: string | undefined;
  productValue?: string | undefined;
}

export interface IGetUserProductsResponse {
  products?: IProduct[] | undefined;
}

export interface IUserProductsResponse {
  data?: IGetUserProductsResponse;
}

export interface IGetPasswordResetDataResponse {
  resetData?: IPassResetData[] | undefined;
}

export interface IPasswordResetDataResponse {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IGetPasswordResetDataResponse | undefined;
}

export interface IPassResetData {
  name?: string | undefined;
  mask?: string | undefined;
}

export interface IGetPasswordChangeDataResponse {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: {} | undefined;
}

export interface IChangeUserPasswordRequest {
  oldPassword?: string | undefined;
  password?: string | undefined;
  confirmPassword?: string | undefined;
  otp?: string | undefined;
  otpSource?: string | undefined;
}

export class ICheckUserPersonalIdRequest {
  userName?: string | undefined;
  personalID?: string | undefined;
}

export interface ICheckUserResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: ICheckUserResponse | undefined;
}

export interface ICheckUserResponse {
  isRegistred?: boolean;
  emailIsVerified?: boolean;
  phoneIsVerified?: boolean;
}

export interface IResetPasswordRequest {
  password?: string | undefined;
  personalID?: string | undefined;
  userName?: string | undefined;
  confirmPassword?: string | undefined;
  otpSource?: string | undefined;
  otpGuid?: string | undefined;
  otp?: string | undefined;
  passportNumber?: string | undefined;
}

export interface IResetPasswordResponse {
  response?: string | undefined;
}

export interface IResetPasswordResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IResetPasswordResponse | undefined;
}

export interface IGetUnicardsResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IGetUnicardsResponse | undefined;
}

export interface IGetUnicardsResponse {
  unicards?: IUnicard[] | undefined;
}

export interface IUnicard {
  card?: string | undefined;
  amount?: number;
}

export interface IStatus {
  employmentStatusCode?: string | undefined;
  employmentStatus?: string | undefined;
}

export interface IGetCustomerEmploymentStatusTypesResponse {
  statuses?: IStatus[] | undefined;
}

export interface IGetCustomerEmploymentStatusTypesResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IGetCustomerEmploymentStatusTypesResponse | undefined;
}

export interface IType2 {
  customerEmploymentTypeCode?: string | undefined;
  customerEmploymentType?: string | undefined;
}

export interface IGetCustomerWorkTypesResponse {
  types?: IType2[] | undefined;
}

export interface IGetCustomerWorkTypesResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IGetCustomerWorkTypesResponse | undefined;
}

export interface IExpectedType {
  expectedTurnoverCode?: string | undefined;
  expectedTurnover?: string | undefined;
}

export interface IGetCustomerExpectedTurnoverTypesResponse {
  types?: IExpectedType[] | undefined;
}

export interface IGetCustomerExpectedTurnoverTypesResponseData {
  ok?: boolean;
  errors?: IError[] | undefined;
  data?: IGetCustomerExpectedTurnoverTypesResponse | undefined;
}

export interface IGetTransactionDetailsResponse {
  tranid?: number;
  longopid?: number;
  opClass?: string | undefined;
  senderBankCode?: string | undefined;
  senderBankName?: string | undefined;
  debcred?: string | undefined;
  dateCreated?: Date;
  senderName?: string | undefined;
  senderaccount?: string | undefined;
  receiverBankName?: string | undefined;
  receivername?: string | undefined;
  receiveraccount?: string | undefined;
  amount?: number;
  description?: string | undefined;
  mccGroupName?: string | undefined;
  ccy?: string | undefined;
  mccGroupCodeId?: string | undefined;
  receiverMaskedCardNumber?: string | undefined;
  aprCode?: string | undefined;
  tranDate?: string | undefined;
  abvrName?: string | undefined;
  senderMaskedCardNumber?: string | undefined;
  uniBonus?: number | undefined;
  terminal?: string | undefined;
}

export interface GetTransactionDetailsRequest {
  tranid?: number;
}

export interface IGetTransactionDetailsResponseData {
  ok?: boolean;
  errors?: IError[] | undefined;
  data?: IGetTransactionDetailsResponse | undefined;
}

export interface IBankCard {
  bankName?: string | undefined;
  cardId?: number;
  cardNumber?: string | undefined;
  color?: string | undefined;
  imageURL?: string | undefined;
  isFavorite?: boolean;
  order?: number;
  productName?: string | undefined;
  cardType?: number | undefined;
  isSelected?: boolean;
}

export interface IGetUserBankCardsResponse {
  bankCards?: IBankCard[] | undefined;
}

export interface IGetUserBankCardsResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IGetUserBankCardsResponse | undefined;
}

export interface ICustomerRegistrationNewRequest {
  documentType?: string | undefined;
  personalID?: string | undefined;
  name?: string | undefined;
  surname?: string | undefined;
  birthDate?: Date | undefined;
  sex?: number;
  birthCity?: string | undefined;
  birthCityId?: number;
  birthCountryId?: number;
  isRepresentative?: boolean;
  documentFrontSide?: string | undefined;
  documentFrontSideName?: string | undefined;
  documentFrontSideContent?: string | undefined;
  documentBackSide?: string | undefined;
  documentBackSideName?: string | undefined;
  documentBackSideContent?: string | undefined;
  assignmentID?: number;
  uploadAssignment?: string | undefined;
  uploadAssignmentName?: string | undefined;
  uploadAssignmentContent?: string | undefined;
  customerSelf?: string | undefined;
  customerSelfName?: string | undefined;
  customerSelfContent?: string | undefined;
  cardTypeID?: number | undefined;
  cardDeliveryCountryID?: number | undefined;
  cardDeliveryCityID?: number | undefined;
  cardDeliveryCity?: string | undefined;
  cardDeliveryAddress?: string | undefined;
  cardDeliveryPostalCode?: string | undefined;
  termID?: number | undefined;
  employmentStatusCode?: string | undefined;
  employmentTypeCode?: string | undefined;
  workPosition?: string | undefined;
  expectedTurnoverCode?: string | undefined;
  hasUtility?: boolean;
  hasTransport?: boolean;
  hasTelecomunication?: boolean;
  hasInternatiolalTransactions?: boolean;
  hasGambling?: boolean;
  hasOther?: boolean;
  otherDesctiption?: string | undefined;
  citizenshipCountryID?: number;
  secondaryCitizenshipCountryID?: number | undefined;
  passportNumber?: string | undefined;
  isResident?: boolean | undefined;
  factCountryID?: number | undefined;
  factCityID?: number;
  factCity?: string | undefined;
  factAddress?: string | undefined;
  factPostalCode?: string | undefined;
  legalCountryID?: number | undefined;
  legalCityID?: number | undefined;
  legalCity?: string | undefined;
  legalAddress?: string | undefined;
  legalPostalCode?: string | undefined;
  employer?: string | undefined;
}

export interface ICustomerRegistrationNewResponse {
  actionResultMsg?: string | undefined;
}

export interface IIResponseOfCustomerRegistrationNewResponse {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: ICustomerRegistrationNewResponse | undefined;
}

export interface IFinishCustomerRegistrationRequest {
  customerSelf?: string | undefined;
  customerSelfContent?: string | undefined;
  customerSelfName?: string | undefined;
  documentBackSide?: string | undefined;
  documentBackSideContent?: string | undefined;
  documentBackSideName?: string | undefined;
  documentFrontSide?: string | undefined;
  documentFrontSideContent?: string | undefined;
  documentFrontSideName?: string | undefined;
  documentType?: string | undefined;
  name?: string | undefined;
  birthCityId?: number | undefined;
  personalID?: string | undefined;
  surname?: string | undefined;
  citizenshipCountryID?: number;
  sex?: number;
  birthDate?: string | undefined;
  birthCity?: string | undefined;
  secondaryCitizenshipCountryID?: number | undefined;
  passportNumber?: string | undefined;
}

export interface IFinishCustomerRegistrationResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: {};
}

export interface ICustomerPackageRegistrationResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: {};
}

export interface ICustomerPackageRegistrationRequest {
  customerId?: number;
  cardTypeID?: number;
  cardDeliveryCountryID?: number;
  cardDeliveryCityID?: number;
  cardDeliveryCity?: string | undefined;
  cardDeliveryAddress?: string | undefined;
  cardDeliveryPostalCode?: string | undefined;
  termID?: number;
  cardHolderName?: string | undefined;
  cardHolderSurname?: string | undefined;
  paketTypeid?: number | undefined | null;
  chosenCurrency?: string | undefined;
  paymentMethod?: number;
  accountPriority?: string | undefined;
  accountNumberCh?: string | undefined;
  hrm?: boolean;
  serviseCenter?: number;
  otp?: string | undefined;
  promoCode?: string | undefined;
}

export interface ICustomerBatchPackageRegistrationRequest {
  packages: ICustomerPackageRegistrationRequest[];
  otp?: string | undefined;
}

export interface ICardStatus {
  accountNumber: string | undefined;
  cardtype?: string | undefined;
  orderingCardID?: number;
  cardTypeID?: number;
  cardDeliveryStatusID?: number;
  cardDeliveryCardStatusName?: string | undefined;
  cardDeliveryCityID?: number;
  status?: number;
  statusName?: string | undefined;
  documentVerificationStatus?: number;
  paketTypeId?: number;
  packagecode?: string | undefined;
  amount?: number;
  groupId?: number;
  orderCancelDate?: Date;
  accountPriority?: string | undefined;
  coPaketTypeId?: number;
}

export interface IGetCardListWEBResponse {
  cardStatuses?: ICardStatus[] | undefined;
}

export interface IGetCardListWEBResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IGetCardListWEBResponse | undefined;
}

export interface ICancelPackageWEBRequest {
  groupId?: number;
  orderingCardId?: number;
  customerId?: number;
}

export interface ICancelPackageWEBResponse {}

export interface ICancelPackageWEBResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: ICancelPackageWEBResponse | undefined;
}

export interface IGetUserBlockedBlockedFundslistRequest {
  accountNumer?: string | undefined;
}

export interface IFund {
  transactionDate?: string | undefined;
  cardNumber?: string | undefined;
  amountGel?: number;
  merchantDescription?: string | undefined;
  currency?: string | undefined;
  terminalNumber?: string | undefined;
  amount?: number;
}

export interface IGetUserBlockedBlockedFundslistResponse {
  funds?: IFund[] | undefined;
}

export interface IGetUserBlockedBlockedFundslistResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IGetUserBlockedBlockedFundslistResponse | undefined;
}

export interface IUpdateUserProfileImageRequest {
  imageUrl?: string | undefined;
}

export interface IUpdateUserProfileImageResponse {
  imageUrl?: string | undefined;
}

export interface IIResponseOfUpdateUserProfileImageResponse {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IUpdateUserProfileImageResponse | undefined;
}

export interface IGetUserKycIdResponse {
  documentFrontSide?: string | undefined;
  documentBackSide?: string | undefined;
  documentType?: string | undefined;
  status?: string | undefined;
}

export interface IGetUserKycSelfImages {
  imageName?: string | undefined;
  imagePath?: string | undefined;
}

export interface IGetUserProfileDataResponse {
  userID?: number;
  userName?: string | undefined;
  email?: string | undefined;
  emailVerificationStatus?: number;
  phone?: string | undefined;
  phoneVerificationStatus?: number;
  factAddress?: string | undefined;
  legalAddress?: string | undefined;
  factCity?: string | undefined;
  factCountryID?: number;
  factPostalCode?: string | undefined;
  name?: string | undefined;
  surname?: string | undefined;
  idPhotos?: IGetUserKycIdResponse | undefined;
  selfies?: IGetUserKycSelfImages[] | undefined;
  birthDate?: string | undefined | null;
  personalID?: string | undefined | null;
}

export interface IGetUserProfileDataResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IGetUserProfileDataResponse | undefined;
}

export interface IChangeUserPasswordResponse {
}

export interface IChangeUserPasswordResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IChangeUserPasswordResponse | undefined;
}

export interface IChangePassBySystemRequest {
  userName?: string | undefined;
  oldPassword?: string | undefined;
  newPassword?: string | undefined;
  confirmNewPassword?: string | undefined;
}

export interface IChangePassBySystemResponse {
}


export interface IChangePassBySystemResponseData {
  ok: boolean;
  errors?: IError[] | undefined;
  data?: IChangePassBySystemResponse | undefined;
}

class UserService {
  GetUserDetails() {
    const promise = axios.get<IUserResponse>(
      `${envs.API_URL}User/GetUserDetails`,
    );
    return from(promise);
  }

  GetUserAccounts() {
    const promise = axios.get<IUserAccountResponse>(
      `${envs.API_URL}User/GetAccountBalanceByccy`,
    );
    return from(promise);
  }

  GetUserTotalBalance() {
    const promise = axios.get<IUserTotalBalance>(
      `${envs.API_URL}User/GetUserTotalBalance`,
    );
    return from(promise);
  }

  GetUserAccountStatements(data: IUserAccountsStatementRequest = {}) {
    if (!data.rowCount) {
      data.rowCount = 10;
    }

    const promise = axios.post<IUserAccountsStatement>(
      `${envs.API_URL}User/GetUserAccountsStatement`,
      data,
    );
    return from(promise);
  }

  GetUserProducts() {
    const promise = axios.get<IUserProductsResponse>(
      `${envs.API_URL}User/GetUserProducts`,
    );
    return from(promise);
  }

  GetPasswordResetData(userName?: string) {
    const promise = axios.get<IPasswordResetDataResponse>(
      `${envs.API_URL}User/GetPasswordResetData`,
      {params: {userName}},
    );
    return from(promise);
  }

  ResetPassword(data: IResetPasswordRequest) {
    const promise = axios.post<IResetPasswordResponseData>(
      `${envs.API_URL}User/ResetPassword`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }

  CheckUser(data: ICheckUserPersonalIdRequest) {
    const promise = axios.post<ICheckUserResponseData>(
      `${envs.API_URL}User/CheckUser`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }

  GetUnicards() {
    const promise = axios.get<IGetUnicardsResponseData>(
      `${envs.API_URL}Card/GetUnicards`,
      {objectResponse: true},
    );
    return from(promise);
  }

  GetCustomerEmploymentStatusTypes() {
    const promise = axios.get<IGetCustomerEmploymentStatusTypesResponseData>(
      `${envs.API_URL}User/GetCustomerEmploymentStatusTypes`,
    );
    return from(promise);
  }

  GetCustomerWorkTypes() {
    const promise = axios.get<IGetCustomerWorkTypesResponseData>(
      `${envs.API_URL}User/GetCustomerWorkTypes`,
    );
    return from(promise);
  }

  GetCustomerExpectedTurnoverTypes() {
    const promise = axios.get<IGetCustomerExpectedTurnoverTypesResponseData>(
      `${envs.API_URL}User/GetCustomerExpectedTurnoverTypes`,
    );
    return from(promise);
  }

  GetTransactionDetails(data: GetTransactionDetailsRequest) {
    const promise = axios.post<IGetTransactionDetailsResponseData>(
      `${envs.API_URL}User/GetTransactionDetails`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }

  GetUserBankCards() {
    const promise = axios.get<IGetUserBankCardsResponseData>(
      `${envs.API_URL}User/GetUserBankCards`,
    );
    return from(promise);
  }

  CustomerRegistration(data: ICustomerRegistrationNewRequest) {
    const promise = axios.post<IIResponseOfCustomerRegistrationNewResponse>(
      `${envs.API_URL}User/Registration/CustomerRegistration`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }

  FinishCostumerRegistration(data: IFinishCustomerRegistrationRequest) {
    const promise = axios.post<IFinishCustomerRegistrationResponseData>(
      `${envs.API_URL}User/FinishCustomerRegistration`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }

  customerPackageRegistration(
    data: ICustomerPackageRegistrationRequest | undefined,
  ) {
    const promise = axios.post<ICustomerPackageRegistrationResponseData>(
      `${envs.API_URL}User/CustomerPackageRegistration`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }

  CustomerBatchPackageRegistration(
    data: ICustomerBatchPackageRegistrationRequest | undefined,
  ) {
    const promise = axios.post<ICustomerPackageRegistrationResponseData>(
      `${envs.API_URL}User/CustomerBatchPackageRegistration`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }

  getCardListWEB(customerId: number | undefined) {
    const promise = axios.get<IGetCardListWEBResponseData>(
      `${envs.API_URL}User/GetCardListWEB?${customerId}`,
      {objectResponse: true},
    );
    return from(promise);
  }

  CancelPackageWEB(data: ICancelPackageWEBRequest | undefined) {
    const promise = axios.post<ICancelPackageWEBResponseData>(
      `${envs.API_URL}User/CancelPackageWEB`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }

  exportUserAccountStatementsAsPdf(tranID: number | undefined) {
    const promise = axios.get<string>(
      `${envs.API_URL}User/ExportUserAccountStatementsAsPdf?TranID=${tranID}`,
      {objectResponse: true},
    );
    return from(promise);
  }

  getUserBlockedFunds(
    data?: IGetUserBlockedBlockedFundslistRequest | undefined,
  ) {
    const promise = axios.post<IGetUserBlockedBlockedFundslistResponseData>(
      `${envs.API_URL}User/GetUserBlockedFunds`,
      {data},
      {objectResponse: true},
    );
    return from(promise);
  }

  updateUserProfileImage(data?: IUpdateUserProfileImageRequest | undefined) {
    const promise = axios.post<IIResponseOfUpdateUserProfileImageResponse>(
      `${envs.API_URL}User/UpdateUserProfileImage`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }

  getUserProfileData() {
    const promise = axios.get<IGetUserProfileDataResponseData>(
      `${envs.API_URL}User/GetUserProfileData`,
      {objectResponse: true},
    );
    return from(promise);
  }

  editUserProfileData() {
    // const promise = axios.put<>(
    //   `${envs.API_URL}User/EditUserProfileData`,
    //   {objectResponse: true},
    // );
    // return from(promise);
  }

  ChangeUserPassword(data: IChangeUserPasswordRequest) {
    const promise = axios.post<IChangeUserPasswordResponseData>(
      `${envs.API_URL}User/ChangeUserPassword`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }

  changePassBySystem(data: IChangePassBySystemRequest) {
    const promise = axios.post<IChangePassBySystemResponseData>(
      `${envs.API_URL}User/ChangePassBySystem`,
      data,
      {objectResponse: true},
    );
    return from(promise);
  }
}

export default new UserService();
