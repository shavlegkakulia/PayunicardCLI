import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useReducer, useRef} from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {getPayTemplates} from '../../redux/actions/payments_actions';
import {FetchUserAccounts} from '../../redux/actions/user_actions';
import NetworkService from '../../services/NetworkService';
import PresentationService, {
  IGetPaymentDetailsRequest,
  IGetPaymentDetailsResponseData,
  IMerchant,
  IMerchantServicesForTemplateRequest,
} from '../../services/PresentationServive';
import {ICategory, IService} from '../../services/PresentationServive';
import screenStyles from '../../styles/screens';
import Categories from './categories/Categories';
import Merchants from './categories/merchants';
import GestureRecognizer from 'react-native-swipe-gestures';
import {tabHeight} from '../../navigation/TabNav';
import {headerHeight} from '../../constants/defaults';

const config = {
  velocityThreshold: 0.1,
  directionalOffsetThreshold: 80,
};

interface IPageProps {
  refresh?: boolean;
  onCategoriesDidLoad?: (categoryTitle?: string) => void;
}

export interface ICategoryParams {
  parentID?: number;
  isService?: boolean;
  hasService?: boolean;
  hasChildren?: boolean;
  categoryTitle?: string;
}

interface IPaymentStates {
  refreshing: boolean;
  categoriesLoading?: boolean;
  categoriesStep: number;
  paymentStep: number;
  categories: Array<ICategory[] | IService[]>;
  isService: boolean;
  merchants?: IMerchant[];
  service?: IService;
  services?: IService[];
  paymentDetails?: IGetPaymentDetailsResponseData;
}

