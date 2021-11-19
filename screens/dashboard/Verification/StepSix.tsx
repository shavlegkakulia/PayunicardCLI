import React, { useState } from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import AppButton from '../../../components/UI/AppButton';
import AppCheckbox from '../../../components/UI/AppCheckbox';
import colors from '../../../constants/colors';

interface IProps {
  loading: boolean;
  onComplate: () => void;
}

const StepSix: React.FC<IProps> = props => {
  const [accepted, setAccepted] = useState<boolean>(false);

  const nextHandler = () => {
    props.onComplate();
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.cover}
            source={require('./../../../assets/images/ICON.png')}
            resizeMode={'contain'}
          />
        </View>
        <Text style={styles.title}>
          უსაფრთხოებისთვის აუცილებელია დაადასტუროთ, რომ განაცხადის შევსები პირი
          ნამდვილად თქვენ ხართ
        </Text>

        <View style={styles.block}>
          <Image
            style={styles.blockImg}
            source={require('./../../../assets/images/home_active.png')}
            resizeMode={'contain'}
          />
          <Text style={styles.labelText}>ვიზუალური იდენტიფიკაცია</Text>
        </View>

        <View style={styles.block}>
          <Image
            style={styles.blockImg}
            source={require('./../../../assets/images/home_active.png')}
            resizeMode={'contain'}
          />
          <Text style={styles.labelText}>
            2. პირადობის მოწმობის ან პასპორტის სკანირება
          </Text>
        </View>

        <View style={styles.block}>
          <Image
            style={styles.blockImg}
            source={require('./../../../assets/images/home_active.png')}
            resizeMode={'contain'}
          />
          <Text style={styles.labelText}>
            2. პროცედურის გასავლელად აუცილებელია ვებ-კამერა
          </Text>
        </View>

        <View>
            <AppCheckbox style={styles.checkbox} activeColor={colors.primary} label='ვეთახმები წესებს და პირობებს' clicked={() => setAccepted(!accepted)} value={accepted} key={'accept'} customKey='accept' context='verification' />
            <Text style={styles.description}>წინამდებარე თანხმობით ვადასტურებ, რომ კომპანია (როგორც უშუალოდ ასევე უფლებამოსილი პირის მეშვეობით), მომსახურების მიღების მიზნით, უფლებამოსილია მიიღოს და დაამუშავოს ჩემი პერსონალური მონაცემები, მათ შორის ბიომეტრიული მონაცემი, მიღებული დისტანციური იდენტიფიცირებისას ჩემის სახის, ჩემი პირადობის მოწმობის ან საიდენტიფიკაციო დოკუმენტის ფოტო გადაღების/ვიდეო ჩანაწერის გაკეთების დროს, ასევე მიიღოს და დაამუშავოს აღნიშნულ დოკუმენტებში არსებული პერსონალური მონაცემები და შეამოწმოს აღნიშნული მონაცემების სიზუსტე.ჩემთვის ასევე ცნობილია და ვეთანხმები, რომ ჩემი ბიომეტრიული მონაცემების დამუშავება ხდება მხოლოდ იმ ვადით რა ვადაც აუცილებელის იდენტიფიცირების პროცესის დასრულებისთვის. არ ხდება კომპანიის მიერ და მათი წაშლა ხორციელდება იდენტიფიცირების პროცესის დასრულებისთანავე, ხოლო სხვა მონაცემების შენახვა კომპანია ახორციელებს კომპანიის სტანდარტული ხელშეკრულების პირობების შესაბამისად.აქვე ვადასტურებ რომ, იდენტიფიცირების მიზნით, ჩემს მიერ მოწოდებული ყველა პერსონალური მონაცემი იქნება უტყუარი და ზუსტი, ხოლო წარდგენილი დოკუმენტი მოქმედი და ნამდვილი.</Text>
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
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  block: {
    paddingHorizontal: 23,
    paddingVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  blockImg: {
    width: 40,
    height: 40,
  },
  cover: {
    height: 41,
  },
  wrapper: {
    maxWidth: 327,
    alignSelf: 'center',
  },
  labelText: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    fontFamily: 'FiraGO-Regular',
    marginLeft: 10,
  },
  title: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.primary,
    alignSelf: 'center',
    fontFamily: 'FiraGO-Bold',
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 80,
  },
  description: {
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
    fontFamily: 'FiraGO-Regular',
    paddingLeft: 34
  },
  button: {
    marginTop: 50,
    width: '100%',
    maxWidth: 327,
    alignSelf: 'center',
  },
  checkbox: {
    alignSelf: 'flex-start', 
    marginBottom: 17
  }
});

export default StepSix;
