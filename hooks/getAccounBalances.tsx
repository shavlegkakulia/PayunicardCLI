import {useEffect, useReducer} from 'react';
import {
  TYPE_UNICARD,
  UNICARD_PLUS,
  UNICARD_ULTRA,
  UPERA,
} from '../constants/accountTypes';
import currencies, {GEL} from '../constants/currencies';
import UserService, {
  IAccountBallances,
  IUnicard,
} from '../services/UserService';
import { getNumber } from '../utils/Converter';

const cache: IAccountBallances | undefined = undefined;

interface IAccountStates {
  loading: boolean;
  error: string;
  accounts: IAccountBallances | undefined;
}

export default function FetchUserAccounts(refetch?: boolean) {
  let UserAccounts: IAccountBallances | {accountBallances: []};
  const [state, setState] = useReducer(
    (state: IAccountStates, newState: Partial<IAccountStates>) => ({
      ...state,
      ...newState,
    }),
    {
      loading: false,
      accounts: undefined,
      error: '',
    },
  );
  const {accounts, loading, error} = state;

  useEffect(() => {
    if ((!refetch && accounts?.accountBallances !== undefined) || loading) {
      return;
    }

    setState({loading: true});
    if (cache?.accountBallances !== undefined && !refetch) {
      setState({accounts: cache, loading: false});
    } else {
      UserService.GetUserAccounts().subscribe({
        next: Response => {
          UserAccounts = Response?.data?.data || {accountBallances: []};
          UserAccounts?.accountBallances?.map(account => {
            if (account.customerPaketId === 2) {
              account.accountTypeName = UPERA;
            } else if (account.customerPaketId === 3) {
              account.accountTypeName = UNICARD_PLUS;
            } else if (account.customerPaketId === 4) {
              account.accountTypeName = UNICARD_ULTRA;
            }
            return account;
          }) || {accountBallances: []};
        },
        error: err => {
          setState({loading: false, error: err});
        },
        complete: () => {
          let userUnicards: IUnicard[];
          UserService.GetUnicards().subscribe({
            next: Response => {
              if (Response.data.ok) {
                let tempUnicards = Response.data.data?.unicards;
                //@ts-ignore
                userUnicards =
                  tempUnicards?.map(uni => {
                    let uCard = {
                      accountTypeName: 'UniCard',
                      accountId: uni.card,
                      accountNumber: uni.card,
                      cardMask: `${'****' + uni.card?.slice(12, 16)}`,
                      isUnicard: true,
                      availableInGEL: uni.amount,
                      cards: [],
                      currencies: [
                        {
                          key: GEL,
                          value: currencies.GEL,
                          balance: (getNumber(uni.amount) || 0) / 10,
                        },
                      ],
                      imageUrl: require('./../assets/images/uniLogo.png'),
                      isActive: true,
                      type: TYPE_UNICARD, // type 7 is custom type for unicard
                    };
                    return uCard;
                  }) || [];
              }
            },
            complete: () => {
              cache?.accountBallances.push(
                ...[...UserAccounts?.accountBallances, ...userUnicards],
              );
              setState({
                loading: false,
                accounts: {
                  accountBallances: [
                    ...UserAccounts?.accountBallances,
                    ...userUnicards,
                  ],
                },
              });
            },
            error: err => {
              setState({loading: false, error: err});
            },
          });
        },
      });
    }
  }, [refetch]);

  return {accounts, error, loading};
}
