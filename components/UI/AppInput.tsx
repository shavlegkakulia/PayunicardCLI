import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import colors from '../../constants/colors';

interface IPageProps {
    style?: any;
}

interface IInputeProps {
    style?: any;
    placeholder: string;
    value: string;
    onChange: (input: string) => void;
    onBlur?: () => void;
    onFocus?: () => void
}

const BaseInput: React.FC<IPageProps> = (props) => (
    <View style={[styles.baseInput, props.style]}>
        {props.children}
    </View>
);

const AppInput: React.FC<IInputeProps> = ({ value, placeholder, onChange, ...props }) => (
    <BaseInput {...props}>
        <TextInput style={{ padding: 0, color: colors.black }} value={value} onChangeText={onChange} onSubmitEditing={props.onBlur} onFocus={props.onFocus} placeholder={placeholder} placeholderTextColor='#6B6B6B' />
    </BaseInput>
);

const styles = StyleSheet.create({
    baseInput: {
        fontSize: 14,
        fontFamily: 'FiraGO-Regular',
        lineHeight: 17,
        paddingVertical: 15,
        paddingHorizontal: 6,
        backgroundColor: '#F6F6F4',
        borderRadius: 10
    },
});

export default AppInput;