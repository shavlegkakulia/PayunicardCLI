import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import NavigationService from '../../services/NavigationService';
import AppLayout from '../AppLayout';
import Colors from '../../constants/colors';

const Dashboard: React.FC = (props) => {
    const gotop = () => {
        console.log('go')
        NavigationService.navigate('Transfers');
    }
    return (
        <AppLayout>
            <View style={styles.container}>
                <Text>
                    Dashboard
                </Text>
                <View style={styles.container}>
                    <Button title="Transfers" onPress={() => gotop()} color={`${Colors.primary}`} />
                </View>
            </View>
        </AppLayout>
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