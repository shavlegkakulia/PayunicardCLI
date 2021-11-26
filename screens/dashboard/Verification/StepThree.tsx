import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useSelector} from 'react-redux';
import AppButton from '../../../components/UI/AppButton';
import AppCheckbox from '../../../components/UI/AppCheckbox';
import AppInput from '../../../components/UI/AppInput';
import AppSelect, {
  SelectItem,
} from '../../../components/UI/AppSelect/AppSelect';
import Validation, {required} from '../../../components/UI/Validation';
import colors from '../../../constants/colors';
import userStatuses from '../../../constants/userStatuses';
import Routes from '../../../navigation/routes';
import {tabHeight} from '../../../navigation/TabNav';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import NavigationService from '../../../services/NavigationService';
import {ICitizenshipCountry} from '../../../services/PresentationServive';
import UserService, {
  ICustomerRegistrationNewRequest,
  IExpectedType,
  IStatus,
  IType2,
} from '../../../services/UserService';
import StepsContent from './StepContent';

type RouteParamList = {
  params: {
    country: ICitizenshipCountry;
    city: string;
    address: string;
    postCode: string;
    employmentStatuses: IStatus[] | undefined;
    customerWorkTypes: IType2[] | undefined;
    customerExpectedTurnoverTypes: IExpectedType[] | undefined;
    selectedEmploymentStatus: IStatus;
    selectedJobType: IType2;
    complimentary: string;
    occupiedPosition: string;
  };
};

const ValidationContext = 'Verification3';

export interface ITransactionCategoryInterface {
  id: number;
  value: string;
  active: boolean;
}

const TransactionCategories: ITransactionCategoryInterface[] = [
  {id: 1, value: 'კომუნალური და კომუნიკაციები', active: false},
  {id: 2, value: 'ტრანსპორტი', active: false},
  {id: 3, value: 'საერთაშორისო ტრანზაქციები', active: false},
  {id: 4, value: 'ტოტალიზატორი, აზარტული ონლაინ თამაშები', active: false},
  {id: 5, value: 'სხვა', active: false},
];

const verificationStepCount = 9;

