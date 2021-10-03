import { formatDate } from '@ok-scoring/components/react/hooks';
import { Header } from '@ok-scoring/components/react/mobile';
import { GameState, Player } from '@ok-scoring/features/game-models';
import { sharedMobileStyles } from '@ok-scoring/styles';
import React from 'react';
import { Text, FlatList } from 'react-native';
import GameScoreListItem from './GameScoresListItem';

type GameScoresHeaderProps = {
    gameState: GameState;
    playerUpdated: (p: Player) => void;
}
const GameScoresHeader = ({ gameState, playerUpdated }: GameScoresHeaderProps) => {
    const formattedDate = formatDate(gameState.date);
    return (
        <>
            <Header title={gameState.description} />
            <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.mb25, sharedMobileStyles.centeredText]}>
                {formattedDate}
            </Text>
            <FlatList
                style={[sharedMobileStyles.scroll, sharedMobileStyles.mb25]}
                data={gameState.players}
                renderItem={
                    (itemData) =>
                        <GameScoreListItem
                            key={itemData.item.key}
                            player={itemData.item}
                            playerScoreHistory={gameState.scoreHistory[itemData.item.key]}
                            winning={itemData.item.key === gameState.winningPlayerKey}
                            playerUpdated={playerUpdated}
                        />
                }
            />
        </>
    )
}

export default GameScoresHeader;
