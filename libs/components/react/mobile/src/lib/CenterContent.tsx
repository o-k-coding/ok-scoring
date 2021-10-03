import React from 'react';
import { View } from 'react-native';
import { sharedMobileStyles } from '@ok-scoring/styles';
import { WrapperComponentProps } from './WrapperComponentProps';

export const CenterContent = ({ children }: WrapperComponentProps) => {
    return (
        <View style={sharedMobileStyles.centeredContent}>
            {children}
        </View>
    );
}

export default CenterContent;
