import {createStackNavigator} from '@react-navigation/stack';
import React, {useRef} from 'react';
import Routes from './routes';
import Dashboard from '../screens/dashboard/dashboard';
import Products from '../screens/dashboard/products';
import Payments from '../screens/dashboard/payments';
import Transfers from '../screens/dashboard/transfers';
import DefaultOptions, {DefaultOptionsDrawer} from './Header';
import ProductDetail from '../screens/dashboard/products/productDetail';
import TabNav from './TabNav';
import Transactions from '../screens/dashboard/transactions/transactions';
import TransferToBank from '../screens/dashboard/transfers/TransferToBank';
import TransferToUni from '../screens/dashboard/transfers/TransferToUni';
import TransferBetweenAccounts from '../screens/dashboard/transfers/TransferBetweenAccounts';
import TransferConvertation from '../screens/dashboard/transfers/TransferConvertation';
import PaymentSteps from '../screens/dashboard/payments/PaymentSteps/paymentSteps';
import InsertAbonentCode from '../screens/dashboard/payments/PaymentSteps/InsertAbonentCode';
import InsertAccointAndAmount from '../screens/dashboard/payments/PaymentSteps/InsertAccountAndAmount';
import CheckDebt from '../screens/dashboard/payments/PaymentSteps/CheckDebt';
import PaymentSucces from '../screens/dashboard/payments/PaymentSteps/PaymentSucces';
import EditTemplate from '../screens/dashboard/payments/PaymentSteps/EditTemplate';
import PayAll from '../screens/dashboard/payments/PayAll/PayAll';
import PayAllSucces from '../screens/dashboard/payments/PayAll/PayAllSucces';
import CardsStore from '../screens/dashboard/cardsStore';
import choosePlane from '../screens/dashboard/cardsStore/choosePlane';
import TarriffCalculator from '../screens/dashboard/cardsStore/TarriffCalculator';
import DelyveryMethods from '../screens/dashboard/cardsStore/DelyveryMethods';
import TarrifSetOtp from '../screens/dashboard/cardsStore/TarrifSetOtp';
import PreOrder from '../screens/dashboard/cardsStore/PreOrder';
import PrintInfo from '../screens/dashboard/cardsStore/PrintInfo';
import TransferTemplateEdit from '../screens/dashboard/transfers/TransferTemplateEdit';
import Topup from '../screens/dashboard/topup/Topup';
import TopupFlow from '../screens/dashboard/topup';
import ChoosBankCard from '../screens/dashboard/topup/ChoosBankCard';
import ChooseAmountAndAccount from '../screens/dashboard/topup/ChooseAmountAndAccount';
import TopupSucces from '../screens/dashboard/topup/TopupSucces';
import addBankCard from '../screens/dashboard/addBankCard/addBankCard';
import AddBankCardSucces from '../screens/dashboard/addBankCard/AddBankCardSucces';
import CreatePayTemplate from '../screens/dashboard/payments/CreateTemplate';
import {DrawerLayout} from 'react-native-gesture-handler';
import {StatusBar, View} from 'react-native';
import SideBarDrawer from './SideBarDrawer';
import colors from '../constants/colors';
import NavigationService from '../services/NavigationService';
import Settings from '../screens/dashboard/settings/settings';
import PasswordReset from '../screens/landing/password/PasswordReset';
import ResetPasswordOtp from '../screens/landing/password/ResetPasswordOtp';
import PasswordResetStepFour from '../screens/landing/password/PasswordResetStepFour';
import PasswordResetSucces from '../screens/landing/password/PasswordResetSucces';
import SetPassCode from '../screens/dashboard/settings/setPassCode';
import EditUserInfo from '../screens/dashboard/settings/editUserInfo';
import Verification from '../screens/dashboard/Verification/Index';
import BiometricAuthScreen from '../screens/dashboard/settings/biometric';
import PasswordChangeSucces from '../screens/landing/password/change/PasswordChangeSucces';
import PasswordChangeStepFour from '../screens/landing/password/change/PasswordChangeStepFour';
import ChangePasswordOtp from '../screens/landing/password/change/ChangePasswordOtp';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../redux/action_types/translate_action_types';
import { useSelector } from 'react-redux';

const appStack = createStackNavigator();

