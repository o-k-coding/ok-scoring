import { useActionSheet } from '@expo/react-native-action-sheet';
import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Player } from '@ok-scoring/data/game-models';
import { gameContext } from '@ok-scoring/features/game-ui-store';
import { colors, sharedMobileStyles } from '@ok-scoring/styles';
import { truncateString } from '@ok-scoring/components/react/hooks';

type GamePlayerScoresTablePlayerCellProps = {
    selectable: boolean;
    player: Player;
    active: boolean;
    winning: boolean;
    isDealer: boolean;
}

const GamePlayerScoresTablePlayerCell = ({
    selectable,
    player,
    active,
    winning,
    isDealer,
}: GamePlayerScoresTablePlayerCellProps) => {
    const { setActivePlayer, deletePlayer } = useContext(gameContext);
    const displayName = truncateString(player.name, 14);
    const { showActionSheetWithOptions } = useActionSheet();

    const showActionSheetForPlayer = () => showActionSheetWithOptions({
        options: ['Delete', 'Cancel'],
        tintColor: colors.primary,
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        destructiveColor: colors.tertiary
    }, (buttonIndex) => {
        if (buttonIndex === 0) {
            deletePlayer(player.key);
        }
    })

    return (
        <View key={player.key}>
            {
                selectable ?
                    <TouchableOpacity onPress={() => setActivePlayer(player)} onLongPress={showActionSheetForPlayer}
                        style={[active ? sharedMobileStyles.editingCell : sharedMobileStyles.touchableCell, sharedMobileStyles.scoreTabelTopCellPlayer, { display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={[{
                            fontFamily: 'Quicksand',
                            fontSize: 18
                        }]}>
                            {displayName}
                        </Text>
                        {winning && <MaterialCommunityIcons
                            name={'crown'} size={18}
                            style={sharedMobileStyles.ml5}
                            color={winning ? colors.tertiary : colors.white} />}
                        {isDealer && <MaterialCommunityIcons
                            name={'cards'} size={18}
                            style={sharedMobileStyles.ml5}
                            color={isDealer ? colors.tertiary : colors.white} />}
                    </TouchableOpacity> :
                    <Text style={[sharedMobileStyles.scoreTabelTopCell]}>
                        {displayName}
                    </Text>
            }
        </View>
    )
}

export default GamePlayerScoresTablePlayerCell;
