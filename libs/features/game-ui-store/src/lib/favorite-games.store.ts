import { action, observable } from 'mobx';
import { createContext } from 'react';
import { localDbStore } from './local-db.store';
import { deleteFavoriteGame, fetchFavoriteGames, insertFavoriteGame } from '@ok-scoring/data/sqlite-fns';
import { generateUuid } from '@ok-scoring/data/generate-uuid';

// TODO data loading probably doesn't belong here....
class FavoriteGamesStore {
    @observable
    favoriteGames: { key: string, description: string }[] = [];

    @action loadFavoriteGames = async () => {
        if (localDbStore.dbInitialized) {
            try {
                this.favoriteGames = await fetchFavoriteGames();
            } catch (e) {
                console.error('Error loading favorite games from local db', e);
            }
        }
    }

    @action
    toggleFavorite = async (description: string, favorite: boolean) => {
        try {
            if (favorite) {
                const favoriteGame = { key: generateUuid(), description };
                await insertFavoriteGame(favoriteGame);
                this.favoriteGames = [...this.favoriteGames, favoriteGame];
            } else {
                await deleteFavoriteGame(description);
                this.favoriteGames = this.favoriteGames.filter(g => g.description !== description);
            }
            return true;
        } catch (e) {
            console.error('Error saving favorite game!', e);
            return false;
        }
    }
}

export const favoriteGamesStore = new FavoriteGamesStore();
export const favoriteGamesContext = createContext(favoriteGamesStore);