const AppStack: React.FC = () => {
  const sideDraver = useRef<DrawerLayout | null>();
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;

  return (
    <DrawerLayout
      drawerWidth={300}
      drawerLockMode={'unlocked'}
      keyboardDismissMode="on-drag"
      ref={drawer => {
        sideDraver.current = drawer;
        NavigationService.setDrawerOpen(sideDraver.current?.openDrawer, 0);
        NavigationService.setDrawerClose(sideDraver.current?.closeDrawer, 0);
      }}
      renderNavigationView={props => <SideBarDrawer props={props} />}>
      <>
        <StatusBar
          backgroundColor={colors.baseBackgroundColor}
          barStyle="dark-content"
        />
        <appStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <appStack.Screen
            name={Routes.Home}
            options={DefaultOptions}
            component={Dashboard}
          />
          <appStack.Screen
            name={Routes.Dashboard}
            options={DefaultOptions}
            component={Dashboard}
          />
          <appStack.Screen
            name={Routes.Products}
            options={DefaultOptions}
            component={Products}
          />
          <appStack.Screen
            name={Routes.Payments}
            options={DefaultOptions}
            component={Payments}
          />
          <appStack.Screen
            name={Routes.Transfers}
            options={DefaultOptions}
            component={Transfers}
          />
          <appStack.Screen
            name={Routes.ProductDetail}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('common.details'),
              })
            }
            component={ProductDetail}
          />
          <appStack.Screen
            name={Routes.Transactions}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transaction.transactions'),
              })
            }
            component={Transactions}
          />
          <appStack.Screen
            name={Routes.TransferToBank_CHOOSE_ACCOUNTS}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.toBank'),
              })
            }
            component={TransferToBank}
          />
          <appStack.Screen
            name={Routes.TransferToBank_SET_CURRENCY}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.toBank'),
              })
            }
            component={TransferToBank}
          />
          <appStack.Screen
            name={Routes.TransferToBank_SET_OTP}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.toBank'),
              })
            }
            component={TransferToBank}
          />
          <appStack.Screen
            name={Routes.TransferToBank_SUCCES}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.toBank'),
                hideHeader: true,
              })
            }
            component={TransferToBank}
          />
          <appStack.Screen
            name={Routes.TransferToUni_CHOOSE_ACCOUNTS}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.toUniWallet'),
              })
            }
            component={TransferToUni}
          />
          <appStack.Screen
            name={Routes.TransferToUni_SET_CURRENCY}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.toUniWallet'),
              })
            }
            component={TransferToUni}
          />
          <appStack.Screen
            name={Routes.TransferToUni_SET_OTP}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.toUniWallet'),
              })
            }
            component={TransferToUni}
          />
          <appStack.Screen
            name={Routes.TransferToUni_SUCCES}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.toUniWallet'),
                hideHeader: true,
              })
            }
            component={TransferToUni}
          />
          <appStack.Screen
            name={Routes.TransferToUni_TEMPLATE_IS_SAVED}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.toUniWallet'),
                hideHeader: true,
              })
            }
            component={TransferToUni}
          />
          <appStack.Screen
            name={Routes.TransferBetweenAcctounts_CHOOSE_ACCOUNTS}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.betweeenOwnAccounts'),
              })
            }
            component={TransferBetweenAccounts}
          />
          <appStack.Screen
            name={Routes.TransferBetweenAcctounts_SET_CURRENCY}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.betweeenOwnAccounts'),
              })
            }
            component={TransferBetweenAccounts}
          />
          <appStack.Screen
            name={Routes.TransferBetweenAcctounts_SUCCES}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: translate.t('transfer.betweeenOwnAccounts'),
                hideHeader: true,
              })
            }
            component={TransferBetweenAccounts}
          />
          <appStack.Screen
            name={Routes.TransferConvertation_CHOOSE_ACCOUNTS}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title:translate.t('transfer.currencyExchange'),
              })
            }
            component={TransferConvertation}
          />
          <appStack.Screen
            name={Routes.TransferConvertation_SET_CURRENCY}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title:translate.t('transfer.currencyExchange'),
              })
            }
            component={TransferConvertation}
          />
          <appStack.Screen
            name={Routes.TransferConvertation_SUCCES}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title:translate.t('transfer.currencyExchange'),
                hideHeader: true,
              })
            }
            component={TransferConvertation}
          />
          <appStack.Screen
            name={Routes.Payments_STEP1}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'გადახდა',
              })
            }
            component={PaymentSteps}
          />
          <appStack.Screen
            name={Routes.Payments_STEP2}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'გადახდა',
              })
            }
            component={PaymentSteps}
          />
          <appStack.Screen
            name={Routes.Payments_STEP3}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'გადახდა',
              })
            }
            component={PaymentSteps}
          />
          <appStack.Screen
            name={Routes.Payments_STEP4}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'გადახდა',
              })
            }
            component={PaymentSteps}
          />
          <appStack.Screen
            name={Routes.Payments_INSERT_ABONENT_CODE}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'გადახდა',
              })
            }
            component={InsertAbonentCode}
          />
          <appStack.Screen
            name={Routes.Payments_INSERT_ACCOUNT_AND_AMOUNT}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'გადახდა',
              })
            }
            component={InsertAccointAndAmount}
          />
          <appStack.Screen
            name={Routes.Payments_CHECK_DEBT}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'გადახდა',
              })
            }
            component={CheckDebt}
          />
          <appStack.Screen
            name={Routes.Payments_SUCCES}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'გადახდა',
                hideHeader: true,
              })
            }
            component={PaymentSucces}
          />
          <appStack.Screen
            name={Routes.Payments_EditTemplate}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'შაბლონის რედაქტირება',
              })
            }
            component={EditTemplate}
          />
          <appStack.Screen
            name={Routes.Payments_PAY_ALL}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბევრის გადახდა',
              })
            }
            component={PayAll}
          />
          <appStack.Screen
            name={Routes.Payments_PAY_ALL_CHECK_DEBT}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბევრის გადახდა',
              })
            }
            component={PayAll}
          />
          <appStack.Screen
            name={Routes.Payments_PAY_ALL_SUCCES}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბევრის გადახდა',
                hideHeader: true,
              })
            }
            component={PayAllSucces}
          />
          <appStack.Screen
            name={Routes.Payments_PAY_ALL_OTP}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბევრის გადახდა',
              })
            }
            component={PayAll}
          />
          <appStack.Screen
            name={Routes.CardsStore}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბარათის შეკვეთა',
              })
            }
            component={CardsStore}
          />
          <appStack.Screen
            name={Routes.ChoosePlan}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბარათის შეკვეთა',
              })
            }
            component={choosePlane}
          />
          <appStack.Screen
            name={Routes.TarriffCalculator}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბარათის შეკვეთა',
              })
            }
            component={TarriffCalculator}
          />
          <appStack.Screen
            name={Routes.DelyveryMethods}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბარათის მიღების მეთოდის არჩევა',
              })
            }
            component={DelyveryMethods}
          />
          <appStack.Screen
            name={Routes.TarrifSetOtp}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბარათის შეკვეთა',
              })
            }
            component={TarrifSetOtp}
          />
          <appStack.Screen
            name={Routes.PreOrder}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'წინასწარი შეკვეთა',
              })
            }
            component={PreOrder}
          />
          <appStack.Screen
            name={Routes.PrintInfo}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ქვითარი',
                hideHeader: true,
              })
            }
            component={PrintInfo}
          />
          <appStack.Screen
            name={Routes.TransferTemplateEdit}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'შაბლონის რედაქტირება',
              })
            }
            component={TransferTemplateEdit}
          />
          <appStack.Screen
            name={Routes.TopupFlow}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბალანსის შევსება',
              })
            }
            component={TopupFlow}
          />
          <appStack.Screen
            name={Routes.Topup}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბალანსის შევსება',
              })
            }
            component={Topup}
          />
          <appStack.Screen
            name={Routes.TopupChoosBankCard}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბალანსის შევსება',
              })
            }
            component={ChoosBankCard}
          />
          <appStack.Screen
            name={Routes.TopupChooseAmountAndAccount}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბალანსის შევსება',
              })
            }
            component={ChooseAmountAndAccount}
          />
          <appStack.Screen
            name={Routes.TopupSucces}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბალანსის შევსება',
                hideHeader: true,
              })
            }
            component={TopupSucces}
          />
          <appStack.Screen
            name={Routes.addBankCard}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბარათის დამატება',
              })
            }
            component={addBankCard}
          />
          <appStack.Screen
            name={Routes.AddBankCardSucces}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ბარათის დამატება',
                hideHeader: true,
              })
            }
            component={AddBankCardSucces}
          />
          <appStack.Screen
            name={Routes.CreatePayTemplate}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'გადახდის შაბლონი',
              })
            }
            component={CreatePayTemplate}
          />
          <appStack.Screen name={Routes.Settings} component={Settings} />
          <appStack.Screen
            name={Routes.ResetPassword}
            component={PasswordReset}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'პაროლის შეცვლა',
              })
            }
          />
          <appStack.Screen
            name={Routes.ResetPasswordOtp}
            component={ResetPasswordOtp}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'პაროლის შეცვლა',
              })
            }
          />
          <appStack.Screen
            name={Routes.PasswordResetStepFour}
            component={PasswordResetStepFour}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'პაროლის შეცვლა',
              })
            }
          />
          <appStack.Screen
            name={Routes.PasswordResetSucces}
            component={PasswordResetSucces}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'პაროლის შეცვლა',
              })
            }
          />
          <appStack.Screen
            name={Routes.setPassCode}
            component={SetPassCode}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'პასკოდი',
              })
            }
          />
          <appStack.Screen
            name={Routes.EditUserInfo}
            component={EditUserInfo}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'პერსონალური ინფორმაცია',
              })
            }
          />
          <appStack.Screen
            name={Routes.Verification}
            component={Verification}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ვერიფიკაცია',
                hideHeader: true,
              })
            }
          />
          <appStack.Screen
            name={Routes.Biometric}
            component={BiometricAuthScreen}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'ვერიფიკაცია',
              })
            }
          />
          <appStack.Screen
            name={Routes.PasswordChangeSucces}
            component={PasswordChangeSucces}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'პაროლის შეცვლა',
                hideHeader: true,
              })
            }
          />
          <appStack.Screen
            name={Routes.PasswordChangeStepFour}
            component={PasswordChangeStepFour}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'პაროლის შეცვლა',
              })
            }
          />
          <appStack.Screen
            name={Routes.ChangePasswordOtp}
            component={ChangePasswordOtp}
            options={props =>
              DefaultOptionsDrawer({
                navigation: props.navigation,
                route: props.route,
                title: 'პაროლის შეცვლა',
              })
            }
          />
        </appStack.Navigator>
        <TabNav />
      </>
    </DrawerLayout>
  );
};

export default AppStack;
