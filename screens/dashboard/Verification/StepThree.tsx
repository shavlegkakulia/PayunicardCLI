import React, { useState } from "react"
import { View, StyleSheet, Text, StyleProp, ViewStyle, TouchableOpacity, Image } from "react-native"
import AppButton from "../../../components/UI/AppButton";
import AppCheckbox from "../../../components/UI/AppCheckbox";
import AppInput from "../../../components/UI/AppInput";
import AppSelect, { SelectItem } from "../../../components/UI/AppSelect/AppSelect";
import Validation, { required } from "../../../components/UI/Validation";
import colors from "../../../constants/colors";
import { IExpectedType } from "../../../services/UserService";
import { ITransactionCategoryInterface } from "./Index";

interface IProps {
    loading: boolean,
    selectedExpectedTurnover: IExpectedType | undefined,
    expectedTurnovers: IExpectedType[] | undefined;
    transactionCategories: ITransactionCategoryInterface[],
    anotherTransactionCategory: string | undefined,
    onSetExpectedTurnover: (status: IExpectedType) => void,
    onToggleTransactionCategory: (index: ITransactionCategoryInterface) => void,
    setAnotherTransactionCategory: (other: string) => void,
    onComplate: () => void
}

const ValidationContext = 'userVerification';

const StepThree: React.FC<IProps> = (props) => {
    const [expectedTurnoverErrorStyle, setExpectedTurnoverErrorStyle] = useState<StyleProp<ViewStyle>>({});
    const [expectedTurnoverVisible, setExpectedTurnoverVisible] = useState(false);

    const nextHandler = () => {
        if (!props.selectedExpectedTurnover) {
            setExpectedTurnoverErrorStyle({ borderColor: colors.danger, borderWidth: 1 });
            return;
        } else {
            setExpectedTurnoverErrorStyle({});
        }

        if (Validation.validate(ValidationContext)) {
            return;
        }

        props.onComplate();
    }

    let isAnotherSelected = props.transactionCategories.some(tc => tc.id === 5 && tc.active); //another

    return (
        <View style={styles.container}>
            <View style={styles.sectionContainer}>
                <Text style={styles.BoxTitle}>მონიშნეთ მოსალოდნელი ბრუნვა 1 წლის განმავლობაში</Text>
                <View style={[styles.sectionBox, expectedTurnoverErrorStyle]}>
                    {props.selectedExpectedTurnover ?
                        <SelectItem
                            itemKey='expectedTurnover'
                            defaultTitle='აირჩიეთ მოსალოდნელი ბრუნვა'
                            item={props.selectedExpectedTurnover}
                            onItemSelect={() => setExpectedTurnoverVisible(true)}
                            style={styles.typeItem} />
                        :
                        <TouchableOpacity
                            onPress={() => setExpectedTurnoverVisible(true)}
                            style={[styles.typeSelectHandler]}>
                            <Text style={styles.typePlaceholder}>აირჩიეთ მოსალოდნელი ბრუნვა</Text>
                            <Image style={styles.dropImg} source={require('./../../../assets/images/down-arrow.png')} />
                        </TouchableOpacity>}

                    <AppSelect
                        itemKey='expectedTurnover'
                        elements={props.expectedTurnovers}
                        selectedItem={props.selectedExpectedTurnover}
                        itemVisible={expectedTurnoverVisible}
                        onSelect={(item) => { props.onSetExpectedTurnover(item); setExpectedTurnoverVisible(false) }}
                        onToggle={() => setExpectedTurnoverVisible(!expectedTurnoverVisible)} />
                </View>


                <View style={styles.categories}>
                    <Text style={styles.BoxTitle}>მონიშნეთ მოსალოდნელი ტრანზაქციების კატეგორიები</Text>
                    {props.transactionCategories.map((category, index) =>
                        <View key={index} style={styles.categoryItem}>
                            <TouchableOpacity
                                onPress={() => props.onToggleTransactionCategory(category)}
                                style={styles.touchArea}>
                                <AppCheckbox
                                    label={category.value}
                                    value={category.active}
                                    customKey='activeCategory'
                                    context={ValidationContext}
                                    activeColor={colors.primary}
                                    clicked={() => props.onToggleTransactionCategory(category)}
                                    style={styles.typeCheck} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {isAnotherSelected && <AppInput
                        placeholder='სხვა'
                        onChange={(anotherTransactionCategory) => props.setAnotherTransactionCategory(anotherTransactionCategory)}
                        value={props.anotherTransactionCategory}
                        customKey='anotherTransactionCategory'
                        requireds={[required]}
                        style={styles.input}
                        context={ValidationContext} />}

            </View>

            <AppButton
                isLoading={props.loading}
                title={translate.t('common.next')}
                onPress={nextHandler}
                style={styles.button} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 327,
        width: '100%',
        alignSelf: 'center'
    },
    sectionContainer: {
        marginTop: 40
    },
    BoxTitle: {
        fontFamily: 'FiraGO-Bold',
        fontSize: 14,
        lineHeight: 17,
        color: colors.labelColor,
        marginBottom: 15
    },
    sectionBox: {
        backgroundColor: colors.inputBackGround,
        borderRadius: 7
    },
    typeItem: {
        backgroundColor: colors.inputBackGround,
        borderRadius: 7
    },
    dropImg: {
        marginRight: 12
    },
    typeSelectHandler: {
        height: 54,
        backgroundColor: colors.inputBackGround,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    typePlaceholder: {
        fontFamily: 'FiraGO-Regular',
        fontSize: 14,
        lineHeight: 17,
        color: colors.placeholderColor,
        marginLeft: 13
    },
    input: {
        marginTop: 20
    },
    button: {
        marginTop: 30
    },
    touchArea: {
        
    },
    typeCheck: {
        paddingVertical: 7
    },
    categories: {
        marginTop: 20,
        justifyContent: 'flex-start'
    },
    categoryItem: {
        flexDirection:'row',
        justifyContent: 'flex-start'
    }
});

export default StepThree;