import React, {useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../../../constants/colors';
import {getString} from '../../../utils/Converter';
import Validation from '../Validation';

interface GenericSelectProps<TValue> {
  values?: TValue[];
  value?: TValue;
  onChange: (value: TValue) => void;
  Item: React.FC<TValue | any>;
  activeItemStyle?: StyleProp<ViewStyle>;
  customKey?: string;
  context?: string;
  requireds?: Array<string>;
}

export const Select = <TValue extends Object>({
  values,
  value,
  onChange,
  Item,
  activeItemStyle,
  customKey,
  context,
  requireds,
}: GenericSelectProps<TValue>) => {
  const [visible, setVisible] = useState(false);

  const [style, setStyle] = useState<ViewStyle>({
    borderColor: colors.none,
    borderWidth: 0,
  });

  useEffect(() => {
    Validation.push(customKey, getString(context))(
      [...(requireds || [])],
      (s: boolean) => restyle(s),
      JSON.stringify(value),
    );

    return () => {
      if (customKey) Validation.delete(customKey);
    };
  }, [value]);

  const restyle = (result: boolean) => {
    setStyle({
      borderWidth: result ? 0 : 1,
      borderColor: result ? colors.none : colors.danger,
    });
    return result;
  };

  const onSelectChange = (e: TValue) => {
    const val = values?.find(value => {
      return JSON.stringify(value) === JSON.stringify(e);
    });
    setVisible(!visible);
    if (val) onChange(val);
  };

  const activeItem = useMemo(() => {
    return value ? (
      <TouchableOpacity onPress={() => setVisible(!visible)}>
        <Item {...value} activeItemStyle={activeItemStyle} />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => setVisible(!visible)}>
        <Item activeItemStyle={[activeItemStyle, style]} />
      </TouchableOpacity>
    );
  }, [value, style]);

  const scrollStyle: ViewStyle = {
    maxHeight: Dimensions.get('window').height - 200,
  };
  
  return (
    <>
      <Modal
        transparent={true}
        onRequestClose={() => setVisible(false)}
        visible={visible}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.background}
          onPress={() => setVisible(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalContent}>
              <ScrollView style={scrollStyle}>
                {values?.map((value, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => onSelectChange(value)}>
                    <Item {...value} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      {activeItem}
    </>
  );
};

export default Select;

const styles = StyleSheet.create({
  modalContent: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 30,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  background: {
    flex: 1,
    backgroundColor: '#00000098',
    ...StyleSheet.absoluteFillObject,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
