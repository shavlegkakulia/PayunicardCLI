import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Routes from '../../../navigation/routes';
import {
  getPayCategoriesServices,
  GetPaymentDetails,
} from '../../../redux/actions/payments_actions';
import {
  IGlobalPaymentState,
  IPaymentState,
  PAYMENTS_ACTIONS,
} from '../../../redux/action_types/payments_action_type';
import NetworkService from '../../../services/NetworkService';
import {
  ICategory,
  IMerchantServicesForTemplateRequest,
  IService,
} from '../../../services/PresentationServive';
import CategoriesContainer from './CategoriesContainer';
import PresentationService from './../../../services/PresentationServive';
import NavigationService from '../../../services/NavigationService';
import {getNumber} from '../../../utils/Converter';
import colors from '../../../constants/colors';
import {tabHeight} from '../../../navigation/TabNav';

const CreatePayTemplate: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>();
  const PaymentStore = useSelector<IGlobalPaymentState>(
    state => state.PaymentsReducer,
  ) as IPaymentState;
  const dispatch = useDispatch();

  const getCategories = (
    parentID: number = 0,
    isService: boolean = false,
    hasService: boolean = false,
    hasChildren: boolean = false,
    navigate: boolean = false,
    categoryTitle: string = '',
  ) => {
    if (PaymentStore.isCategoriesLoading) return;

    dispatch({
      type: PAYMENTS_ACTIONS.SET_PAYEMNT_ACTIVE_CATEGORY_TITLE,
      title: categoryTitle,
    });

    dispatch({
      type: PAYMENTS_ACTIONS.SET_IS_PAYMENT_CATEGORIES_LOADING,
      isCategoriesLoading: true,
    });

    const onComplate = (cats: ICategory[] | undefined, url?: string) => {
      dispatch({
        type: PAYMENTS_ACTIONS.SET_IS_PAYMENT_CATEGORIES_LOADING,
        isCategoriesLoading: false,
      });

      if (navigate) {
        gotoPaymentStep(url, undefined, cats);
      }
    };

    const onError = () => {
      dispatch({
        type: PAYMENTS_ACTIONS.SET_IS_PAYMENT_CATEGORIES_LOADING,
        isCategoriesLoading: false,
      });
    };

    if (isService && hasService && !hasChildren) {
      let currentService: ICategory[] | IService[],
        merchantCode,
        merchantServiceCode;

      currentService = [...(categories || [])].filter(
        c => c.name === categoryTitle,
      );

      if (!currentService.length) {
        //from the search
        currentService = PaymentStore.services.filter(
          service => service.categoryID === parentID,
        );

        merchantCode = PaymentStore.services[0]?.merchantCode;
        merchantServiceCode = PaymentStore.services[0]?.merchantServiceCode;
      } else {
        merchantCode = currentService[0].merchantCode;
        merchantServiceCode = currentService[0].merchantServiceCode;
      }

      dispatch({
        type: PAYMENTS_ACTIONS.SET_CURRENT_PAYMENT_SERVICE,
        currentService: currentService[0],
      });
      console.log('*************first');
      dispatch({
        type: PAYMENTS_ACTIONS.SET_IS_PAYMENT_SERVICE,
        isService: true,
      });

      dispatch(
        GetPaymentDetails(
          {
            ForMerchantCode: merchantCode,
            ForMerchantServiceCode: merchantServiceCode,
            ForOpClassCode: 'B2B.F',
          },
          () => onComplate(undefined, Routes.Payments_INSERT_ABONENT_CODE),
          onError,
        ),
      );

      return;
    }

    /* categories contains merchant and also service */
    if (!isService && hasService && !hasChildren) {
      console.log('*****************second');
      GetMerchantServices({CategoryID: parentID}, onComplate, onError);
    } /* categories contains merchants */ else if (
      !isService &&
      hasService &&
      hasChildren
    ) {
      console.log('****************thirt');
      dispatch(getPayCategoriesServices(parentID, onComplate, onError));
    } /* categories contains only services */ else if (
      !isService &&
      !hasService
    ) {
      console.log('*************fourty');
      dispatch(
        getPayCategoriesServices(
          parentID,
          (cats: ICategory[]) => {
            if (!categories) {
              setCategories(cats);
            }
            onComplate(cats);
          },
          onError,
        ),
      );
    }
  };

  const GetMerchantServices = (
    data: IMerchantServicesForTemplateRequest,
    onComplate: Function,
    onError: Function,
  ) => {
    NetworkService.CheckConnection(() => {
      PresentationService.GetMerchantServices(data).subscribe({
        next: Response => {
          const merchant = [...Response.data.data?.merchants]?.map(cat => {
            cat.isService = true;
            cat.hasServices = true;
            return cat;
          });
          onComplate(merchant);
        },
        error: () => {
          onError();
        },
      });
    });
  };

  const gotoPaymentStep = (
    url?: string,
    paymentStep?: number,
    icat?: ICategory[],
  ) => {
    NavigationService.navigate(url || Routes.Payments_STEP1, {
      paymentStep:
        getNumber(paymentStep) >= 0
          ? paymentStep
          : url || Routes.Payments_STEP1,
      step: 1,
      category: [...(icat || [])],
      withTemplate: true
    });
  };

  useEffect(() => {
    getCategories();
  }, []);
  console.log(PaymentStore.PayTemplates);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CategoriesContainer
        hideSearchBox={true}
        notForTemplate={true}
        categories={categories}
        Services={PaymentStore.services}
        isLoading={PaymentStore.isCategoriesLoading}
        isCategoriesFetching={
          PaymentStore.isCategoriesLoading && !categories?.length
        }
        onSearch={() => {}}
        onViewCategory={(
          categoryID: number,
          isService: boolean,
          hasService: boolean,
          hasChildren: boolean,
          viewInAction: boolean,
          title: string,
        ) => {
          if (PaymentStore.services) {
            dispatch({
              type: PAYMENTS_ACTIONS.SET_PAYMENT_SERVICES,
              services: [],
            });
          }

          getCategories(
            categoryID,
            isService,
            hasService,
            hasChildren,
            viewInAction,
            title,
          );
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: tabHeight,
  },
  loadingBox: {
    alignSelf: 'center',
    flex: 1,
    marginTop: 10,
  },
});

export default CreatePayTemplate;
