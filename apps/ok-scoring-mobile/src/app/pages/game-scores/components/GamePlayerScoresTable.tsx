import { Player, GameScoreHistory } from '@ok-scoring/features/game-models';
import { gameContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles } from '@ok-scoring/styles';
import React, { useContext } from 'react';
import { ScrollView } from 'react-native';
import GamePlayerScoresTableRow from './GamePlayerScoresTableRow';

type GamePlayerScoresTableProps = {
    players: Player[];
    scoreHistoryRounds: number[];
    scoreHistory: GameScoreHistory;
    editable?: boolean;
    playersSelectable?: boolean;
};
export const GamePlayerScoresTable = ({
    players,
    scoreHistoryRounds,
    scoreHistory,
    editable = true,
    playersSelectable = false,
}: GamePlayerScoresTableProps) => {
    const { activeGamePlayerScore, winningPlayerKey, dealingPlayerKey } = useContext(gameContext);

    return (
        <>
            <ScrollView style={[sharedMobileStyles.mt25]}>
                {players.map((player) => (
                    <GamePlayerScoresTableRow
                        key={player.key}
                        active={activeGamePlayerScore?.player.key === player.key}
                        winning={winningPlayerKey === player.key}
                        player={player}
                        scoreHistory={scoreHistory}
                        editable={editable}
                        selectable={playersSelectable}
                        scoreHistoryRounds={scoreHistoryRounds}
                        isDealer={dealingPlayerKey === player.key}
                    />
                ))}
            </ScrollView>
        </>
    );
};

export default GamePlayerScoresTable;
