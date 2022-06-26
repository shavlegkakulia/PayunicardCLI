import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import {PUSH} from '../../../redux/actions/error_action';
import {
  ITranslateState,
  IGlobalState as ITranslate,
} from '../../../redux/action_types/translate_action_types';
import AppButton from '../../UI/AppButton';
import AppInput from '../../UI/AppInput';
import {IPaymentStates} from '../CategoryContainer';

export interface IPaySuccesPageProps {
  getState?: React.Dispatch<Partial<IPaymentStates>>;
  onSaveTemplate: () => void;
  onResetState: (cleanCats?: boolean) => void;
  createPayTemplate?: boolean;
  isTemplate?: boolean;
  templateName?: string;
  isLoading?: boolean;
  isTemplateCreated?: boolean;
}

const PaymentSucces: React.FC<IPaySuccesPageProps> = ({
  getState,
  onSaveTemplate,
  onResetState,
  isTemplateCreated,
  createPayTemplate,
  isTemplate,
  templateName,
  isLoading,
}) => {
  const translate = useSelector<ITranslate>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const dispatch = useDispatch();
  const [templateNameInputToggle, setTemplateNameInputToggle] =
    useState<boolean>((createPayTemplate !== undefined && createPayTemplate !== false));
  const templateToggle = () => {
    if(createPayTemplate) {
      return;
    }
    if (templateNameInputToggle) {
      getState?.({templateName: undefined});
    }
    setTemplateNameInputToggle(toggle => !toggle);
  };
  const complate = () => {
    if (
      !isTemplate &&
      templateNameInputToggle &&
      !isTemplateCreated
    ) {
      if (!templateName) {
        dispatch(PUSH('შეავსეთ შაბლონის სახელი'));
        return;
      }
      onSaveTemplate();
    } else {
      onResetState();
    }
  };
  let buttonText = translate.t('common.close');

  let succesText = translate.t('payments.paymentSuccessfull');
  if (createPayTemplate || isTemplateCreated) {
    succesText = translate.t('template.paymentTemplateSuccess');
  }
  if (
    !isTemplate &&
    templateNameInputToggle &&
    !isTemplateCreated
  ) {
      buttonText = translate.t('common.save');
  }
  let templateCreateContent: JSX.Element | undefined = undefined;
  if (!isTemplate && !isTemplateCreated) {
    templateCreateContent = (
      <View
        style={[
          styles.templaceView,
          templateNameInputToggle ? styles.templaceViewOpened : {},
        ]}>
        <TouchableOpacity onPress={templateToggle}>
          <Image
            source={require('./../../../assets/images/templateIcon.png')}
          />
        </TouchableOpacity>
        <AppButton
          backgroundColor={colors.none}
          color={colors.labelColor}
          title={translate.t('template.saveTemplate')}
          onPress={templateToggle}></AppButton>
        {templateNameInputToggle ? (
          <View>
            <AppInput
              autoFocus={true}
              value={templateName}
              onChange={value => {
                getState?.({templateName: value});
              }}
              context={''}
              placeholder={translate.t('template.templateName')}
              customKey="templateName"
              style={styles.templateNameInput}
            />
          </View>
        ) : null}
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}>
        <View style={styles.content}>
          <View style={styles.logo}>
            {!templateNameInputToggle || isTemplateCreated ? (
              <>
                <Image
                  source={require('./../../../assets/images/succes_icon.png')}
                  style={styles.succesImg}
                />
                <Text style={styles.succesText}>{succesText}</Text>
              </>
            ) : null}
            {templateCreateContent}
          </View>

          <AppButton
            isLoading={isLoading}
            onPress={complate}
            title={buttonText}
            style={styles.button}
            color={colors.black}
            backgroundColor={colors.inputBackGround}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PaymentSucces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 17,
    paddingTop: 20,
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  succesText: {
    textAlign: 'center',
    justifyContent: 'space-between',
    fontFamily: 'FiraGO-Medium',
    fontSize: 16,
    lineHeight: 19,
    color: colors.black,
    marginTop: 28,
  },
  succesImg: {
    marginTop: 40,
  },
  button: {
    marginVertical: 30,
  },
  templaceView: {
    alignItems: 'center',
    marginTop: 30,
  },
  templaceViewOpened: {
    marginTop: 0,
  },
  templateNameInput: {
    width: '100%',
    maxWidth: 300,
  },
});
