import React, {useState} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import AppButton from '../../../components/UI/AppButton';
import AppCheckbox from '../../../components/UI/AppCheckbox';
import colors from '../../../constants/colors';
import { IKCData } from '../../../services/KvalificaServices';

interface IProps {
  kycData: IKCData | undefined;
  loading: boolean;
  onComplate: () => void;
}

const StepNine: React.FC<IProps> = props => {
  const [accepted, setAccepted] = useState<boolean>(false);

  const nextHandler = () => {
    props.onComplate();
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>გადაამოწმეთ პირადი{'\n'}ინფორმაცია</Text>

        <View style={styles.block}>
          <Text style={styles.labelText}>დოკუმენტის ტიპი:</Text>
          <Text style={styles.labelValue}>{props.kycData?.documetType === 'ID' ? 'პირადობის მოწმობა' : 'პასპორტი'}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.labelText}>{props.kycData?.documetType === 'ID' ? 'პირადი ნომერი:' : 'პასპორტის ნომერი:'}</Text>
          <Text style={styles.labelValue}>{props.kycData?.personalNumber || props.kycData?.documentNumber}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.labelText}>დსახელი, გვარი:</Text>
          <Text style={styles.labelValue}>{props.kycData?.firstName} {props.kycData?.lastName}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.labelText}>დაბადების წელი:</Text>
          <Text style={styles.labelValue}>{props.kycData?.birthDate}</Text>
        </View>

        <Text style={[styles.title, styles.title2]}>ატვირთე დოკუმენტები</Text>

        <View style={styles.imgContainer}>
          <Image
            style={styles.cover}
            source={{uri: props.kycData?.customerSelf}}
            resizeMode={'contain'}
          />

          <Image
            style={styles.cover}
            source={{uri: props.kycData?.documentFrontSide}}
            resizeMode={'contain'}
          />

          {props.kycData?.documentBackSide && <Image
            style={styles.cover}
            source={{uri: props.kycData?.documentBackSide}}
            resizeMode={'contain'}
          />}
        </View>

        <View>
          <AppCheckbox
            style={styles.checkbox}
            activeColor={colors.primary}
            label="ვეთახმები ფეიუნიქარდი მომსახურებით სარგებლობის პირობებს და
            ფეიუნიქარდის სარგებლობის პირობებს"
            clicked={() => setAccepted(!accepted)}
            value={accepted}
            key={'accept'}
            customKey="accept"
            context="verification"
          />
        </View>
      </View>

      <AppButton
        isLoading={props.loading}
        disabled={!accepted}
        title={'დაწყება'}
        onPress={nextHandler}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    paddingBottom: 30,
  },
  block: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
  },
  imgContainer: {
    marginTop: 20,
    marginBottom: 30
  },
  cover: {
    marginVertical: 5,
    height: 150
  },
  wrapper: {
    maxWidth: 327,
    alignSelf: 'center',
  },
  labelText: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    fontFamily: 'FiraGO-Bold',
    textAlign: 'center',
  },
  labelValue: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    fontFamily: 'FiraGO-Regular',
    textAlign: 'center',
    marginTop: 5,
  },
  title: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'FiraGO-Bold',
    marginTop: 40,
    textAlign: 'center',
    marginBottom: 22,
  },
  title2: {
    marginTop: 0,
  },
  button: {
    marginTop: 50,
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
  },
  checkbox: {
    alignSelf: 'flex-start',
    marginBottom: 17,
  },
});

export default StepNine;
