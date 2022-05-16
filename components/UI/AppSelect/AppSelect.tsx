import React from "react";
import {  Modal, ScrollView, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import colors from "../../../constants/colors";
import { useDimension } from "../../../hooks/useDimension";
import { getString } from "../../../utils/Converter";

interface IProps {
    elements: Array<any> | undefined;
    selectedItem: any | undefined;
    itemVisible: boolean;
    onSelect: (item: any) => void;
    onToggle: (visible?: boolean) => void;
    style?: StyleProp<ViewStyle>;
    itemKey?: string | undefined;
}

interface IItemProps {
    item: any;
    onItemSelect: (item: any) => void;
    isSelected?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    defaultTitle?: string;
    itemKey?: string | undefined;
}

export const SelectItem: React.FC<IItemProps> = (props) => {
    return (
        <TouchableOpacity style={[styles.item, props.isSelected ? styles.activeIitem : {}, props.style]} onPress={() => props.onItemSelect(props.item)}>
           <Text style={props.textStyle}>
               {props.itemKey ? props.item[props.itemKey] : props.item}
           </Text>
        </TouchableOpacity>
    )
}

const AppSelect: React.FC<IProps> = (props) => {
    const dimension = useDimension();

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={props.itemVisible}
                onRequestClose={() => {
                    props.onToggle()
                }}
            >
                <TouchableOpacity
                    style={styles.background}
                    activeOpacity={1}
                    onPress={() => props.onToggle()}
                />
                <View style={styles.centeredView}>
                    <View style={[styles.modalView]}>
                       <ScrollView style={{maxHeight: dimension.height - 200}}>
                       {props.elements?.map((item, index) =>
                            <SelectItem 
                            key={item + index} 
                            item={item} 
                            itemKey={props.itemKey} 
                            textStyle={styles.selectItem} 
                            style={props.style} 
                            onItemSelect={props.onSelect} 
                            isSelected={props.selectedItem && props.selectedItem[getString(props.itemKey)] === item[getString(props.itemKey)]} />
                        )}
                       </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.white,
        borderRadius: 20,
        paddingVertical: 30,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxWidth: 380
    },
    background: {
        flex: 1,
        backgroundColor: "#00000098",
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopColor: colors.baseBackgroundColor,
        borderBottomColor: colors.baseBackgroundColor,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingLeft: 20,
        paddingRight: 30,
        height: 54
        //paddingVertical: 20
    },
    activeIitem: {
        borderTopColor: colors.primary,
        borderBottomColor: colors.primary,
    },
    selectItem: {
        textAlign: 'center',
        flex: 1
    }
});


export default AppSelect;