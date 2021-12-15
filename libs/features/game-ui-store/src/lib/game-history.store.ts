import { createContext } from 'react';
import { observable, action, computed, reaction, toJS, makeObservable } from 'mobx';
import { localDbStore } from './local-db.store';
import { favoriteGamesStore } from './favorite-games.store';
import { playerHistoryStore } from './players-history.store';
import { addOrReplaceByKey, commaSeperateWithEllipsis, removeByKey, sort, Sort } from '@ok-scoring/utils/array-fns';
import { GameScoreHistory, Player } from '@ok-scoring/features/game-models';
import { deleteGame, fetchGameStates, insertGame } from '@ok-scoring/data/sqlite-fns';
import { generateUuid } from '@ok-scoring/data/generate-uuid';
import { UIGameState } from '..';

export interface GamesListItem {
    description: string;
    favorite: boolean;
}

class GameHistoryStore {

    @observable sort: Sort<UIGameState> = { sortProp: 'date', asc: false };
    @observable favoritesSort: Sort<GamesListItem> = { sortProp: 'favorite', asc: false };
    @observable gameHistory: UIGameState[] = [];
    @observable gameState?: UIGameState;
    @observable gamesList: GamesListItem[] = [];

    constructor() {
        makeObservable(this);
        reaction(() => this.sort, () => this.sortAndSetGameHistory([...this.gameHistory]));
        reaction(() => this.favoritesSort, () => this.sortAndSetFavoriteGames(
            this.gamesList.slice()
        ));
        reaction(() => this.gameHistory, () => {
            this.sortAndSetFavoriteGames(
                this.buildGamesList(this.gameHistory, favoriteGamesStore.favoriteGames),
            );
        });
        reaction(() => favoriteGamesStore.favoriteGames, () => this.sortAndSetFavoriteGames(
            this.buildGamesList(this.gameHistory, favoriteGamesStore.favoriteGames),
        ));
        reaction(() => playerHistoryStore.favoritePlayers, (favoritePlayers) => {
            this.sortAndSetGameHistory(
                this.setPlayerFavorites(favoritePlayers)
            );
        });
    }

    @computed
    get scoreHistoryRounds(): number[] {
        // TODO memo?
        return buildScoreHistoryRounds(this.gameState?.scoreHistoryMap ?? {});
    }

    buildGamesList = (gameHistory: UIGameState[], favorites: { key: string, description: string }[]) => {
        const uniqueNonFavoriteGames: GamesListItem[] = this.getUniqueGames(gameHistory)
            .reduce((acc: GamesListItem[], g) => {
                if (!favorites.some(f => f.description === g.description)) {
                    acc.push({ description: g.description, favorite: false });
                }
                return acc;
            }, []);
        favorites.forEach(f => uniqueNonFavoriteGames.push({ description: f.description, favorite: true }));
        return uniqueNonFavoriteGames;
    }

    setFavorites = (gameHistory: UIGameState[], favorites: { key: string, description: string }[]) => {
        return gameHistory.map(g => ({
            ...g,
            favorite: favorites.some(f => f.description === g.description)
        }));
    }

    @action loadGames = async () => {
        if (localDbStore.dbInitialized) {
            try {
                const games: UIGameState[] = await fetchGameStates();
                if (games?.length) {
                    this.sortAndSetGameHistory(
                        games.map(g => this.hydrateGameStateForHistory(g))
                    );
                }
            } catch (e) {
                console.error('Error loading games from local db', e);
            }
        }
    }

    @action setGameState = (gameState?: UIGameState) => {
        this.gameState = gameState;
    }

    @action setHistorySort = (sort: Sort<UIGameState>) => {
        this.sort = sort;
    }

    @action setFavoriteSort = (sort: Sort<GamesListItem>) => {
        this.favoritesSort = sort;
    }

    @action sortAndSetFavoriteGames = (gameList: GamesListItem[]) => {
        const sortedList = sort(gameList, this.favoritesSort)
        this.gamesList = sortedList;
    }

    @action sortAndSetGameHistory = (gameHistory: UIGameState[]) => {
        this.gameHistory = sort(gameHistory, this.sort)
    }

    @action replaceGameState = (gameState: UIGameState) => {
        if (this.gameHistory) {
            this.gameHistory = addOrReplaceByKey(this.gameHistory, gameState);
        }
    }

    @action
    addOrReplacePlayer = (player: Player) => {
        if (player && this.gameState) {
            // TODO maybe I could use an actual game store for the game state here.... something to think about? non singleton stores
            const players = addOrReplaceByKey(this.gameState.players, player);
            this.gameState = {
                ...this.gameState,
                players,
            };
            this.replaceGameState(this.gameState)
        }
    };

    @action
    setPlayerFavorites = (favoritePlayers: Player[]): UIGameState[] => {
        return this.gameHistory.map(g => {
            const players = g.players.map(p => ({
                ...p,
                favorite: favoritePlayers?.some(f => f.key === p.key)
            }));
            return {
                ...g,
                players
            };
        });
    };

    async saveGameToDb(gameState: UIGameState) {
        try {
            await insertGame(gameState, () => generateUuid());
        } catch (e) {
            console.error('Error saving game to local db', e);
        }
    }

    async deleteGameFromDb(gameKey: string) {
        try {
            deleteGame(gameKey);
        } catch (e) {
            console.error('Error saving game to local db', e);
        }
    }

    saveGame = (gameState: UIGameState) => {
        gameState = this.hydrateGameStateForHistory(gameState);
        const gameHistory = addOrReplaceByKey(this.gameHistory, gameState);
        this.sortAndSetGameHistory(gameHistory);
        console.log('save game!', toJS(gameState));
        this.saveGameToDb(gameState);
    }

    deleteGame = (gameKey: string) => {
        const gameHistory = removeByKey(this.gameHistory, gameKey);
        this.sortAndSetGameHistory(gameHistory);
        this.deleteGameFromDb(gameKey);
    }

    hydrateGameStateForHistory(gameState: UIGameState): UIGameState {
        gameState = this.sortGameStatePlayersByScore(gameState);
        gameState = this.setPlayerNamesForDisplay(gameState);
        gameState.duration = new Date().getTime() - gameState.date;
        return gameState;
    }

    sortGameStatePlayersByScore(gameState: UIGameState): UIGameState {
        gameState.players = gameState?.players?.sort((playerA, playerB) => {
            const { score: scoreA } = gameState.scoreHistoryMap[playerA.key];
            const { score: scoreB } = gameState.scoreHistoryMap[playerB.key];
            return scoreB - scoreA;
        });
        return gameState;
    }

    setPlayerNamesForDisplay(gameState: UIGameState): UIGameState {
        const playerNames = gameState.players.map(p => p.name);
        gameState.playerNamesForDisplay = commaSeperateWithEllipsis(playerNames);
        return gameState;
    }

    getUniqueGames(gameHistory: UIGameState[]): UIGameState[] {
        return gameHistory.reduce(
            (acc: { games: UIGameState[], descriptions: { [k: string]: number } }, game) => {
                if (!acc.descriptions[game.description]) {
                    acc.games.push(game);
                    acc.descriptions[game.description] = 1
                }
                return acc;
            }, { games: [], descriptions: {} }).games;
    }
}

export const gameHistoryStore = new GameHistoryStore();
export const gameHistoryContext = createContext(gameHistoryStore);
function buildScoreHistoryRounds(arg0: GameScoreHistory): number[] {
    throw new Error('Function not implemented.');
}
