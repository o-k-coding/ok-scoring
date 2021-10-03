// import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton } from '@ok-scoring/components/react/mobile';
import { Player, PlayerScoreHistory } from '@ok-scoring/features/game-models';
import { playerHistoryContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles, colors } from '@ok-scoring/styles';
import { useContext } from 'react';
import { Text, View } from 'react-native';

interface GameScoreListItemProps {
    player: Player;
    playerScoreHistory: PlayerScoreHistory;
    winning: boolean;
    playerUpdated: (p: Player) => void;
}
const GameScoreListItem = ({ player, playerScoreHistory, winning, playerUpdated }: GameScoreListItemProps) => {
    const { toggleFavoriteForPlayer } = useContext(playerHistoryContext);

    const toggleFavorite = () => {
        const newPlayer = toggleFavoriteForPlayer(player);
        playerUpdated(newPlayer);
    }
    return (
        <View style={sharedMobileStyles.spacedRowNoBorder} key={player.key}>
            <View style={sharedMobileStyles.rowGroup}>
                <IconButton size={28} clickHandler={toggleFavorite} icon={player.favorite ? 'star' : 'star-outline'} />
                <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.mr5]}>{player.name}</Text>
                {/* {
                    winning && <MaterialCommunityIcons name='crown' size={28} color={colors.tertiary} />
                } */}
            </View>
            <View>
                <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.ml5]}>{playerScoreHistory?.currentScore ?? 0} points</Text>
            </View>
        </View>
    );
}

export default GameScoreListItem;
