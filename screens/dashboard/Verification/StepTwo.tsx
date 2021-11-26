import {RouteProp, useRoute} from '@react-navigation/core';
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
import AppInput from '../../../components/UI/AppInput';
import AppSelect, {
  SelectItem,
} from '../../../components/UI/AppSelect/AppSelect';
import Validation, {required} from '../../../components/UI/Validation';
import colors from '../../../constants/colors';
import userStatuses from '../../../constants/userStatuses';
import Routes from '../../../navigation/routes';
import { tabHeight } from '../../../navigation/TabNav';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import {IKCData} from '../../../services/KvalificaServices';
import NavigationService from '../../../services/NavigationService';
import {ICitizenshipCountry} from '../../../services/PresentationServive';
import UserService, {
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
  };
};

const skipEmployeStatuses = ['UnEmployed', 'Retired'];
const ValidationContext = 'Verification2';

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

const StepTwo: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedEmploymentStatus, setSlectedEmploymentStatus] =
    useState<IStatus>();
  const [selectedJobType, setSelectedJobType] = useState<IType2>();
  const [complimentary, setComplimentary] = useState<string>();
  const [occupiedPosition, setOccupiedPosition] = useState<string>();

  const [customerExpectedTurnoverTypes, setCustomerExpectedTurnoverTypes] =
    useState<IExpectedType[] | undefined>();
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const [employmentStatusErrorStyle, setEmploymentStatusErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [jobTypeErrorStyle, setJobTypeErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [jobStatusVisible, setJobStatusVisible] = useState(false);
  const [jobTypeVisible, setJobTypesVisible] = useState(false);

  const stepThreeScreenAction = () => {
    if (!selectedEmploymentStatus) {
      setEmploymentStatusErrorStyle({ borderColor: colors.danger, borderWidth: 1 });
      return;
  } else {
      setEmploymentStatusErrorStyle({});
  }

  if (!selectedJobType && !skipFields) {
      setJobTypeErrorStyle({ borderColor: colors.danger, borderWidth: 1 });
      return;
  } else {
      setJobTypeErrorStyle({});
  }

  if (Validation.validate(ValidationContext) && !skipFields) {
      return;
  }
    getCustomerExpectedTurnoverTypes();
  };

  const getCustomerExpectedTurnoverTypes = () => {

    setIsLoading(true);
    UserService.GetCustomerExpectedTurnoverTypes().subscribe({
      next: Response => {
        setCustomerExpectedTurnoverTypes(Response.data.data?.types);
      },
      complete: () => {
        setIsLoading(false);
        NavigationService.navigate(Routes.verificationStepThree, {
          customerExpectedTurnoverTypes,
          selectedEmploymentStatus,
          selectedJobType,
          complimentary,
          occupiedPosition,
          country: route.params.country,
          city: route.params.city,
          address: route.params.address,
          postCode: route.params.postCode,
          employmentStatuses: route.params.employmentStatuses,
          customerWorkTypes: route.params.customerWorkTypes,
        });
      },
      error: () => {
        setIsLoading(false);
      },
    });
  };

  const {documentVerificationStatusCode} = userData.userDetails || {};

  useEffect(() => {
    if (
      documentVerificationStatusCode === userStatuses.Enum_PartiallyProcessed
    ) {
      //setVerificationStep(VERIFICATION_STEPS.step_four);
    }
  }, [documentVerificationStatusCode]);

  const skipFields = skipEmployeStatuses.some(
    employ => selectedEmploymentStatus?.employmentStatusCode === employ,
  );

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.content}>
       <View>
       <StepsContent
            currentStep={2}
            stepArray={Array.from(Array(verificationStepCount).keys())}
          />
          <View>
            <View style={styles.container}>
              <View style={styles.sectionContainer}>
                <Text style={styles.BoxTitle}>მიუთითეთ საქმიანობის სფერო</Text>
                <View style={[styles.sectionBox, employmentStatusErrorStyle]}>
                  {selectedEmploymentStatus ? (
                    <SelectItem
                      itemKey="employmentStatus"
                      defaultTitle="დასაქმებული"
                      item={selectedEmploymentStatus}
                      onItemSelect={() => setJobStatusVisible(true)}
                      style={styles.typeItem}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => setJobStatusVisible(true)}
                      style={[styles.typeSelectHandler]}>
                      <Text style={styles.typePlaceholder}>დასაქმებული</Text>
                      <Image
                        style={styles.dropImg}
                        source={require('./../../../assets/images/down-arrow.png')}
                      />
                    </TouchableOpacity>
                  )}

                  <AppSelect
                    itemKey="employmentStatus"
                    elements={route.params.employmentStatuses}
                    selectedItem={selectedEmploymentStatus}
                    itemVisible={jobStatusVisible}
                    onSelect={item => {
                      setSlectedEmploymentStatus(item);
                      setJobStatusVisible(false);
                    }}
                    onToggle={() => setJobStatusVisible(!jobStatusVisible)}
                  />
                </View>

                {!skipFields && (
                  <>
                    <View
                      style={[
                        styles.sectionBox,
                        styles.input,
                        jobTypeErrorStyle,
                      ]}>
                      {selectedJobType ? (
                        <SelectItem
                          itemKey="customerEmploymentType"
                          defaultTitle="აირჩიეთ საქმიანობის სფერო"
                          item={selectedJobType}
                          onItemSelect={() => setJobTypesVisible(true)}
                          style={styles.typeItem}
                        />
                      ) : (
                        <TouchableOpacity
                          onPress={() => setJobTypesVisible(true)}
                          style={[styles.typeSelectHandler]}>
                          <Text style={styles.typePlaceholder}>
                            აირჩიეთ საქმიანობის სფერო
                          </Text>
                          <Image
                            style={styles.dropImg}
                            source={require('./../../../assets/images/down-arrow.png')}
                          />
                        </TouchableOpacity>
                      )}

                      <AppSelect
                        itemKey="customerEmploymentType"
                        elements={route.params.customerWorkTypes}
                        selectedItem={selectedJobType}
                        itemVisible={jobTypeVisible}
                        onSelect={item => {
                          setSelectedJobType(item);
                          setJobTypesVisible(false);
                        }}
                        onToggle={() => setJobTypesVisible(!jobTypeVisible)}
                      />
                    </View>

                    <AppInput
                      placeholder="დამსაქმებელი"
                      onChange={complimentary =>
                        setComplimentary(complimentary)
                      }
                      value={complimentary}
                      customKey="complimentary"
                      requireds={[required]}
                      style={styles.input}
                      context={ValidationContext}
                    />

                    <AppInput
                      placeholder="დაკავებული თანამდებობა"
                      onChange={occupiedPosition =>
                        setOccupiedPosition(occupiedPosition)
                      }
                      value={occupiedPosition}
                      customKey="occupiedPosition"
                      requireds={[required]}
                      style={styles.input}
                      context={ValidationContext}
                    />
                  </>
                )}
              </View>

             
            </View>
          </View>
       </View>

          <AppButton
                isLoading={isLoading}
                title={'შემდეგი'}
                onPress={stepThreeScreenAction}
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
    paddingHorizontal: 20
  },
  content: {
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: tabHeight + 40
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
});

export default StepTwo;
