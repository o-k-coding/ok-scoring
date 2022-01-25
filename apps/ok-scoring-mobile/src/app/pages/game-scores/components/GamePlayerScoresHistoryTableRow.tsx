import { PlayerScoreHistory } from '@ok-scoring/data/game-models';
import { sharedMobileStyles } from '@ok-scoring/styles';
import React from 'react';
import { View } from 'react-native';
import GamePlayerScoresTableScoreCell from './GamePlayerScoresTableScoreCell';

type GamePlayerScoresTableProps = {
    playerScoreHistory: PlayerScoreHistory;
    editable: boolean;
}
const GamePlayerScoresHistoryTableRow = ({ playerScoreHistory, editable }: GamePlayerScoresTableProps) => {
    return playerScoreHistory ? (
        <View style={[sharedMobileStyles.plainRow]} key={playerScoreHistory.key}>
            {
                playerScoreHistory.scores.length ?
                    playerScoreHistory.scores.map((s, i) => (
                        <GamePlayerScoresTableScoreCell
                            score={s}
                            scoreIndex={i}
                            playerKey={playerScoreHistory.playerKey}
                            key={`${playerScoreHistory.key}-${s}-${i}`}
                            editable={editable}
                        />
                    )) : <View style={[sharedMobileStyles.scoreTabelTopCell]}></View>
            }
        </View>
    ) : null;
}

export default GamePlayerScoresHistoryTableRow;
