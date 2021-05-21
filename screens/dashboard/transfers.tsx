import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import DashboardLayout from '../DashboardLayout';
import { useDispatch } from 'react-redux';
import { use } from './../../redux/actions/translate_actions';


const Transfers:React.FC = () => {
    const dispatch = useDispatch();

    return (
        <DashboardLayout>
            <View>
                <Text>
                    Transfers
                </Text>
                <TouchableOpacity onPress={async () => { dispatch(use('en')) }}>
                <Text style={{flexDirection: 'row'}}>Switch to ENG</Text>
            </TouchableOpacity>
            </View>
        </DashboardLayout>
    )
}

export default Transfers;