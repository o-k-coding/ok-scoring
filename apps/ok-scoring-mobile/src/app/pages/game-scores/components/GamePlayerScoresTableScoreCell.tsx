import React, { useContext, useEffect, useState } from 'react'
import { Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { sharedMobileStyles } from '../../../styles/shared';
import { gameContext } from '../../../state/game.store';
import { connectActionSheet, useActionSheet } from '@expo/react-native-action-sheet';
import { colors } from '../../../styles/colors';
import { abbreviateNumber } from '../../../hooks/abbreviateNumber';

type GamePlayerScoresTableScoreCellProps = {
    playerKey: string;
    scoreIndex: number;
    score: number;
    editable: boolean;
}

const GamePlayerScoresTableScoreCell = ({ playerKey, score, scoreIndex, editable }: GamePlayerScoresTableScoreCellProps) => {
    const { editPlayerScore, deletePlayerScore, editingPlayerScore } = useContext(gameContext);

    const [isBeingEdited, setIsBeingEdited] = useState(false);

    useEffect(() => {
        const cellIsBeingEdited = editingPlayerScore?.player?.key === playerKey && editingPlayerScore?.scoreIndex === scoreIndex;
        setIsBeingEdited(cellIsBeingEdited);
    }, [editingPlayerScore]);

    const { showActionSheetWithOptions } = useActionSheet();

    const displayScore = abbreviateNumber(score);

    return (
        editable ? <TouchableOpacity onPress={() => showActionSheetWithOptions({
            options: ['Edit', 'Delete', 'Cancel'],
            tintColor: colors.primary,
            cancelButtonIndex: 2,
            destructiveButtonIndex: 1,
            destructiveColor: colors.tertiary
        }, (buttonIndex) => {
            if (buttonIndex === 0) {
                editPlayerScore({ playerKey, score, scoreIndex });
            } else if (buttonIndex === 1) {
                deletePlayerScore({ playerKey, scoreIndex });
            }
        })}>
            <Text style={[sharedMobileStyles.scoreTabelTopCell, isBeingEdited ? sharedMobileStyles.editingCell : sharedMobileStyles.touchableCell, sharedMobileStyles.centeredText]}>
                {displayScore}
            </Text>
        </TouchableOpacity> :
            <Text style={[sharedMobileStyles.scoreTabelTopCell, sharedMobileStyles.centeredText]}>{displayScore}</Text>
    );
}

export default connectActionSheet(GamePlayerScoresTableScoreCell);