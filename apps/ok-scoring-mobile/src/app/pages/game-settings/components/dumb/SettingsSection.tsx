import { BodyText } from '@ok-scoring/components/react/mobile';
import { sharedMobileStyles, colors } from '@ok-scoring/styles';
import { WrapperComponentProps } from 'libs/components/react/mobile/src/lib/WrapperComponentProps';
import React, { useState } from 'react';
import { StyleSheet, View, Switch } from 'react-native';

interface SettingsSectionProps extends WrapperComponentProps {
    sectionTitle: string;
}

const SettingsSection = ({ sectionTitle, children }: SettingsSectionProps) => {
    const [showSection, toggleShowSection] = useState(false);

    const onToggleShowSection = (toggled: boolean) => {
        toggleShowSection(toggled);
    }

    return (
        <View style={styles.sectionContainer}>
            <View style={sharedMobileStyles.spacedRowBordered}>
                <BodyText>{sectionTitle}</BodyText>
                <Switch
                    trackColor={{ false: colors.greyMid, true: colors.primaryLight }}
                    thumbColor={showSection ? colors.primaryLight : colors.greyLight}
                    ios_backgroundColor={colors.greyMid}
                    onValueChange={onToggleShowSection}
                    value={showSection}
                />
            </View>
            <>
                {showSection && children}
            </>
        </View>
    )
}

export default SettingsSection

const styles = StyleSheet.create({
    sectionContainer: {
        display: 'flex',
        width: '100%',
    }
})
