import { useState } from 'react'
import { Modal, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'
import IconButton from './IconButton'
import { sharedMobileStyles, colors } from '@ok-scoring/styles';

type PromptModalProps = {
    modalVisible: boolean;
    title: string;
    inputProps: TextInputProps;
    saveButtonText?: string;
    cancelButtonText?: string;
    onCancel: () => void;
    onSave: (value?: string) => void;
}

const defaultInputProps: TextInputProps = {
    keyboardType: 'default',
    returnKeyType: 'done',
    clearTextOnFocus: true,
    autoCorrect: false,
    autoFocus: true,
};

export const PromptModal = ({
    modalVisible,
    title,
    inputProps = defaultInputProps,
    onCancel,
    onSave,
    cancelButtonText = 'Cancel',
    saveButtonText = 'Save',
}: PromptModalProps) => {
    const [tempValue, setTempValue] = useState<string | undefined>();

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={[sharedMobileStyles.p20, { backgroundColor: colors.greyMidTrans, height: '100%' }]}>
                    <View style={[{ backgroundColor: colors.white }, sharedMobileStyles.p20, sharedMobileStyles.mt25]}>
                        <Text style={[sharedMobileStyles.centeredText, sharedMobileStyles.bodyText]}>{title}</Text>
                        <TextInput
                            {...defaultInputProps}
                            {...inputProps}
                            style={[
                                styles.input
                            ]}
                            onChangeText={(n) => setTempValue(n)}
                            value={tempValue?.toString()}
                        />
                        <View style={[sharedMobileStyles.spacedEvenlyNoBorder, { width: '100%' }]}>
                            <IconButton title={cancelButtonText} clickHandler={onCancel} color={colors.tertiary} />
                            <IconButton title={saveButtonText} clickHandler={() => {
                                onSave(tempValue);
                                setTempValue(undefined);
                            }} color={colors.primary} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default PromptModal

const styles = StyleSheet.create({
    input: {
        fontFamily: 'Quicksand',
        borderBottomColor: colors.greyMid,
        borderBottomWidth: 1,
        textAlign: 'center',
        margin: 20,
        padding: 5,
    }
})
