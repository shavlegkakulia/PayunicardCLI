import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {FetchUserAccounts} from '../../redux/actions/user_actions';
import NetworkService from '../../services/NetworkService';
import PresentationService, {
  IGetPaymentDetailsRequest,
  IGetPaymentDetailsResponseData,
  IMerchant,
  IMerchantServicesForTemplateRequest,
} from '../../services/PresentationServive';
import {ICategory, IService} from '../../services/PresentationServive';
import Categories from './categories/Categories';
import Merchants from './merchants/merchants';
import {headerHeight} from '../../constants/defaults';
import Item from './categories/Item';
import colors from '../../constants/colors';
import SwipableModal from '../SwipableModal';
import {ScrollView} from 'react-native-gesture-handler';
import PaginationDots from '../PaginationDots';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../redux/action_types/user_action_types';
import userStatuses from '../../constants/userStatuses';
import {
  ITranslateState,
  IGlobalState as Itranslate,
} from '../../redux/action_types/translate_action_types';
import InsertAbonent from './index/InsertAbonent';
import InsertAmount from './index/InsertAmount';
import PaymentSucces from './index/PaymentSucces';
import PaymentOtp from './index/PaymentOtp';
import SaveAsTemplate from './index/SaveAsTemplate';

export enum gridStyle {
  verticallScroll = 'verticallScroll',
  twoColumn = 'twoColumn',
  list = 'list',
}

enum EPaymentStep {
  start = 1,
  InsertAbonent = 2,
  InsertAmount = 3,
  PaymentLastViews = 4,
  PaymentSucces = 5,
}

enum EPaymentCurrentView {
  otp = 1,
  succes = 2,
  setTemplate = 3,
}

interface IPageProps {
  title?: string;
  gridVariant?: gridStyle;
  refresh?: boolean;
  onCategoriesDidLoad?: () => void;
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
  paymentCurrentView: EPaymentCurrentView;
}

