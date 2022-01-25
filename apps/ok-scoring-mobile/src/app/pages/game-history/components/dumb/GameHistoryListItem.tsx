import React, { useEffect, useRef } from 'react'
import { Animated, Text, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDiceIcon, formatDate } from '@ok-scoring/components/react/hooks';
import { IconButton, MatIcons } from '@ok-scoring/components/react/mobile';
import { GameState, Player, Settings } from '@ok-scoring/data/game-models';
import { sharedMobileStyles, colors } from '@ok-scoring/styles';
import { Sort } from '@ok-scoring/utils/array-fns';


interface GameHistoryListItemProps {
    index: number;
    game: GameState;
    sort: Sort<GameState>;
    copyGameSetup: (players: Player[], settings: Settings, description: string) => void;
    continueGame: (game: GameState) => void;
    showGameState: (gameState: GameState) => void;
    deleteGame: (gameKey: string) => void
};

const GameHistoryListItem = ({ sort, index, game, copyGameSetup, continueGame, showGameState, deleteGame }: GameHistoryListItemProps) => {
    // TODO set state score history and navigate
    const diceIcon = useDiceIcon<MatIcons>();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const formattedDate = formatDate(game.date);
    // get the winning player to the front of the list
    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 350 * (index + 1),
            useNativeDriver: true
        }).start();
    }, [game, sort]);

    return (
        <Animated.View
            style={[
                sharedMobileStyles.spacedRowBordered,
                { opacity: fadeAnim },
            ]}
        >
            <View style={sharedMobileStyles.column}>
                <View style={sharedMobileStyles.plainRow}>
                    <Text style={[sharedMobileStyles.ml5, sharedMobileStyles.subHeaderText]}>
                        {game.description}
                    </Text>
                </View>
                <View style={sharedMobileStyles.plainRow}>
                    <MaterialCommunityIcons name='calendar-outline' size={28} color={colors.tertiary} />
                    <Text style={[sharedMobileStyles.ml5, sharedMobileStyles.subHeaderText]}>
                        {formattedDate}
                    </Text>
                </View>
                <View style={[sharedMobileStyles.plainRow]}>
                    <MaterialCommunityIcons name='crown' size={18} color={colors.tertiary} />
                    <Text style={[sharedMobileStyles.ml5, sharedMobileStyles.bodyText]}>
                        {game.playerNamesForDisplay}
                    </Text>
                </View>
                <View style={[sharedMobileStyles.ml20, sharedMobileStyles.plainRow]}>
                    <IconButton icon='replay' title='Copy Game Setup' clickHandler={() => copyGameSetup(game.players, game.settings as Settings, game.description)} color={colors.primary} />
                </View>
                <View style={[sharedMobileStyles.ml20, sharedMobileStyles.plainRow]}>
                    <IconButton icon={diceIcon} title='Continue Game' clickHandler={() => continueGame(game)} color={colors.primary} />
                </View>
                <View style={[sharedMobileStyles.ml20, sharedMobileStyles.plainRow]}>
                    <IconButton icon='book' title='View Scores' clickHandler={() => showGameState(game)} />
                </View>
                <View style={[sharedMobileStyles.ml20, sharedMobileStyles.plainRow]}>
                    <IconButton icon='delete' title='Delete Game' clickHandler={() => deleteGame(game.key)} color={colors.tertiary} />
                </View>
            </View>
        </Animated.View>
    )
}

export default GameHistoryListItem;
