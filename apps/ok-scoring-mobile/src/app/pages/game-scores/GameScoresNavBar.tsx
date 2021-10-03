import React, { useState } from 'react';
import { Modal, View } from 'react-native';
import { useDiceIcon } from '@ok-scoring/components/react/hooks';
import { Header, IconButton, MatIcons, NavBar } from '@ok-scoring/components/react/mobile';
import { sharedMobileStyles, colors } from '@ok-scoring/styles';

interface GameScoresNavbarProps {
    backHandler: () => void;
    saveHandler: ((playAgain: boolean) => void) | null;
    winningPlayerName?: string;
}

const GameScoresNavBar = ({ backHandler, saveHandler, winningPlayerName }: GameScoresNavbarProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const diceIcon = useDiceIcon<MatIcons>();
    const modalAction = (playAgain: boolean) => {
        if (!!saveHandler) {
            saveHandler(playAgain);
        }
        setModalVisible(false);
    }
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={[sharedMobileStyles.p20, { backgroundColor: colors.greyMidTrans, height: '100%' }]}>
                    <View style={[{ backgroundColor: colors.white }, sharedMobileStyles.p20, sharedMobileStyles.mt25]}>
                        {!!winningPlayerName ? <Header title={`Congratulations ${winningPlayerName}!`} /> : null}
                        <View style={[sharedMobileStyles.spacedEvenlyNoBorder, sharedMobileStyles.mt25]}>
                            <IconButton icon={'replay'} title={'Play Again'} clickHandler={() => {
                                modalAction(true);
                            }} iconSide='left' color={colors.primary} />
                            <IconButton icon={diceIcon} title={'New Game'} clickHandler={() => {
                                modalAction(false);
                            }} iconSide='right' color={colors.primary} />
                        </View>
                    </View>
                </View>
            </Modal>
            <NavBar
                leftButton={
                    { icon: 'chevron-left', title: 'Back', clickHandler: backHandler }
                }
                rightButton={!!saveHandler ? {
                    icon: 'content-save-outline', title: 'Save & Quit', clickHandler: () => {
                        setModalVisible(true);
                    }
                } : undefined}
            />
        </View>
    )
}

export default GameScoresNavBar;