const CategoryContainer: React.FC<IPageProps> = ({
  refresh,
  onCategoriesDidLoad,
  gridVariant,
  title,
}) => {
  const translate = useSelector<Itranslate>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;

  const {documentVerificationStatusCode, customerVerificationStatusCode} =
    userData.userDetails || {};

  const isUserVerified =
    documentVerificationStatusCode === userStatuses.Enum_Verified &&
    customerVerificationStatusCode === userStatuses.Enum_Verified;
  const redux_dispatch = useDispatch();
  const [pageIndex, setPageIndes] = useState(0);
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
      paymentCurrentView: EPaymentCurrentView.succes,
    },
  );
  const {
    refreshing,
    categories,
    categoriesStep,
    services,
    categoriesLoading,
    paymentStep,
    merchants,
    paymentDetails,
    paymentCurrentView,
    service,
  } = state;
  const onCategoriesComplate = () => {
    onCategoriesDidLoad?.();
  };
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
        getCategories();
        redux_dispatch(FetchUserAccounts());
      }
    });
  }, [refreshing]);
  useEffect(() => {
    NetworkService.CheckConnection(() => {
      getCategories();
      redux_dispatch(FetchUserAccounts());
    });
  }, []);
  const goBack = () => {
    if (categories?.length <= 1 && categoriesStep <= 0) return;

    if (paymentStep === EPaymentStep.InsertAbonent) {
      setState({
        paymentStep: paymentStep - (merchants && merchants?.length > 0 ? 1 : 2),
      });
      return;
    } else if (paymentStep > 0) {
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
            let refreshObject = {};
            if (merchants && merchants.length > 0) {
              refreshObject = {merchants: [...merchantsCopy()]};
            } else {
              refreshObject = {categories: [...categoriesCopy()]};
            }
            setState({
              paymentDetails: Response.data.data,
              categoriesLoading: false,
              paymentStep: EPaymentStep.InsertAbonent,
              ...refreshObject,
            });
          }
        },
        error: () => setState({categoriesLoading: false}),
      });
    });
  };
  const categoriesCopy = function () {
    return [
      ...categories.map(category => {
        return category.map(category => {
          category.isLoading = false;
          return category;
        });
      }),
    ];
  };
  const merchantsCopy = function () {
    return [
      ...(merchants || []).map(merchant => {
        merchant.isLoading = false;
        return merchant;
      }),
    ];
  };
  const GetMerchantServices = (data: IMerchantServicesForTemplateRequest) => {
    NetworkService.CheckConnection(() => {
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
              categories: categoriesCopy(),
            });
          }
        },
        error: () => {
          setState({categoriesLoading: false, categories: categoriesCopy()});
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
            let paymentCategories =
              categories.length > 0
                ? Response.data.data.categories.splice(1)
                : Response.data.data.categories;

            if (!isUserVerified) {
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
                categories: [...categoriesCopy(), filtered],
                categoriesLoading: false,
                categoriesStep: categoriesStep + 1,
              });
            } else {
              setState({
                refreshing: false,
                categories: [...categoriesCopy(), paymentCategories],
                categoriesLoading: false,
                categoriesStep: categoriesStep + 1,
              });
            }

            onCategoriesComplate();
          } else {
            setState({categories: categoriesCopy()});
          }
        },
        error: () => {
          setState({categoriesLoading: false, categories: categoriesCopy()});
          onCategoriesComplate();
        },
      });
    });
  };
  const getCategories = (item?: ICategory | IService) => {
    if (categoriesLoading) {
      return;
    }

    const parentID = item?.categoryID;
    const isService = item?.isService;
    const hasService = item?.hasServices;
    const hasChildren = item?.hasChildren;
    const categoryTitle = item?.name;

    let catIndex: number | undefined = 0;

    if (merchants && merchants?.length > 0) {
      catIndex = merchants?.findIndex(c => c.name === item?.name);
      if (catIndex >= 0 && merchants !== undefined) {
        merchants[catIndex].isLoading = true;
        setState({categoriesLoading: true, merchants: [...merchants]});
      }
    } else {
      catIndex = categories?.[categoriesStep - 1]?.findIndex(
        c => c.name === item?.name,
      );
      if (catIndex >= 0) {
        categories[categoriesStep - 1][catIndex].isLoading = true;
        setState({categoriesLoading: true, categories: [...categories]});
      } else {
        setState({categoriesLoading: true});
      }
    }

    if (isService && hasService && !hasChildren) {
      let currentService: ICategory[] | IService[] | undefined,
        merchantCode,
        merchantServiceCode;

      currentService = categories[categoriesStep - 1].filter(
        c => c.name === categoryTitle,
      );

      if (!currentService || !currentService.length) {
        //from the search
        //currentService = services?.filter(s => s.categoryID === parentID);
        currentService = merchants?.filter(s => s.name === categoryTitle);
        merchantCode = services?.[0]?.merchantCode;
        merchantServiceCode = services?.[0]?.merchantServiceCode;
      } else {
        merchantCode = currentService[0].merchantCode;
        merchantServiceCode = currentService[0].merchantServiceCode;
      }
      console.log('***', currentService);
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

  const modalVisible = categoriesStep > 1 || paymentStep > 0;
  console.log(
    paymentStep,
    categories.length,
    merchants?.length,
    Math.ceil(categories?.[0]?.length % 3),
    categories?.[0]?.length / 3,
  );

  const closeModal = () => {
    setState({
      categoriesStep: 1,
      paymentStep: 0,
      categories: [...categories.splice(0, 1)],
      merchants: [],
    });
  };

  const handleOnScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setPageIndes(
        parseInt(
          Math.ceil(
            e.nativeEvent.contentOffset.x / Dimensions.get('window').width,
          ).toString(),
        ),
      );
    },
    [pageIndex],
  );

  let paymentFlowView: JSX.Element | null = null;

  if (paymentStep === EPaymentStep.InsertAbonent) {
    paymentFlowView = <InsertAbonent details={service} />;
  } else if (paymentStep === EPaymentStep.InsertAmount) {
    paymentFlowView = <InsertAmount />;
  } else if (paymentStep === EPaymentStep.PaymentLastViews) {
    if (paymentCurrentView === EPaymentCurrentView.otp)
      paymentFlowView = <PaymentOtp />;
    else if (paymentCurrentView === EPaymentCurrentView.succes)
      paymentFlowView = <PaymentSucces />;
    else if (paymentCurrentView === EPaymentCurrentView.setTemplate)
      paymentFlowView = <SaveAsTemplate />;
  } else if (paymentStep === EPaymentStep.PaymentSucces) {
    paymentFlowView = <PaymentSucces />;
  }

  const generalCategories = useMemo(() => {
    if (gridVariant === gridStyle.verticallScroll) {
      const accesPayentCategories = categories?.[0]?.filter(
        category => !category.cannotPay,
      );
      const perPage = 3;
      const multipleOfThree =
        accesPayentCategories?.length % perPage === perPage
          ? perPage - (accesPayentCategories?.length % perPage)
          : accesPayentCategories?.length % perPage;
      const pageNumer = Math.ceil(accesPayentCategories?.length / perPage);

      return (
        <>
          <View style={styles.generalCategoriesHeader}>
            <Text style={styles.generalcategoriesTitle}>{title}</Text>
            {pageNumer !== undefined && pageNumer > 0 && (
              <PaginationDots step={pageIndex} length={pageNumer} />
            )}
          </View>
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            onScroll={handleOnScroll}
            showsHorizontalScrollIndicator={false}>
            {categoriesLoading && !categories ? (
              <ActivityIndicator
                size={'small'}
                color={colors.primary}
                style={styles.generalCategoriesLoader}
              />
            ) : (
              accesPayentCategories !== undefined && [
                accesPayentCategories?.map(current => (
                  <Item
                    {...current}
                    numberOfLines={3}
                    onPress={getCategories}
                    itemStyle={styles.verticallItem}
                    imageBoxStyle={styles.itemImageBox}
                    textStyle={styles.title}
                  />
                )),
                Array.from({length: multipleOfThree}).map((_, i) => (
                  <View key={i} style={styles.verticallItem} />
                )),
              ]
            )}
          </ScrollView>
        </>
      );
    } else if (gridVariant === gridStyle.list) {
      return (
        <View style={[styles.generalCategoriesList]}>
          {categoriesLoading && !categories ? (
            <ActivityIndicator
              size={'small'}
              color={colors.primary}
              style={styles.generalCategoriesLoader}
            />
          ) : (
            categories !== undefined &&
            categories?.[0]?.map(current => (
              <Item {...current} onPress={getCategories} />
            ))
          )}
        </View>
      );
    } else if (gridVariant === gridStyle.twoColumn) {
      return (
        <>
          <View style={styles.generalCategoriesHeader}>
            <Text style={styles.generalcategoriesTitle}>{title}</Text>
            <TouchableOpacity style={styles.searchBox}>
              <Image
                source={require('./../../assets/images/search-18x18.png')}
                style={styles.searchIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.generalCategoriesTwoColumn]}>
            {categoriesLoading && categories?.length <= 0 ? (
              <ActivityIndicator
                size={'small'}
                color={colors.primary}
                style={styles.generalCategoriesLoader}
              />
            ) : (
              categories !== undefined &&
              categories?.[0]?.map(current => (
                <Item
                  {...current}
                  onPress={getCategories}
                  numberOfLines={2}
                  itemStyle={styles.generalCategoriesTwoColumnItem}
                  imageBoxStyle={styles.itemImageBox}
                  textStyle={styles.title}
                />
              ))
            )}
          </View>
        </>
      );
    }
  }, [categories, getCategories, gridVariant]);

  const categoryMerchantsTree = useMemo(() => {
    return (
      <View style={styles.categoriesView}>
        {!merchants || merchants?.length <= 0 ? (
          <Categories
            categories={categories?.[categoriesStep - 1]}
            getCategories={getCategories}
          />
        ) : (
          <Merchants merchants={merchants} getCategories={getCategories} />
        )}
      </View>
    );
  }, [categories, getCategories, merchants, categoriesStep]);

  return (
    <>
      {generalCategories}
      <SwipableModal closeAction={goBack} visible={modalVisible}>
        <View style={styles.modalHeader}>
          <TouchableOpacity style={styles.modalHeaderItemBack} onPress={goBack}>
            <View style={styles.modalHeaderBackView}>
              <Image
                source={require('./../../assets/images/back-arrow-primary.png')}
              />
              <Text style={styles.modalHeaderBackText}>
                {translate.t('common.back')}
              </Text>
            </View>
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.modalHeaderText}>
            {translate.t('tabNavigation.payments')}
          </Text>
          <TouchableOpacity
            style={styles.modalHeaderItemClose}
            onPress={closeModal}>
            <Image
              source={require('./../../assets/images/close40x40.png')}
              style={styles.modalHeaderClose}
            />
          </TouchableOpacity>
        </View>
        {paymentStep >= EPaymentStep.InsertAbonent
          ? paymentFlowView
          : categoryMerchantsTree}
      </SwipableModal>
    </>
  );
};

export default CategoryContainer;

const styles = StyleSheet.create({
  categoriesView: {
    marginTop: 10,
    flex: 1,
    backgroundColor: colors.white,
  },
  generalCategoriesList: {
    flex: 1,
  },
  generalCategoriesTwoColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  generalCategoriesTwoColumnItem: {
    width: '50%',
    flexDirection: 'column',
    marginVertical: 0,
    justifyContent: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 10,
  },
  verticallItem: {
    flexDirection: 'column',
    width: Dimensions.get('window').width / 3,
    marginVertical: 0,
    justifyContent: 'flex-start',
  },
  itemImageBox: {
    marginRight: 0,
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
  },
  generalCategoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  generalcategoriesTitle: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 16,
    lineHeight: 25,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: headerHeight,
    paddingHorizontal: 17,
  },
  modalHeaderItemBack: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderItemClose: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderBackView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderBackText: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    marginLeft: 7,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  modalHeaderClose: {
    width: 32,
    height: 32,
  },
  modalHeaderText: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    paddingHorizontal: 15,
  },
  searchBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 30,
    height: 30,
  },
  generalCategoriesLoader: {
    alignSelf: 'center',
    flex: 1,
  },
});
