import React, { useContext } from 'react';
import { Text, FlatList, Alert } from 'react-native';
import GameHistoryListItem from './components/dumb/GameHistoryListItem';
import { observer } from 'mobx-react';
import { GameRoute, GameHistoryRoute, GameScoreHistoryRoute, PageNavigationProps } from '../../navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gameContext, gameHistoryContext } from '@ok-scoring/features/game-ui-store';
import { NavBar } from '@ok-scoring/components/react/mobile';
import { GameState } from '@ok-scoring/data/game-models';
import { sharedMobileStyles } from '@ok-scoring/styles';

const GameHistory = ({ navigation }: PageNavigationProps<typeof GameHistoryRoute>) => {
    const { gameHistory, setGameState, setHistorySort, sort, deleteGame } = useContext(gameHistoryContext);
    const { copyGameSetup, initGameState: initNewGame } = useContext(gameContext);
    const showGameState = (gameState: GameState) => {
        setGameState(gameState);
        navigation.navigate(GameScoreHistoryRoute);
    }

    const confirmDeleteGame = (gameKey: string) =>
        Alert.alert(
            'Are you sure?',
            'Deleting this game will be permanent',
            [
                {
                    text: "Nevermind",
                    onPress: () => { },
                    style: "cancel"
                },
                { text: `I'm Sure`, onPress: () => deleteGame(gameKey) }
            ]
        );
    return (
        <SafeAreaView style={sharedMobileStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: navigation.goBack }}
                rightButton={{ icon: sort.asc ? 'sort-descending' : 'sort-ascending', title: 'Sort By Date', clickHandler: () => setHistorySort({ ...sort, asc: !sort.asc }) }}
            />

            <FlatList
                style={sharedMobileStyles.scroll}
                data={gameHistory}
                ListEmptyComponent={
                    <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.centeredText, sharedMobileStyles.mt25]}>No Games Played Yet!</Text>
                }
                renderItem={
                    (itemData) =>
                        <GameHistoryListItem
                            sort={sort}
                            index={itemData.index}
                            game={itemData.item}
                            copyGameSetup={(...args) => {
                                copyGameSetup(...args);
                                navigation.goBack();
                            }}
                            continueGame={(gameState) => {
                                initNewGame(gameState);
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: GameRoute }],
                                })
                            }}
                            deleteGame={confirmDeleteGame}
                            showGameState={showGameState}
                            key={itemData.item.key}
                        />
                }
            />
        </SafeAreaView>
    );
}

export default observer(GameHistory);
