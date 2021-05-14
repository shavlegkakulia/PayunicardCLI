import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import DashboardLayout from '../DashboardLayout';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Dashboard: React.FC = () => {
    const navigation = useNavigation();
    const state = useSelector((state: any) => state)
    return (
        <DashboardLayout>
            <View style={styles.container}>
                <Text>
                    Dashboard
                </Text>
                <Text>
                    {state.AuthReducer.accesToken}
                </Text>
                <View style={styles.container}>
                    <Button title="Transfers" onPress={() => navigation.navigate("Transfers")} color={`${Colors.primary}`} />
                </View>
            </View>
        </DashboardLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        backgroundColor: Colors.danger
    },
    title: {
        color: Colors.danger,
        fontFamily: 'FiraGO-Bold'
    }
})

export default Dashboard;