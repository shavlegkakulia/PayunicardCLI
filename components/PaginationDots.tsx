import React, {useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';

interface IPageProps {
    length?: number
}

const PaginationDots: React.FC<IPageProps> = (props) => {
    const [length, setLength] = useState<number[]>([]);
    useEffect(() => {
        setLength([...Array(props.length).keys()].map(() => 0))
    }, [])
    const dots = length.map((_, i) => <View key={i} style={styles.dot}></View>)
    return (
        <View style={styles.container}>
            {dots}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 50,
        backgroundColor: '#000',
        marginHorizontal: 6
    }
})

export default PaginationDots;