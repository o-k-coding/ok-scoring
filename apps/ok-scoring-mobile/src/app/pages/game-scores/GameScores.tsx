import React, { useContext } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { GameRoute, GameScoresRoute, NewGameRoute, PageNavigationProps } from '../../navigation';
import GamePlayerScoresTable from './components/GamePlayerScoresTable';
import GameScoresHeader from './components/GameScoresHeader';
import GameScoresNavBar from './GameScoresNavBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PromptModal } from '@ok-scoring/components/react/mobile';
import { gameContext, gameHistoryContext, playerHistoryContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles } from '@ok-scoring/styles';

export type GameScoreProps = {
    gameOver?: boolean;
}

const GameScores = ({ route: { params: { gameOver } }, navigation }: PageNavigationProps<typeof GameScoresRoute>) => {
    const {
        players,
        gameState,
        initGameState,
        scoreHistory,
        scoreHistoryRounds,
        editingPlayerScore,
        cancelEditPlayerScore,
        updateRoundScore,
        winningPlayerName,
        copyGameSetup,
        settings,
        description,
        addOrReplacePlayer,
    } = useContext(gameContext);
    const { saveGame } = useContext(gameHistoryContext);
    const { savePlayers } = useContext(playerHistoryContext);

    const exitToNewGame = () => {
        initGameState(undefined);
        navigation.reset({
            index: 0,
            routes: [{ name: NewGameRoute }],
        });
    };

    const exitAndplayAgain = () => {
        copyGameSetup(players, settings, description);
        navigation.reset({
            index: 0,
            routes: [{ name: GameRoute }],
        });
    };

    const saveAndQuit = (playAgain: boolean) => {
        savePlayers(gameState.players);
        saveGame(gameState);
        if (playAgain) {
            exitAndplayAgain();
        } else {
            exitToNewGame();
        }
    }

    return (
        <SafeAreaView style={[sharedMobileStyles.pageContainer]}>
            <View style={[sharedMobileStyles.spacedColumn]}>
                <PromptModal
                    modalVisible={!!editingPlayerScore}
                    title={`Update Round ${editingPlayerScore?.scoreIndex ?? 0 + 1} Score For ${editingPlayerScore?.player.name}`}
                    inputProps={{
                        placeholder: 'Update Score',
                        keyboardType: 'number-pad',
                    }}
                    onCancel={cancelEditPlayerScore}
                    onSave={(value) => {
                        if (value !== undefined && editingPlayerScore) {
                            const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
                            updateRoundScore(editingPlayerScore.player.key, editingPlayerScore.scoreIndex, numericValue);
                        }
                    }} />
                <GameScoresNavBar backHandler={navigation.pop} saveHandler={gameOver ? saveAndQuit : null} winningPlayerName={winningPlayerName} />
                <GameScoresHeader gameState={gameState} playerUpdated={addOrReplacePlayer} />
                <GamePlayerScoresTable
                    players={players}
                    scoreHistory={scoreHistory}
                    scoreHistoryRounds={scoreHistoryRounds}
                    editable={!gameOver}
                />
            </View>
        </SafeAreaView>
    );
}

export default observer(GameScores);
