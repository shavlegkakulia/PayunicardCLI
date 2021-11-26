import React, {useState} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import AppButton from '../../../components/UI/AppButton';
import colors from '../../../constants/colors';
import Routes from '../../../navigation/routes';
import PresentationServive from '../../../services/PresentationServive';
import NavigationService from './../../../services/NavigationService';

const Verification: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const welcomeScreenAction = (action: number) => {
    if (action === 0) {
      getCitizenshipCountries();
    }
  };

  const getCitizenshipCountries = () => {
    if (isLoading) return;

    setIsLoading(true);
    PresentationServive.GetCitizenshipCountries().subscribe({
      next: Response => {
        if(Response.data.ok) {
          setIsLoading(false);
          NavigationService.navigate(Routes.verificationStepOne, {
            countryes: [...(Response.data.data?.countries || [])]
          });
        }
      },
      error: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.cover}
            source={require('./../../../assets/images/verification_screen_1.png')}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.title}>მესამე პირის წარმომადგენელი ხართ?</Text>
          <Text style={styles.desc}>
            მინდობილობის საფუძველზე შესაძლებელია მესამე პირისთის უნისაფულის
            გახსნა
          </Text>

          <View style={styles.inputsGroup}>
            <AppButton
              title="არა"
              onPress={() => welcomeScreenAction(0)}
              backgroundColor={colors.inputBackGround}
              color={colors.black}
              loaderColor={colors.black}
              style={styles.button}
              isLoading={isLoading}
            />
            <AppButton
              title="დიახ"
              disabled={isLoading}
              onPress={() => welcomeScreenAction(1)}
              backgroundColor={colors.inputBackGround}
              color={colors.black}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-around',
    paddingVertical: 30,
    backgroundColor: colors.white,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  cover: {
    width: 230,
    height: 260,
  },
  wrapper: {
    maxWidth: 327,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    lineHeight: 29,
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'FiraGO-Medium',
    marginTop: 70,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.placeholderColor,
    alignSelf: 'center',
    fontFamily: 'FiraGO-Medium',
    marginTop: 17,
    textAlign: 'center',
  },
  inputsGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 50,
  },
  button: {
    paddingHorizontal: 50,
  },
});

export default Verification;
