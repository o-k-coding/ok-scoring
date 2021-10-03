import React, { useContext } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Switch } from 'react-native';
import { observer } from 'mobx-react';
import SettingsSection from './components/dumb/SettingsSection';
import { GameSettingsRoute, PageNavigationProps } from '../../navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gameContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles, colors } from '@ok-scoring/styles';
import { Header, NavBar, BodyText, RadioButtons, UnderConstruction } from '@ok-scoring/components/react/mobile';

const GameSettings = ({ navigation: { goBack } }: PageNavigationProps<typeof GameSettingsRoute>) => {

    const { settings, setSetting, dealerSettingsItems } = useContext(gameContext);

    return (
        <SafeAreaView style={sharedMobileStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: goBack }}
            />
            <Header title='Game Settings' />
            <ScrollView style={sharedMobileStyles.scroll} keyboardShouldPersistTaps='always'>
                {/* <SettingsSection sectionTitle='Round Settings'>
                    <View style={sharedMobileStyles.rowNoBorder}>
                        <BodyText>Round Limit</BodyText>
                        <TextInput
                            placeholder='∞'
                            onChangeText={(n) => setSetting('rounds', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            value={settings?.rounds?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                    <View style={sharedMobileStyles.rowNoBorder}>
                        <BodyText>Round Time Limit</BodyText>
                        <TextInput
                            placeholder='∞'
                            onChangeText={(n) => setSetting('roundTimeLimit', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            value={settings?.roundTimeLimit?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                    <View style={sharedMobileStyles.rowNoBorder}>
                        <BodyText>Round Time Limit</BodyText>
                        <TextInput
                            placeholder='N/A'
                            onChangeText={(n) => setSetting('par', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            value={settings?.par?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>
                    </View>
                </SettingsSection> */}
                <SettingsSection sectionTitle='Score Settings'>
                    <View style={sharedMobileStyles.spacedRowNoBorder}>
                        <BodyText>Starting Score</BodyText>
                        <TextInput
                            style={[styles.settingsInput]}
                            placeholder='0'
                            onChangeText={(n) => setSetting('startingScore', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : 0)}
                            value={settings?.startingScore?.toString()}
                            autoCorrect={false}
                            returnKeyType="done"
                            keyboardType='number-pad'
                            clearTextOnFocus={true}
                        />
                    </View>
                    <View style={sharedMobileStyles.spacedRowNoBorder}>
                        <BodyText>Default Score Step</BodyText>
                        <TextInput
                            style={[styles.settingsInput]}
                            placeholder='1'
                            onChangeText={(n) => setSetting('defaultScoreStep', n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : 0)}
                            returnKeyType="done"
                            value={settings?.defaultScoreStep?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'
                            clearTextOnFocus={true}
                        />
                    </View>
                    <View style={sharedMobileStyles.spacedRowNoBorder}>
                        <BodyText>High Score Wins</BodyText>
                        <Switch
                            trackColor={{ false: colors.greyMid, true: colors.primaryLight }}
                            thumbColor={settings?.highScoreWins ? colors.primaryLight : colors.greyLight}
                            ios_backgroundColor={colors.greyMid}
                            onValueChange={(n: boolean) => setSetting('highScoreWins', n)}
                            value={settings?.highScoreWins}
                        />
                    </View>
                    {/* <View style={sharedMobileStyles.rowNoBorder}>
                        <BodyText>Score Increases By Default</BodyText>
                        <Switch
                            trackColor={{ false: colors.greyMid, true: colors.primaryLight }}
                            thumbColor={settings?.scoreIncreases ? colors.primaryLight : colors.greyLight}
                            ios_backgroundColor={colors.greyMid}
                            onValueChange={(n: boolean) => setSetting('scoreIncreases', n)}
                            value={settings?.scoreIncreases}
                        />
                    </View> */}
                </SettingsSection>
                <SettingsSection sectionTitle='Dealer Settings'>
                    <View style={sharedMobileStyles.spacedRowNoBorder}>
                        <RadioButtons items={dealerSettingsItems}></RadioButtons>
                    </View>
                </SettingsSection>
            </ScrollView>
            <UnderConstruction />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    settingsInput: {
        fontFamily: 'Quicksand',
        borderBottomColor: colors.greyMid,
        borderBottomWidth: 1,
        textAlign: 'center',
        minWidth: 50,
    }
});

export default observer(GameSettings);
