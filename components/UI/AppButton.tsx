import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import colors from '../../constants/colors';

//@ts-ignore
TouchableOpacity.defaultProps = { activeOpacity: 0.5 };

interface IButton {
  onPress: () => void;
  title: string;
  backgroundColor?: string;
  color?: string;
  isLoading?: boolean;
}

const AppButton: React.FC<IButton> = ({ onPress, title, backgroundColor, color, isLoading }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.appButtonContainer,
      backgroundColor ? { backgroundColor } : undefined
    ]}
  >
    {!isLoading ? <Text style={[styles.appButtonText, color ? { color } : undefined]}>
      {title}
    </Text> : <View style={styles.loading}>
      <ActivityIndicator size="small" color="#ffffff" />
    </View>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  appButtonContainer: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    lineHeight: 16,
    width: '100%'
  },
  appButtonText: {
    fontSize: 14,
    color: "#fff",
    alignSelf: "center",
    fontFamily: 'FiraGO-Regular'
  },
  loading: {
    padding: 4
  }
});

export default AppButton;