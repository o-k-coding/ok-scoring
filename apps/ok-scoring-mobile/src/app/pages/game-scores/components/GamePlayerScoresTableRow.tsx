import { abbreviateNumber } from '@ok-scoring/components/react/hooks';
import { IconButton } from '@ok-scoring/components/react/mobile';
import { Player, GameScoreHistory } from '@ok-scoring/features/game-models';
import { sharedMobileStyles } from '@ok-scoring/styles';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import GamePlayerScoresHistoryTableRow from './GamePlayerScoresHistoryTableRow';
import GamePlayerScoresTablePlayerCell from './GamePlayerScoresTablePlayerCell';

type GamePlayerScoresTableRowProps = {
    player: Player;
    active: boolean;
    winning: boolean;
    editable: boolean;
    selectable: boolean;
    scoreHistory: GameScoreHistory;
    scoreHistoryRounds: number[];
    isDealer: boolean;
};

const GamePlayerScoresTableRow = ({
    player,
    active,
    winning,
    editable,
    selectable,
    scoreHistory,
    scoreHistoryRounds,
    isDealer,
}: GamePlayerScoresTableRowProps) => {
    const [roundsShown, setRoundsShown] = useState(false);
    const currentScore = abbreviateNumber(scoreHistory[player.key]?.currentScore);
    return (
        <>
            <View style={[sharedMobileStyles.spacedRowNoBorder]} key={player.key}>
                <GamePlayerScoresTablePlayerCell
                    selectable={selectable}
                    player={player}
                    active={active}
                    winning={winning}
                    isDealer={isDealer}
                />
                <View style={[sharedMobileStyles.scoreTabelTopCell, { display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                    <IconButton
                        icon={roundsShown ? 'chevron-up' : 'chevron-down'}
                        iconSide='right'
                        title={` ${currentScore} pts`}
                        clickHandler={() => { setRoundsShown(!roundsShown); }}
                    ></IconButton>
                </View>
            </View>
            {
                roundsShown ?
                    <ScrollView
                        horizontal={true}
                        style={[sharedMobileStyles.mb10, sharedMobileStyles.ml10]}
                    >
                        <View style={[sharedMobileStyles.column]}>
                            <View style={[sharedMobileStyles.plainRowBordered]}>
                                {scoreHistoryRounds.map((r) => (
                                    <Text
                                        style={[
                                            sharedMobileStyles.scoreTabelTopCell,
                                            sharedMobileStyles.centeredText,
                                        ]}
                                        key={r}
                                    >
                                        {r}
                                    </Text>
                                ))}
                            </View>
                            <GamePlayerScoresHistoryTableRow
                                editable={editable}
                                playerScoreHistory={scoreHistory[player.key]}
                                key={player.key}
                            />
                        </View>
                    </ScrollView> : null
            }
        </>
    );
};

export default GamePlayerScoresTableRow;
