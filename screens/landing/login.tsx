import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Keyboard, EmitterSubscription } from 'react-native';
import AppInput from './../../components/UI/AppInput';
import AppButton from './../../components/UI/AppButton';
import AppCheckbox from './../../components/UI/AppCheckbox';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { Login } from './../../redux/actions/auth_actions';
import colors from '../../constants/colors';
import { IAuthState, IGlobalState } from './../../redux/action_types/auth_action_types';

const LoginForm: React.FC = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const state = useSelector<IGlobalState>(state => state.AuthReducer) as IAuthState;
    const timeoutObject = useRef<any>(null);
    const keyboardVisible = useRef<EmitterSubscription>();
    const [username, setUserName] = useState("Avtandil@test.com");
    const [password, setPassword] = useState("As123123!");
    const [remember, setRemember] = useState(false);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        keyboardVisible.current = Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        return () => {
            keyboardVisible.current?.remove()
        }
    }, [])

    const _keyboardDidHide = () => {
        setFocused(false);
    }

    const _remember = useCallback((isChecked: boolean) => {
        setRemember(isChecked);
    }, [remember])

    const login = async () => {
        if(state.isLoading) return;
        await dispatch(Login(username, password));
    }

    const changeUsername = useCallback((username: string) => {
        setUserName(username);
    }, [username]);

    const changePassword = useCallback((password: string) => {
        setPassword(password);
    }, [password]);

    const onFocus = useCallback(() => {
        if (timeoutObject.current) {
            clearTimeout(timeoutObject.current)
        }
        setFocused(true);
    }, [focused])

    const onBlur = useCallback(() => {
        if (timeoutObject.current) {
            clearTimeout(timeoutObject.current)
        }
        timeoutObject.current = setTimeout(() => {
            setFocused(false);
        }, 100);
    }, [focused])

    const Header = () => {
        let headerContainerStyle = focused ? { ...styles.headerContainer, position: 'absolute' as 'absolute', top: 29 } : { ...styles.headerContainer }
        return <View style={headerContainerStyle}>
            <Text style={styles.authorizeText}>ავტორიზაცია</Text>
            <TouchableOpacity onPress={async () => { await AsyncStorage.removeItem('isFirstLoad'); }}>
                <Text style={styles.langSwitchText}>Switch to ENG</Text>
            </TouchableOpacity>
        </View>
    }
    let buttonContainerStyle = focused ? { ...styles.buttonContainer, marginBottom: 15 } : { ...styles.buttonContainer }

    return (
        <View style={styles.container}>
            <Header />
            <View>
                <Text style={styles.welcomeText}>მოგესალმებით</Text>
                {!focused && <View style={styles.imageContainer}>
                    <Image source={require('./../../assets/images/LoginScreen_1.png')} />
                </View>}
                <View style={styles.inputsContainer}>
                    <AppInput placeholder="email"
                        onBlur={onBlur}
                        onFocus={onFocus}
                        value={username}
                        onChange={(username) => { changeUsername(username) }} style={styles.firstInput} />
                    <AppInput placeholder="password"
                        onBlur={onBlur}
                        onFocus={onFocus}
                        value={password}
                        onChange={(password) => { changePassword(password) }} />
                </View>
                <View style={styles.toolContainer}>
                    <AppCheckbox label='დამახსოვრება' labelStyle={styles.forgotLabelColor} activeColor={colors.primary} value={remember} clicked={_remember} style={{}} />
                    <TouchableOpacity><Text style={styles.forgotLabel}>დაგავიწყდა პაროლი?</Text></TouchableOpacity>
                </View>
                <View style={buttonContainerStyle}>
                    <AppButton title="LOGIN" onPress={login} isLoading={state.isLoading} />
                    <AppButton backgroundColor={`${colors.white}`} color={`${colors.black}`} title="SIGNUP" onPress={() => navigation.navigate('Signup')} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        height: '100%',
        justifyContent: 'flex-end',
        width: '100%',
        maxWidth: 327,
        alignSelf: 'center'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        width: '100%'
    },
    authorizeText: {
        fontFamily: 'FiraGO-Medium',
        fontSize: 14,
        lineHeight: 16,
        color: colors.black
    },
    langSwitchText: {
        fontFamily: 'FiraGO-Regular',
        fontSize: 14,
        lineHeight: 16,
        color: colors.black
    },
    welcomeText: {
        marginBottom: 39,
        fontFamily: 'FiraGO-Bold',
        fontSize: 24,
        lineHeight: 28,
        color: colors.black
    },
    imageContainer: {
        backgroundColor: colors.white,
        marginBottom: 65
    },
    buttonContainer: {
        marginBottom: 35
    },
    inputsContainer: {
        marginBottom: 23
    },
    firstInput: {
        marginBottom: 22
    },
    toolContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingBottom: 46
    },
    forgotLabel: {
        fontFamily: 'FiraGO-Regular',
        fontSize: 12,
        lineHeight: 17,
        color: colors.labelColor
    },
    forgotLabelColor: {
        color: colors.labelColor
    }
})

export default LoginForm;