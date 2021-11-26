import {RouteProp, useRoute} from '@react-navigation/core';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Text,
} from 'react-native';
import AppButton from '../../../components/UI/AppButton';
import colors from '../../../constants/colors';
import Routes from '../../../navigation/routes';
import {tabHeight} from '../../../navigation/TabNav';
import KvalificaServices, { getKycFullYear, IKCData } from '../../../services/KvalificaServices';
import NavigationService from '../../../services/NavigationService';
import {ICitizenshipCountry} from '../../../services/PresentationServive';
import { IExpectedType, IStatus, IType2 } from '../../../services/UserService';
import { getString } from '../../../utils/Converter';
import StepsContent from './StepContent';
import { ITransactionCategoryInterface } from './StepThree';

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
    customerExpectedTurnoverType: IExpectedType | undefined;
    transactionCategories: ITransactionCategoryInterface[];
    anotherTransactionCategory: string;
  };
};

const verificationStepCount = 9;

const StepFour: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userKYCData, setUserKYCData] = useState<IKCData | undefined>();

  const parseAndSetKCdata = (data: IKCData | undefined) => {
    const {
      birthDate,
      countryID,
      documentBackSide,
      documentFrontSide,
      documentNumber,
      documetType,
      firstName,
      lastName,
      personalNumber,
      selfImages,
      sex,
    } = data || {};

    setUserKYCData({
      customerSelfContent: 'Selfie',
      customerSelfName: selfImages?.[0].split('/')[4],
      customerSelf: selfImages?.[0],
      documetType: documetType,
      documentBackSideContent: 'Back',
      documentBackSide: documentBackSide,
      documentBackSideName: documentBackSide?.split('/')[4],
      documentFrontSideContent: 'Front',
      documentFrontSide: documentFrontSide,
      documentFrontSideName: documentFrontSide?.split('/')[4],
      firstName,
      lastName,
      birthCityId: 0,
      countryID,
      sex: sex,
      birthDate: getKycFullYear(getString(birthDate)),
      personalNumber,
      documentNumber,
    });
  };

  const getKycSessionData = () => {
    KvalificaServices.GetKycSessionData().subscribe({
      next: Response => {
        parseAndSetKCdata(Response.data?.data?.data?.[0]);
      },
      complete: () => {
        NavigationService.navigate(Routes.verificationStepSix, {

        });
      },
    });
  };

  const checkKycSession = () => {
    setIsLoading(true);
    KvalificaServices.CheckKycSession().subscribe({
      next: Response => {
        if (Response.data.ok) {
          if (Response.data.data?.skipKycSession) {
            getKycSessionData();
          } else {
            NavigationService.navigate(Routes.verificationStepFive, {

            });
          }
        }
      },
      complete: () => {
        setIsLoading(false);
      },
      error: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View>
            <StepsContent
              currentStep={1}
              stepArray={Array.from(Array(verificationStepCount).keys())}
            />
            <View>
              <View style={styles.container}>
                <View style={styles.wrapper}>
                  <Text style={styles.headerText}>
                    გთხოვთ, მოემზადოთ ვიზუალური იდენტიფიკაციისთის
                  </Text>
                </View>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.cover}
                    source={require('./../../../assets/images/LoginScreen_1.png')}
                    resizeMode={'contain'}
                  />
                </View>
                <View style={styles.wrapper}>
                  <Text style={styles.title}>
                    თქვენ დაგჭირდებათ ვებკამერა და პირადობის დამადასტურებელი
                    დოკუმენტი (პასპორტი ან პირადობის მოწმობა).
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <AppButton
            title={'შემდეგი'}
            onPress={checkKycSession}
            style={styles.button}
            isLoading={isLoading}
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
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  cover: {
    width: 230,
    height: 260,
  },
  wrapper: {
    maxWidth: 327,
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 24,
    lineHeight: 29,
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'FiraGO-Bold',
    marginTop: 0,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'FiraGO-Bold',
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 50,
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
  },
});

export default StepFour;
