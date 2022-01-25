import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { IconButton } from '@ok-scoring/components/react/mobile';
import { Player } from '@ok-scoring/data/game-models';
import { playerHistoryContext, gameContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles, colors } from '@ok-scoring/styles';

interface PlayerListItemProps {
    player: Player,
    onDeletePlayer: (playerKey: string) => void
    onShiftPlayer: (playerKey: string, direction: 1 | -1) => void
}

const PlayerListItem = ({ player, onDeletePlayer, onShiftPlayer }: PlayerListItemProps) => {
    const { toggleFavoriteForPlayer } = useContext(playerHistoryContext);
    const { addOrReplacePlayer, hasDealerSettings, setDealer, clearDealer, isDealer } = useContext(gameContext);

    const playerIsDealer = isDealer(player?.key);

    const toggleFavorite = () => {
        toggleFavoriteForPlayer(player);
        addOrReplacePlayer({ ...player, favorite: !player.favorite });
    }
    return (
        <View style={sharedMobileStyles.spacedRowBordered}>
            <View style={sharedMobileStyles.rowGroup}>
                <IconButton icon="trash-can-outline" color={colors.tertiary} clickHandler={() => onDeletePlayer(player.key)} />
                <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.ml5]} >{player.name}</Text>
                <IconButton size={28} clickHandler={toggleFavorite} icon={player.favorite ? 'star' : 'star-outline'} />
                {
                    hasDealerSettings &&
                    <IconButton
                        size={28}
                        clickHandler={() => playerIsDealer ? clearDealer() : setDealer(player?.key)}
                        icon={playerIsDealer ? 'cards' : 'cards-outline'}
                    />
                }
            </View>
            <View>
                <IconButton icon="chevron-up" size={28} clickHandler={() => onShiftPlayer(player.key, -1)} />
                <IconButton icon="chevron-down" size={28} clickHandler={() => onShiftPlayer(player.key, 1)} />
            </View>
        </View>
    );
}

export default observer(PlayerListItem);
