import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, KeyboardAvoidingView} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {useDispatch} from 'react-redux';
import FullScreenLoader from '../../../components/FullScreenLoading';
import colors from '../../../constants/colors';
import Routes from '../../../navigation/routes';
import {PUSH} from '../../../redux/actions/error_action';
import CardService from '../../../services/CardService';
import NavigationService from '../../../services/NavigationService';
import TransactionService from '../../../services/TransactionService';
import {getString} from '../../../utils/Converter';
import {parseUrlParamsegex} from '../../../utils/Regex';

const addBankCard: React.FC = () => {
  const [tranId, setTranId] = useState<string | null | undefined>();
  const [isEcommerce, setIsEcommerce] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const addBankCard = () => {
    CardService.AddUserBankCard().subscribe({
      next: Response => {
        if (Response.data.ok) {
          setIsEcommerce(Response.data.data?.redirectUrl);
        } else {
          dispatch(PUSH('დაფიქსირდა შეცდომა'));
        }
      },
      complete: () => setIsLoading(false),
      error: () => {
        dispatch(PUSH('დაფიქსირდა შეცდომა'));
        setIsLoading(false);
      },
    });
  };

  const CheckTransaction = () => {
    TransactionService.GetPayBills(undefined, tranId).subscribe({
      next: Response => {
        if (Response.data.Ok) {
          if (
            Response.data.Data?.Status === 6 ||
            Response.data.Data?.Status === 50 ||
            (Response.data.Data?.Status == 33 &&
              Response.data.Data?.forOpClassCode == 'B2B.Recurring')
          ) {
            NavigationService.navigate(Routes.AddBankCardSucces);
          } else {
            dispatch(PUSH('დაფიქსირდა შეცდომა'));
            NavigationService.GoBack();
          }
        } else {
          dispatch(PUSH('დაფიქსირდა შეცდომა'));
          setIsLoading(false)
          NavigationService.GoBack();
        }
      },
      complete: () => setIsLoading(false),
      error: err => {
        dispatch(PUSH(getString(err)));
        setIsLoading(false);
        NavigationService.GoBack();
      },
    });
  };

  const _onNavigationStateChange = (webViewState: WebViewNavigation) => {
    let match: RegExpExecArray | null;
    while ((match = parseUrlParamsegex.exec(webViewState.url.toString()))) {
      let m = match[1];
      if (m.toString() === 'trans_id') {
        setTranId(decodeURI(match[2]));
      }
    }

    const retriveUrl = webViewState.url.toString().trim();
   
    if (retriveUrl.endsWith('Payment_Success')) {
      setIsEcommerce(undefined);
      CheckTransaction();
    } else if (retriveUrl.endsWith('Payment_Failure')) {
      setIsEcommerce(undefined);
      dispatch(PUSH('დაფიქსირდა შეცდომა'));
      NavigationService.GoBack();
    }
  };

  useEffect(() => {
    addBankCard();
  }, []);

  return isLoading ? (
    <FullScreenLoader />
  ) : (
    <ScrollView contentContainerStyle={styles.avoid}>
      <KeyboardAvoidingView behavior="padding" style={styles.avoid}>
        <WebView
          source={{uri: getString(isEcommerce)}}
          onNavigationStateChange={_onNavigationStateChange.bind(this)}
          cacheEnabled={false}
          thirdPartyCookiesEnabled={true}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avoid: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
});

export default addBankCard;