const StepThree: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [expectedTurnoverErrorStyle, setExpectedTurnoverErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [expectedTurnoverVisible, setExpectedTurnoverVisible] = useState(false);

  const [customerExpectedTurnoverType, setCustomerExpectedTurnoverType] =
    useState<IExpectedType | undefined>();

  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategoryInterface[]
  >(TransactionCategories);
  const [anotherTransactionCategory, setAnotherTransactionCategory] =
    useState<string>();
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;

  const onToggletransactionCategoryActive = (
    category: ITransactionCategoryInterface,
  ) => {
    let _categoryes = [...transactionCategories];
    let categoryIndex = _categoryes.findIndex(
      transact => transact.value === category.value,
    );
    if (categoryIndex >= 0) {
      _categoryes[categoryIndex].active = !_categoryes[categoryIndex].active;
      setTransactionCategories(_ => [..._categoryes]);
    }
  };

  const onCustomerRegistration = () => {
    if (!customerExpectedTurnoverType) {
      setExpectedTurnoverErrorStyle({
        borderColor: colors.danger,
        borderWidth: 1,
      });
      return;
    } else {
      setExpectedTurnoverErrorStyle({});
    }

    if (Validation.validate(ValidationContext)) {
      return;
    }

    setIsLoading(true);

    const data: ICustomerRegistrationNewRequest = {
      isResident: route.params.country?.countryID == 79 ? true : false,
      factCountryID: route.params.country?.countryID,
      factCity: route.params.city,
      factCityID: 0,
      factAddress: route.params.address,
      factPostalCode: route.params.postCode,
      legalCountryID: route.params.country?.countryID,
      legalCity: route.params.city,
      legalCityID: 0,
      legalAddress: route.params.address,
      legalPostalCode: route.params.postCode,
      employmentStatusCode:
        route.params.selectedEmploymentStatus?.employmentStatusCode,
      employmentTypeCode:
        route.params.selectedEmploymentStatus?.employmentStatus,
      employer: route.params.complimentary,
      workPosition: route.params.occupiedPosition,
      expectedTurnoverCode: customerExpectedTurnoverType?.expectedTurnoverCode,
      hasUtility: transactionCategories.filter(c => c.id === 1)[0].active,
      hasTransport: transactionCategories.filter(c => c.id === 2)[0].active,
      hasTelecomunication: false,
      hasInternatiolalTransactions: transactionCategories.filter(
        c => c.id === 3,
      )[0].active,
      hasGambling: transactionCategories.filter(c => c.id === 4)[0].active,
      hasOther: transactionCategories.filter(c => c.id === 5)[0].active,
      otherDesctiption: anotherTransactionCategory,
      termID: 1,
    };
    console.log(data)
    UserService.CustomerRegistration(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          NavigationService.navigate(Routes.verificationStepFour, {
            country: route.params.country,
            city: route.params.city,
            address: route.params.address,
            postCode: route.params.postCode,
            employmentStatuses: route.params.employmentStatuses,
            customerWorkTypes: route.params.customerWorkTypes,
            customerExpectedTurnoverTypes:
              route.params.customerExpectedTurnoverTypes,
            selectedEmploymentStatus: route.params.selectedEmploymentStatus,
            selectedJobType: route.params.selectedJobType,
            complimentary: route.params.complimentary,
            occupiedPosition: route.params.occupiedPosition,
            customerExpectedTurnoverType,
            transactionCategories,
            anotherTransactionCategory
          });
        }
      },
      complete: () => setIsLoading(false),
      error: () => setIsLoading(false),
    });
  };

  // useEffect(() => {
  //   if (route.params.employmentStatuses && route.params.customerWorkTypes) {
  //     setIsLoading(false);
  //     NavigationService.navigate(Routes.verificationStepTwo);
  //   }
  // }, [route.params.employmentStatuses, route.params.customerWorkTypes]);

  const {documentVerificationStatusCode} = userData.userDetails || {};

  useEffect(() => {
    if (
      documentVerificationStatusCode === userStatuses.Enum_PartiallyProcessed
    ) {
      //setVerificationStep(VERIFICATION_STEPS.step_four);
    }
  }, [documentVerificationStatusCode]);

  let isAnotherSelected = transactionCategories.some(
    tc => tc.id === 5 && tc.active,
  ); //another

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View>
            <StepsContent
              currentStep={3}
              stepArray={Array.from(Array(verificationStepCount).keys())}
            />
            <View>
              <View style={styles.container}>
                <View style={styles.sectionContainer}>
                  <Text style={styles.BoxTitle}>
                    მონიშნეთ მოსალოდნელი ბრუნვა 1 წლის განმავლობაში
                  </Text>
                  <View style={[styles.sectionBox, expectedTurnoverErrorStyle]}>
                    {customerExpectedTurnoverType ? (
                      <SelectItem
                        itemKey="expectedTurnover"
                        defaultTitle="აირჩიეთ მოსალოდნელი ბრუნვა"
                        item={customerExpectedTurnoverType}
                        onItemSelect={() => setExpectedTurnoverVisible(true)}
                        style={styles.typeItem}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => setExpectedTurnoverVisible(true)}
                        style={[styles.typeSelectHandler]}>
                        <Text style={styles.typePlaceholder}>
                          აირჩიეთ მოსალოდნელი ბრუნვა
                        </Text>
                        <Image
                          style={styles.dropImg}
                          source={require('./../../../assets/images/down-arrow.png')}
                        />
                      </TouchableOpacity>
                    )}

                    <AppSelect
                      itemKey="expectedTurnover"
                      elements={route.params.customerExpectedTurnoverTypes}
                      selectedItem={customerExpectedTurnoverType}
                      itemVisible={expectedTurnoverVisible}
                      onSelect={item => {
                        setCustomerExpectedTurnoverType(item);
                        setExpectedTurnoverVisible(false);
                      }}
                      onToggle={() =>
                        setExpectedTurnoverVisible(!expectedTurnoverVisible)
                      }
                    />
                  </View>

                  <View style={styles.categories}>
                    <Text style={styles.BoxTitle}>
                      მონიშნეთ მოსალოდნელი ტრანზაქციების კატეგორიები
                    </Text>
                    {transactionCategories.map((category, index) => (
                      <View key={index} style={styles.categoryItem}>
                        <TouchableOpacity
                          onPress={() =>
                            onToggletransactionCategoryActive(category)
                          }
                          style={styles.touchArea}>
                          <AppCheckbox
                            label={category.value}
                            value={category.active}
                            customKey="activeCategory"
                            context={ValidationContext}
                            activeColor={colors.primary}
                            clicked={() =>
                              onToggletransactionCategoryActive(category)
                            }
                            style={styles.typeCheck}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {isAnotherSelected && (
                    <AppInput
                      placeholder="სხვა"
                      onChange={anotherTransactionCategory =>
                        setAnotherTransactionCategory(
                          anotherTransactionCategory,
                        )
                      }
                      value={anotherTransactionCategory}
                      customKey="anotherTransactionCategory"
                      requireds={[required]}
                      style={styles.input}
                      context={ValidationContext}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
          <AppButton
            isLoading={isLoading}
            title={'შემდეგი'}
            onPress={onCustomerRegistration}
            style={styles.button}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  content: {
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: tabHeight + 40,
  },
  sectionContainer: {
    marginTop: 40,
  },
  BoxTitle: {
    fontFamily: 'FiraGO-Bold',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    marginBottom: 15,
  },
  sectionBox: {
    backgroundColor: colors.inputBackGround,
    borderRadius: 7,
  },
  typeItem: {
    backgroundColor: colors.inputBackGround,
    borderRadius: 7,
  },
  dropImg: {
    marginRight: 12,
  },
  typeSelectHandler: {
    height: 54,
    backgroundColor: colors.inputBackGround,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typePlaceholder: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.placeholderColor,
    marginLeft: 13,
  },
  input: {
    marginTop: 20,
  },
  button: {
    marginTop: 30,
  },
  touchArea: {},
  typeCheck: {
    paddingVertical: 7,
  },
  categories: {
    marginTop: 20,
    justifyContent: 'flex-start',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default StepThree;
