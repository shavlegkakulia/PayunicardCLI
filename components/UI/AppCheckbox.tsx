import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface IComponentProps {
  clicked: (value: boolean) => void;
  style: any;
  value: boolean;
  label: string;
  activeColor?: any;
  labelStyle?: any;
}

const AppCheckbox: React.FC<IComponentProps> = (props) => {

  const clickCheckbox = () => {
    props.clicked && props.clicked(!props.value);
  }
  let activeColor = props.activeColor ? props.activeColor : '#000';
  return (
    <TouchableOpacity onPress={clickCheckbox} style={{ ...styles.container, ...props.style }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <View style={styles.chackbox}>
          <View style={{
            ...styles.selected,
            backgroundColor: props.value ? activeColor : '#FFF',
          }} />
        </View>
        <Text style={{...styles.label, ...props.labelStyle}}>{props.label}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  chackbox: {
    height: 16,
    width: 16,
    borderWidth: 2,
    borderRadius: 3,
    borderColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selected: {
    height: 10,
    width: 10
  },
  label: {
    paddingLeft: 8,
    lineHeight: 17,
    fontSize: 12,
    color: "#000",
    fontFamily: 'FiraGO-Regular'
  }
})


export default AppCheckbox;