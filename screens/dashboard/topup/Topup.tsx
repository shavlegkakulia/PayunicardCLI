import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, ScrollView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Cover from '../../../components/Cover';
import AppButton from '../../../components/UI/AppButton';
import colors from '../../../constants/colors';
import Routes from '../../../navigation/routes';
import {tabHeight} from '../../../navigation/TabNav';
import NavigationService from '../../../services/NavigationService';
import UserService, {
  IGetUserBankCardsResponse,
} from '../../../services/UserService';
import screenStyles from '../../../styles/screens';
import {getNumber} from '../../../utils/Converter';

const TopupActionTypes = {
  topup: 'topup',
  addCard: 'addCard',
};

const Topup: React.FC = () => {
  const [actionType, setActionType] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userBankCards, setUserBankCards] = useState<
    IGetUserBankCardsResponse | undefined
  >();

  const next = () => {
    if (actionType === TopupActionTypes.topup) {
      getUserBankCards();
    } else {
      NavigationService.navigate(Routes.addBankCard);
    }
  };

  const getUserBankCards = () => {
    setIsLoading(true);
    UserService.GetUserBankCards().subscribe({
      next: Response => {
        setUserBankCards(Response.data.data);
      },
      complete: () => setIsLoading(false),
      error: () => {
        setIsLoading(false);
        NavigationService.navigate(Routes.TopupChooseAmountAndAccount);
      },
    });
  };

  useEffect(() => {
    if (userBankCards) {
      if (getNumber(userBankCards.bankCards?.length) <= 0) {
        NavigationService.navigate(Routes.TopupChooseAmountAndAccount);
      } else {
        NavigationService.navigate(Routes.TopupChoosBankCard, {
          cards: userBankCards,
        });
      }
    }
  }, [userBankCards]);

  return (
    <ScrollView contentContainerStyle={styles.avoid}>
      <View style={[screenStyles.wraper, styles.container]}>
        <View style={styles.content}>
          <View style={styles.touchables}>
            <TouchableOpacity
              style={styles.touchableItem}
              onPress={setActionType.bind(this, TopupActionTypes.topup)}>
              <Cover
                localImage={require('./../../../assets/images/icon-topup-card.png')}
                style={styles.touchableItemIcon}
                isLoading={isLoading}
              />
              <Text
                style={[
                  styles.touchableItemText,
                  actionType === TopupActionTypes.topup &&
                    styles.activeTouchableItemText,
                ]}>
                ბარათით შევსება
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.touchableItem}
              onPress={setActionType.bind(this, TopupActionTypes.addCard)}>
              <Image
                source={require('./../../../assets/images/icon-card-yellow.png')}
                style={styles.touchableItemIcon}
              />
              <Text
                style={[
                  styles.touchableItemText,
                  actionType === TopupActionTypes.addCard &&
                    styles.activeTouchableItemText,
                ]}>
                ბარათის დამატება
              </Text>
            </TouchableOpacity>
          </View>
          {actionType === TopupActionTypes.addCard && (
            <Text style={styles.actionInfoText}>
              <Text style={styles.redPoint}>*</Text> საბანკო ბარათის სისტემაში
              დამატების შემდეგ, შეგეძლებათ ბალანსი შეავსოთ თქვენი ბარათის
              მონაცემების მითითების გარეშე. გაითვალისწინეთ, რომ დამატებული
              საბანკო ბარათით შესაძლებელია მხოლოდ ბალანსის შევსების ოპერაცია.
              {'\n'}
              <Text style={styles.redPoint}>*</Text> „დამატება“ ღილაკზე დაჭერის
              შემდეგ, გადამისამართდებით ბანკის დაცულ გვერდზე, სადაც ერთჯერადად
              მიუთითებთ თქვენი ბარათის მონაცემებს. შედეგად, ანგარიშიდან
              ჩამოგეჭრებათ და დაგიბრუნდებათ 0.01 ლარი. ამ ოპერაციის წარმატებით
              განხორციელების შემდეგ, თქვენი ბარათი დაემატება PayUnicard
              სისტემაში, გვერდზე „ანგარიშები და ბარათები“.{'\n'}
              <Text style={styles.redPoint}>*</Text>
              PayUnicard.ge არ ინახავს თქვენი საბანკო ბარათის მონაცემებს.
              მონაცემები ინახება მხოლოდ საპროცესინგო სისტემებში, რომლებიც
              დაცულია უსაფრთხოების საერთაშორისო სტანდარტებით.
            </Text>
          )}
        </View>
        <AppButton
          isLoading={isLoading}
          style={styles.button}
          title="შემდეგ"
          onPress={next.bind(this)}
          disabled={actionType === undefined || isLoading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingBottom: tabHeight,
  },
  content: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  avoid: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  touchables: {
    marginBottom: 14,
  },
  touchableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  touchableItemIcon: {
    marginRight: 30,
  },
  touchableItemText: {
    fontFamily: 'FiraGO-Medium',
    lineHeight: 17,
    fontSize: 14,
    color: colors.labelColor,
  },
  redPoint: {
    color: colors.danger,
  },
  activeTouchableItemText: {
    color: colors.black,
  },
  actionInfoText: {
    fontFamily: 'FiraGO-Book',
    lineHeight: 17,
    fontSize: 14,
    color: colors.labelColor,
  },
  button: {
    marginVertical: 40,
  },
});

export default Topup;
