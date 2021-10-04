import React, { useContext, useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { connectActionSheet, useActionSheet } from '@expo/react-native-action-sheet';
import { abbreviateNumber } from '@ok-scoring/components/react/hooks';
import { gameContext } from '@ok-scoring/features/game-ui-store';
import { colors, sharedMobileStyles } from '@ok-scoring/styles';

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

    const showActionSheet = () => showActionSheetWithOptions({
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
    })

    const displayScore = abbreviateNumber(score);

    return (
        true ? <Pressable onPress={showActionSheet}>
            <Text style={[sharedMobileStyles.scoreTabelTopCell, isBeingEdited ? sharedMobileStyles.editingCell : sharedMobileStyles.touchableCell, sharedMobileStyles.centeredText]}>
                {displayScore}
            </Text>
        </Pressable> :
            <Text style={[sharedMobileStyles.scoreTabelTopCell, sharedMobileStyles.centeredText]}>{displayScore}</Text>
    );
}

export default connectActionSheet(GamePlayerScoresTableScoreCell);
