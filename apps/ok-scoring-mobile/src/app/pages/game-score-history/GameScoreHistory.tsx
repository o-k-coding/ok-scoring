import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { observer } from 'mobx-react';
import { GameScoreHistoryRoute, PageNavigationProps } from '../../navigation';
import GamePlayerScoresTable from '../game-scores/components/GamePlayerScoresTable';
import GameScoresHeader from '../game-scores/components/GameScoresHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavBar } from '@ok-scoring/components/react/mobile';
import { gameHistoryContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles } from '@ok-scoring/styles';

const GameScoreHistory = ({ navigation }: PageNavigationProps<typeof GameScoreHistoryRoute>) => {
    const { gameState, setGameState, scoreHistoryRounds, addOrReplacePlayer } = useContext(gameHistoryContext);

    if (!gameState) {
        return (
            <View style={[sharedMobileStyles.column]}>
                <Text style={sharedMobileStyles.centeredContent}>No Data To Show</Text>
            </View>
        );
    }
    return (
        <SafeAreaView style={sharedMobileStyles.pageContainer}>
            <View style={sharedMobileStyles.spacedColumn}>
                <NavBar
                    leftButton={{
                        icon: 'chevron-left', title: 'Back', clickHandler: () => {
                            setGameState(undefined);
                            navigation.pop();
                        }
                    }}
                />
                <GameScoresHeader gameState={gameState} playerUpdated={addOrReplacePlayer} />
                <GamePlayerScoresTable
                    players={gameState.players}
                    editable={false}
                    scoreHistory={gameState.scoreHistory}
                    scoreHistoryRounds={scoreHistoryRounds}
                />
            </View>

        </SafeAreaView>
    );
}

export default observer(GameScoreHistory);