const CategoryContainer: React.FC<IPageProps> = ({
  refresh,
  onCategoriesDidLoad,
}) => {
  const navigation = useNavigation();
  const redux_dispatch = useDispatch();
  const [state, setState] = useReducer(
    (state: IPaymentStates, newState: Partial<IPaymentStates>) => ({
      ...state,
      ...newState,
    }),
    {
      refreshing: false,
      categories: [],
      categoriesStep: 0,
      paymentStep: 0,
      isService: false,
    },
  );
  const unsubscribe = useRef<() => void>();
  const {
    refreshing,
    categories,
    categoriesStep,
    services,
    categoriesLoading,
    paymentStep,
    merchants,
  } = state;
  const onCategoriesComplate = (categoryTitle?: string) => {
    onCategoriesDidLoad?.(categoryTitle);
  };
  useEffect(() => {
    unsubscribe.current = navigation.addListener('beforeRemove', e => {
      if (paymentStep + categoriesStep > 1) {
        goBack();
        Alert.alert('!');
        e.preventDefault();
      }
    });

    return () => {
      unsubscribe.current?.();
    };
  }, [navigation, paymentStep + categoriesStep]);
  useEffect(() => {
    NetworkService.CheckConnection(() => {
      if (refresh) {
        setState({
          categoriesStep: 0,
          paymentStep: 0,
          categories: [],
          merchants: undefined,
          refreshing: true,
        });
      }
    });
  }, [refresh]);
  useEffect(() => {
    NetworkService.CheckConnection(() => {
      if (refreshing) {
        getCategories({});
        redux_dispatch(FetchUserAccounts());
      }
    });
  }, [refreshing]);
  useEffect(() => {
    NetworkService.CheckConnection(() => {
      getCategories({});
      redux_dispatch(FetchUserAccounts());
    });
  }, []);
  const goBack = () => {
    console.log(categories?.length, categoriesStep);
    if (categories?.length <= 1 && categoriesStep <= 0) return;

    if (paymentStep > 0) {
      setState({paymentStep: paymentStep - 1, merchants: undefined});
      return;
    }

    const _categories = categories.splice(0, categories.length - 1);
    setState({categories: _categories, categoriesStep: categoriesStep - 1});
  };
  const GetPaymentDetails = (data: IGetPaymentDetailsRequest) => {
    NetworkService.CheckConnection(() => {
      PresentationService.GetPaymentDetails(data).subscribe({
        next: Response => {
          if (Response.data.ok) {
            setState({
              paymentDetails: Response.data.data,
              categoriesLoading: false,
            });
          }
        },
        error: () => setState({categoriesLoading: false}),
      });
    });
  };
  const GetMerchantServices = (data: IMerchantServicesForTemplateRequest) => {
    NetworkService.CheckConnection(() => {
      console.log(data);
      PresentationService.GetMerchantServices(data).subscribe({
        next: Response => {
          if (Response.data.ok) {
            const _merchants = [...Response.data.data?.merchants]?.map(cat => {
              cat.isService = true;
              cat.hasServices = true;
              return cat;
            });
            setState({
              merchants: _merchants,
              categoriesLoading: false,
              paymentStep: paymentStep + 1,
            });
          }
        },
        error: () => {
          setState({categoriesLoading: false});
        },
      });
    });
  };
  const getPayCategoriesServices = (parentID: number = 0) => {
    NetworkService.CheckConnection(() => {
      setState({categoriesLoading: true});
      PresentationService.GetCategories(parentID).subscribe({
        next: Response => {
          if (Response.data.ok) {
            const paymentCategories =
              categories.length > 0
                ? Response.data.data.categories.splice(1)
                : Response.data.data.categories;
            if (!true) {
              const filtered = paymentCategories.map(c => {
                if (
                  c.categoryID !== 1 &&
                  c.categoryID != 7 &&
                  c.categoryID !== 13
                ) {
                  c.cannotPay = true;
                }
                return c;
              });

              setState({
                refreshing: false,
                categories: [...categories, filtered],
                categoriesLoading: false,
                categoriesStep: categoriesStep + 1,
              });
            } else {
              setState({
                refreshing: false,
                categories: [...categories, paymentCategories],
                categoriesLoading: false,
                categoriesStep: categoriesStep + 1,
              });
            }
            let categoryTitle: string | undefined = '';
            if (paymentCategories) {
              categoryTitle = paymentCategories[0].name;
            }
            onCategoriesComplate(categoryTitle);
          }
        },
        error: () => {
          setState({categoriesLoading: false});
          onCategoriesComplate();
        },
      });
    });
  };
  const getCategories = ({
    parentID = 0,
    isService = false,
    hasService = false,
    hasChildren = false,
    categoryTitle = '',
  }: ICategoryParams) => {
    if (categoriesLoading) {
      return;
    }

    setState({categoriesLoading: true});

    if (isService && hasService && !hasChildren) {
      let currentService: ICategory[] | IService[] | undefined,
        merchantCode,
        merchantServiceCode;

      currentService = categories[categoriesStep - 1].filter(
        c => c.name === categoryTitle,
      );

      if (!currentService || !currentService.length) {
        //from the search
        currentService = services?.filter(s => s.categoryID === parentID);

        merchantCode = services?.[0]?.merchantCode;
        merchantServiceCode = services?.[0]?.merchantServiceCode;
      } else {
        merchantCode = currentService[0].merchantCode;
        merchantServiceCode = currentService[0].merchantServiceCode;
      }

      setState({service: currentService?.[0], isService: true});

      GetPaymentDetails({
        ForMerchantCode: merchantCode,
        ForMerchantServiceCode: merchantServiceCode,
        ForOpClassCode: 'B2B.F',
      });

      return;
    }

    /* categories contains merchant and also service */
    if (!isService && hasService && !hasChildren) {
      GetMerchantServices({CategoryID: parentID});
    } /* categories contains merchants */ else if (
      !isService &&
      hasService &&
      hasChildren
    ) {
      getPayCategoriesServices(parentID);
    } /* categories contains only services */ else if (
      !isService &&
      !hasService
    ) {
      getPayCategoriesServices(parentID);
    }
  };

  console.log(paymentStep + categoriesStep);
  const modalVisible = categoriesStep > 1 || paymentStep > 0;
  return (
    <>
      <View style={[screenStyles.screenContainer, {backgroundColor: 'green'}]}>
        {categories !== undefined &&
          categories?.[0]?.map(current => (
            <TouchableOpacity
              onPress={() =>
                getCategories({
                  parentID: current.categoryID,
                  isService: current.isService,
                  hasService: current.hasServices,
                  hasChildren: current.hasChildren,
                  categoryTitle: current.name,
                })
              }>
              <Text key={current.imageUrl}>{current.name}</Text>
            </TouchableOpacity>
          ))}
      </View>
      <GestureRecognizer
        onSwipeRight={goBack}
        style={styles.gestureView}
        config={config}>
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={goBack}
          style={styles.modalView}>
          <View style={styles.categoriesView}>
            {categories !== undefined && categories.length > 0 && (
              <TouchableOpacity onPress={goBack}>
                <Text>Back</Text>
              </TouchableOpacity>
            )}
            {!merchants || merchants?.length <= 0 ? (
              <Categories
                categories={categories?.[categoriesStep - 1]}
                getCategories={getCategories}
              />
            ) : (
              <Merchants merchants={merchants} />
            )}
          </View>
        </Modal>
      </GestureRecognizer>
    </>
  );
};

export default CategoryContainer;

const styles = StyleSheet.create({
  categoriesView: {
    backgroundColor: 'red',
    marginTop: Platform.OS === 'android' ? headerHeight : headerHeight + 15,
    marginBottom: tabHeight,
    flex: 1
  },
  gestureView: {flex: 1},
  modalView: {
    flex: 1,
  },
});
