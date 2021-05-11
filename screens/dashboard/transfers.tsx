import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import NavigationService from './../../services/NavigationService';
import AppLayout from '../AppLayout';
import Colors from '../../constants/colors';


const Transfers:React.FC = (props) => {
    return (
        <AppLayout>
            <View>
                <Text>
                    Transfers
                </Text>
                <View>
                    <Button title="Home" onPress={() => NavigationService.navigate('Dashboard')} color={`${Colors.primary}`} />
                </View>
            </View>
        </AppLayout>
    )
}

export default Transfers;