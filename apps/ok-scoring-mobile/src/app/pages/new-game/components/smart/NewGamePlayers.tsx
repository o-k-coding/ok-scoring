import React, { useContext } from 'react';
import { Text, FlatList } from 'react-native';
import { observer } from 'mobx-react';
import PlayerListItem from '../dumb/PlayerListItem';
import AddPlayer from '../dumb/AddPlayer';
import { playerHistoryContext, gameContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles } from '@ok-scoring/styles';

const NewGamePlayers = () => {
    const { favoritePlayers } = useContext(playerHistoryContext);
    const { players, addOrReplacePlayer, deletePlayer, shiftPlayer } = useContext(gameContext);
    return (
        <>
            <AddPlayer onAddPlayer={addOrReplacePlayer} selectablePlayers={favoritePlayers} />
            <FlatList
                style={sharedMobileStyles.scroll}
                data={players}
                ListEmptyComponent={
                    <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.centeredText, sharedMobileStyles.mt25]}>Add Players To Get Started!</Text>
                }
                renderItem={
                    (itemData) =>
                        <PlayerListItem player={itemData.item} onDeletePlayer={deletePlayer} onShiftPlayer={shiftPlayer} />
                }
            />
        </>
    )
}

export default observer(NewGamePlayers);
