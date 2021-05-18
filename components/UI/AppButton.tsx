import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import Colors from '../../constants/colors';

//@ts-ignore
TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

interface IButton {
    onPress: () => void;
    title: string;
    size: string;
    backgroundColor?: string;
}

const AppButton:React.FC<IButton> = ({ onPress, title, size, backgroundColor }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.appButtonContainer,
        size === "sm" && {
          paddingHorizontal: 8,
          paddingVertical: 6
        },
        backgroundColor ? { backgroundColor } : undefined
      ]}
    >
      <Text style={[styles.appButtonText, size === "sm" && { fontSize: 14 }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

const styles = StyleSheet.create({
  appButtonContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 12,
    width: '100%'
  },
  appButtonText: {
    fontSize: 14,
    color: "#fff",
    alignSelf: "center",
    fontFamily: 'FiraGO-Regular'
  }
});

export default AppButton;