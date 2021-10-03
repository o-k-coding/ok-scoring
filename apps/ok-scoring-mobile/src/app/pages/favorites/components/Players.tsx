import { observer } from 'mobx-react'
import React, { useContext } from 'react'
import { FlatList, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FavoritesRoute, PageNavigationProps } from '../../../navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton, NavBar, TabIcons } from '@ok-scoring/components/react/mobile';
import { Player } from '@ok-scoring/features/game-models';
import { playerHistoryContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles } from '@ok-scoring/styles';

const Players = ({ navigation }: PageNavigationProps<typeof FavoritesRoute>) => {
    const { playersList, toggleFavoriteForPlayer, favoritesSort, setFavoriteSort } = useContext(playerHistoryContext);

    const toggleFavorite = (player: Player) => {
        toggleFavoriteForPlayer(player);
    }
    return (
        <SafeAreaView style={sharedMobileStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: navigation.pop }}
                rightButton={{ icon: favoritesSort.asc ? 'sort-descending' : 'sort-ascending', title: 'Sort Favorites', clickHandler: () => setFavoriteSort({ ...favoritesSort, asc: !favoritesSort.asc }) }}
            />
            <FlatList
                style={[sharedMobileStyles.scroll, sharedMobileStyles.mb25]}
                data={playersList}
                renderItem={
                    ({ item: player }) =>
                        <TouchableOpacity onPress={() => toggleFavorite(player)}>
                            <View style={sharedMobileStyles.spacedRowNoBorder} key={player.key}>
                                <View style={sharedMobileStyles.rowGroup}>
                                    <IconButton size={28} clickHandler={() => toggleFavorite(player)} icon={player.favorite ? 'star' : 'star-outline'} />
                                    <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.mr5]}>{player.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                }
            />
        </SafeAreaView>
    );
}

export const TabNavIcons: TabIcons = { active: 'account', inactive: 'account-outline', };
export default observer(Players);
