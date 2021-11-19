import React, { FC, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../constants/colors';
import { IErrorState, IGlobalState as ErrorState } from '../redux/action_types/error_action_types';
import { DELETE } from '../redux/actions/error_action';

const ErrorWrapper: FC = (props) => {
    const errors = useSelector<ErrorState>(state => state.ErrorReducer) as IErrorState;
    const dispatch = useDispatch();
    const ErrorTtl = useRef<any>();
    const animatedValue = useRef(new Animated.Value(1)).current;

    const startAnimation = (toValue: number, end: boolean = false) => {
        Animated.timing(animatedValue, {
            toValue,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => {
            if (end) {
                dispatch(DELETE());
            }
        });
    }

    useEffect(() => {
        if (ErrorTtl.current) clearTimeout(ErrorTtl.current);

        if (errors?.errors) {
            startAnimation(0);
            ErrorTtl.current = setTimeout(() => {
                startAnimation(1, true);
            }, 3000);
        }
    }, [errors.errors])

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -60],
        extrapolate: 'extend'
    })

    console.log(errors?.errors)

    return (
        <View style={styles.container}>
            {errors?.errors !== undefined &&
                <Modal transparent>
                    <Animated.View style={{ ...styles.errorContainer, transform: [{ translateY: translateY }] }}>
                        <Text style={styles.errorText}>
                            {errors.errors}
                        </Text>
                    </Animated.View>
                </Modal>}
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: '#fff',
    },
    errorContainer: {
        backgroundColor: colors.danger,
        zIndex: 9,
        elevation: 9999,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    errorText: {
        color: colors.white
    }
});

export default ErrorWrapper;