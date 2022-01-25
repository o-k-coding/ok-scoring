import React, { useEffect, useState, useContext, useRef } from 'react'
import { StyleSheet, Text, View, TextInput, Animated } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import { GameRoute, GameScoresRoute, PageNavigationProps } from '../../navigation';
import GamePlayerScoresTable from '../game-scores/components/GamePlayerScoresTable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavBar, IconButton, Header } from '@ok-scoring/components/react/mobile';
import { truncateString } from '@ok-scoring/components/react/hooks';
import { PlayerScoreMode } from '@ok-scoring/data/game-models';
import { gameContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles, colors } from '@ok-scoring/styles';
import GestureRecognizer from 'react-native-swipe-gestures';

const Game = ({ navigation }: PageNavigationProps<typeof GameRoute>) => {
    const {
        settings,
        players,
        startGame,
        winningPlayerKey,
        changeActivePlayer,
        endPlayerTurn,
        scoreHistory,
        scoreHistoryRounds,
        activeGamePlayerScore,
        playerScoreMode,
        updateRoundScore,
        dealingPlayerKey,
        canSetDealer,
        setDealer,
    } = useContext(gameContext);
    // const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const runFadeAnimation = (fromDirection: 1 | -1 | 0) => {
        // slideAnim.setValue(100 * fromDirection);
        fadeAnim.setValue(0);
        // Animated.timing(slideAnim, {
        //     toValue: 0,
        //     duration: 500,
        //     useNativeDriver: true
        // }).start();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true
        }).start();
    }

    let turnScoreInputRef: TextInput;
    useEffect(() => {
        console.log('active player changed'); // Current runs 3 times in a row
        updateTurnScore(activeGamePlayerScore?.score);
        runFadeAnimation(0);
    }, [activeGamePlayerScore]);

    useEffect(() => {
        startGame();
        // runFadeAnimation(0);
    }, []);

    const [turnScore, updateTurnScore] = useState<number | undefined>(settings?.defaultScoreStep ?? 0);

    const changePlayerLeft = () => {
        changeActivePlayer(-1, players);
        // runFadeAnimation(-1);
    };

    const changePlayerRight = () => {
        changeActivePlayer(1, players);
        // runFadeAnimation(1);
    };

    const displayName = truncateString(activeGamePlayerScore?.player?.name ?? '', 7);

    return (activeGamePlayerScore ?
        <SafeAreaView style={sharedMobileStyles.pageContainer}>
            <View style={styles.gameContainer}>
                <GestureRecognizer onSwipeRight={changePlayerLeft} onSwipeLeft={changePlayerRight}>
                    <NavBar
                        leftButton={{
                            icon: 'book', title: 'Scores', clickHandler: () => {
                                navigation.navigate(GameScoresRoute, { gameOver: false });
                            }
                        }}
                        rightButton={{
                            icon: 'exit-to-app', title: 'Finish Game', clickHandler: () => {
                                navigation.navigate(GameScoresRoute, { gameOver: true });
                            }
                        }}
                    />
                    <View style={[sharedMobileStyles.spacedEvenlyNoBorder, sharedMobileStyles.mt10]}>
                        <View style={[styles.buttonRowItem]}>
                            <IconButton icon='chevron-left' clickHandler={changePlayerLeft} width={'100%'} size={34} />
                        </View>
                        <Animated.View style={[styles.buttonRowItem, { opacity: fadeAnim }]}>
                            <Header title={displayName} />
                        </Animated.View>
                        <View style={[styles.buttonRowItem]}>
                            <IconButton icon='chevron-right' clickHandler={changePlayerRight} width={'100%'} size={34} />
                        </View>
                    </View>

                    <Animated.View style={[sharedMobileStyles.mt25, { width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, { opacity: fadeAnim }]}>
                        <MaterialCommunityIcons name={'crown'} size={28} color={winningPlayerKey === activeGamePlayerScore.player.key ? colors.tertiary : colors.white} />
                        <Text style={[styles.turnDetails, sharedMobileStyles.ml15, sharedMobileStyles.mr15]}>
                            Turn {activeGamePlayerScore.scoreIndex + 1}
                        </Text>
                        {
                            canSetDealer ?
                                <IconButton icon={dealingPlayerKey === activeGamePlayerScore.player.key ? 'cards' : 'cards-outline'} clickHandler={() => setDealer(activeGamePlayerScore.player.key)} size={28} color={colors.primary} /> :
                                <MaterialCommunityIcons name='cards' size={28} color={dealingPlayerKey === activeGamePlayerScore.player.key ? colors.tertiary : colors.white} />
                        }
                    </Animated.View>
                    <Animated.View style={[styles.scoreContainer, { opacity: fadeAnim }]}>
                        <View style={styles.middleTextInner}>
                            <Text style={[sharedMobileStyles.headerText, sharedMobileStyles.centeredText]}>
                                {activeGamePlayerScore.playerScore.currentScore?.toString() || '0'}
                            </Text>
                        </View>
                    </Animated.View>
                    <View style={[sharedMobileStyles.spacedEvenlyNoBorder]}>
                        <View style={[styles.buttonRowItem]}>
                            <IconButton icon='plus-minus' clickHandler={() => turnScore && updateTurnScore(turnScore * -1)} size={34} />
                        </View>
                        <View style={[styles.buttonRowItem]}>
                            <TextInput
                                style={[styles.scoreInput]}
                                onChangeText={(n) => {
                                    if (!!n || n === '0') {
                                        updateTurnScore(parseInt(n.replace(/[^0-9]/g, ''), 10));
                                    } else {
                                        updateTurnScore(undefined);
                                    }
                                }}
                                placeholder='Turn Score'
                                value={turnScore?.toString()}
                                clearTextOnFocus={true}
                                selectTextOnFocus={true} // This is needed for Android
                                keyboardType='number-pad'
                                returnKeyType="done"
                                ref={(input: TextInput) => { turnScoreInputRef = input; }}
                            />
                            <View style={sharedMobileStyles.mt25}>
                                <IconButton icon='dialpad' clickHandler={() => turnScoreInputRef.focus()} size={34} />
                            </View>
                        </View>
                        <View style={[styles.buttonRowItem]}>
                        </View>
                    </View>

                    <View style={[sharedMobileStyles.centeredContent, sharedMobileStyles.mt25, sharedMobileStyles.mb10]}>
                        <IconButton
                            title={playerScoreMode === PlayerScoreMode.Editing ? `Update Turn` : `End Turn`}
                            color={colors.white}
                            backgroundColor={colors.primary}
                            icon={'chevron-right'}
                            iconSide='right'
                            clickHandler={() => {
                                if (playerScoreMode === PlayerScoreMode.Editing) {
                                    updateRoundScore(activeGamePlayerScore.player.key, activeGamePlayerScore.scoreIndex, turnScore as number);
                                } else {
                                    endPlayerTurn(turnScore, players);
                                }
                            }}
                        />
                    </View>
                </GestureRecognizer>
                <GamePlayerScoresTable
                    players={players}
                    scoreHistory={scoreHistory}
                    scoreHistoryRounds={scoreHistoryRounds}
                    editable={true}
                    playersSelectable={true}
                />
            </View>
        </SafeAreaView>
        : <Text>Loading...</Text>
    );
};

const styles = StyleSheet.create({
    buttonRowItem: {
        flex: 1
    },
    gameContainer: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        height: '100%',
        width: '100%'
    },
    scoreInput: {
        fontFamily: 'Quicksand',
        fontSize: 20,
        borderBottomColor: colors.greyMid,
        borderBottomWidth: 1,
        textAlign: 'center',
        minWidth: 50,
    },
    turnDetails: {
        fontFamily: 'Quicksand',
        fontSize: 28,
        color: colors.tertiary,
        alignSelf: 'center'
    },
    scoreContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 25,
    },
    middleTextInner: {
        flex: 1,
    },
    middleTextOuter: {
        flex: 2,
    },
    scoreInputContainer: {
        width: '40%',
    }
});

export default observer(Game);
