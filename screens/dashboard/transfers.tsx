import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import DashboardLayout from '../DashboardLayout';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';


const Transfers:React.FC = () => {
    const navigation = useNavigation();

    return (
        <DashboardLayout>
            <View>
                <Text>
                    Transfers
                </Text>
                <View>
                    <Button title="Home" onPress={() => navigation.navigate("Dashboard")} color={`${Colors.primary}`} />
                </View>
            </View>
        </DashboardLayout>
    )
}

export default Transfers;