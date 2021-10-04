import { TabIcons, IconButton, NavBar } from '@ok-scoring/components/react/mobile';
import { favoriteGamesContext, gameHistoryContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles } from '@ok-scoring/styles';
import { observer } from 'mobx-react'
import React, { useContext } from 'react'
import { FlatList, View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigateInRoot, NewGameRoute } from '../../../navigation'

const Games = () => {
    const { gamesList, favoritesSort, setFavoriteSort } = useContext(gameHistoryContext);
    const { toggleFavorite } = useContext(favoriteGamesContext);
    return (
        <SafeAreaView style={sharedMobileStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'chevron-left', title: 'Back', clickHandler: () => navigateInRoot(NewGameRoute) }}
                rightButton={{ icon: favoritesSort.asc ? 'sort-descending' : 'sort-ascending', title: 'Sort Favorites', clickHandler: () => setFavoriteSort({ ...favoritesSort, asc: !favoritesSort.asc }) }}
            />
            <FlatList
                style={[sharedMobileStyles.scroll, sharedMobileStyles.mb25]}
                data={gamesList}
                ListEmptyComponent={
                    <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.centeredText, sharedMobileStyles.mt25]}>No Games Favorited Yet!</Text>
                }
                renderItem={
                    ({ item: game }) =>
                        <TouchableOpacity onPress={() => toggleFavorite(game.description, !game.favorite)}>
                            <View style={sharedMobileStyles.spacedRowNoBorder} key={game.description}>
                                <View style={sharedMobileStyles.rowGroup}>
                                    <IconButton size={28} clickHandler={() => toggleFavorite(game.description, !game.favorite)} icon={game.favorite ? 'star' : 'star-outline'} />
                                    <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.mr5]}>{game.description}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                }
            />
        </SafeAreaView>
    );
}

// TODO I think I need to update expo to get these icons
// export const TabNavIcons = { active: 'dice-multiple', inactive: 'dice-multiple-outline'};
export const TabNavIcons: TabIcons = { active: 'cards', inactive: 'cards-outline' };
export default observer(Games);
