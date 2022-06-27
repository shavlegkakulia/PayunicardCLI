import React, {useRef} from 'react';
import {
    Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import NetworkService from '../../../services/NetworkService';
import PresenationService, {
  ICategory,
  IService,
} from '../../../services/PresentationServive';
import AppInput, {InputTypes} from '../../UI/AppInput';
import Categories from '../categories/Categories';
import {IPaymentStates} from '../CategoryContainer';

interface IServiceSearchProps {
  getState: React.Dispatch<Partial<IPaymentStates>>;
  onGetCategories: (item: ICategory | IService) => void;
  services?: IService[];
}

const SearchServices: React.FC<IServiceSearchProps> = ({
  getState,
  onGetCategories,
  services,
}) => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const searchTypeDelay = useRef<NodeJS.Timeout>();
  const onSearch = (value: string) => {
    if (searchTypeDelay.current) clearTimeout(searchTypeDelay.current);

    searchTypeDelay.current = setTimeout(() => {
      NetworkService.CheckConnection(() => {
        PresenationService.SearchMerchants(value).subscribe({
          next: Response => {
            if (Response.data.ok) {
              getState({services: Response.data.data?.services});
            }
          },
        });
      });
    }, 1500);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.searchInputBox}>
            <AppInput
              customKey="search"
              context=""
              placeholder={translate.t('common.search')}
              type={InputTypes.search}
              onChange={onSearch}
            />
          </View>
          <View style={styles.list}>
            <Categories
              categories={services}
              getCategories={data => {
                const serviceDara = {
                  ...data,
                  parentID: data?.categoryID,
                  isService: true,
                  hasServices: true,
                  hasChildren: false,
                  name: data.resourceValue,
                };

                onGetCategories(serviceDara);
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SearchServices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInputBox: {
    paddingHorizontal: 17,
    marginTop: 18,
  },
  list: {
    marginTop: 30,
    flex: 1,
  },
});
