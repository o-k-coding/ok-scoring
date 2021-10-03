import { createContext } from 'react';
import { action, observable, computed, reaction } from 'mobx';
import { GameState, Player, GameScoreHistory, PlayerScore, Settings, DealerSettings, PlayerScoreMode, DealerSettingsText } from '@ok-scoring/features/game-models';
import { addOrReplaceByKey, swap } from '@ok-scoring/utils/array-fns';
import { favoriteGamesStore } from './favorite-games.store';
import { playerHistoryStore } from './players-history.store';

import { buildInitialHistory, buildScoreHistoryRounds, determineWinner, reCalcCurrentScore } from '@ok-scoring/features/game-rules-fns';
import { generateUuid } from '@ok-scoring/data/generate-uuid';

export interface RadioItem {
    onPress: () => void;
    text: string;
    selected: boolean;
}

class GameStore implements GameState {
    key = generateUuid();
    date = 0;
    duration = 0;

    // TODO add a dealer functionality
    // Observable props
    @observable
    description = '';
    @observable
    favorite?: boolean;
    @observable
    winningPlayerKey?: string;
    @observable
    dealingPlayerKey?: string;
    @observable
    winningPlayerName?: string;
    @observable
    settings: Settings = {
        key: generateUuid(),
        // rounds: undefined,
        startingScore: 0,
        defaultScoreStep: 0,
        highScoreWins: true,
        // scoreIncreases: true
    };
    @observable
    players: Player[] = [];
    @observable
    scoreHistory: GameScoreHistory = {};

    @observable
    activePlayerScore?: PlayerScore;
    @observable
    editingPlayerScore?: PlayerScore;

    constructor() {
        reaction(() => this.activePlayerScore, () => {
            this.setWinningPlayerKey(determineWinner(this.scoreHistory, this.settings.highScoreWins));
        });
        reaction(() => favoriteGamesStore.favoriteGames, () => this.setFavorite(favoriteGamesStore.favoriteGames.slice()));
    }

    @computed
    get canSetDealer(): boolean {
        return this.settings?.dealerSettings === DealerSettings.Manual;
    }

    @computed
    get playerScoreMode(): PlayerScoreMode {
        return !!this.editingPlayerScore ? PlayerScoreMode.Editing : PlayerScoreMode.Current;
    }

    @computed
    get activeGamePlayerScore(): PlayerScore | undefined {
        console.log('computing active player');
        return !!this.editingPlayerScore ? this.editingPlayerScore : this.activePlayerScore;
    }

    @computed
    get gameCanStart() {
        return this.players.length && !!this.description;
    }

    @computed
    get gameState(): GameState {
        return {
            key: this.key,
            description: this.description,
            scoreHistory: this.scoreHistory,
            date: this.date,
            players: this.players,
            settings: this.settings,
            winningPlayerKey: this.winningPlayerKey,
            dealingPlayerKey: this.dealingPlayerKey,
            favorite: this.favorite
        };
    }

    @computed
    get scoreHistoryRounds(): number[] {
        // TODO memo?
        return buildScoreHistoryRounds(this.scoreHistory);
    }

    @computed
    get hasDealerSettings(): boolean {
        return !!this.settings?.dealerSettings;
    }

    @computed
    get dealerSettingsItems(): RadioItem[] {
        return [undefined, ...Object.values(DealerSettings)].map(s => ({
            text: !s ? 'None' : DealerSettingsText[s],
            selected: this.settings.dealerSettings === s,
            onPress: () => this.setSetting('dealerSettings', s),
        }));
    }

    @action
    setDealer = (playerKey: string) => {
        if (!!playerKey && this.hasDealerSettings) {
            console.log('setting dealer', playerKey);
            this.dealingPlayerKey = playerKey;
        }
    }

    @action
    clearDealer = () => {
        this.dealingPlayerKey = undefined;
    }


    @action
    setWinningPlayerKey = (key?: string) => {
        this.winningPlayerKey = key;
        const winningPlayer = this.players.find(p => p.key === key);
        this.winningPlayerName = winningPlayer?.name;
    }

    @action
    initGameState = (gameState?: GameState) => {
        this.key = gameState?.key ?? generateUuid();
        this.description = gameState?.description ?? '';
        this.scoreHistory = gameState?.scoreHistory ?? {};
        this.date = gameState?.date ?? new Date().getTime();
        this.players = gameState?.players ?? [];
        this.favorite = gameState?.favorite ?? false;
        this.settings = gameState?.settings ?? {
            key: generateUuid(),
            gameKey: this.key,
            // rounds: undefined;
            startingScore: 0,
            defaultScoreStep: 0,
            highScoreWins: true,
            // scoreIncreases: true
        };
        this.setWinningPlayerKey(undefined);
    }

    @action
    setGameDescription = (description: string) => {
        this.description = description;
    }

    @action
    setSetting = <K extends keyof Settings, T extends Settings[K]>(key: K, setting: T) => {
        this.settings = { ...this.settings, [key]: setting };
    }

    // Player related functionality, consider moving all of this out to player state...

    @action
    addOrReplacePlayer = (player: Player) => {
        if (!player?.name || !this.players) {
            return;
        }
        if (!player.key) {
            // If the user is entering a new player name that matches an existing player name exactly, just use that
            const existingPlayer = playerHistoryStore.getPlayerByName(player.name);
            player = existingPlayer ?? { ...player, key: generateUuid() };
        }
        // Don't add a player that already is in the game
        if (this.players.some(p => p.key === player.key)) {
            return;
        }
        this.players = addOrReplaceByKey(this.players, player);
        // TODO handle updating score history if player does not exist?
    };

    @action
    deletePlayer = (playerKey: string) => {
        if (playerKey && this.gameState && this.players) {
            this.players = this.players.filter(p => p.key !== playerKey);
            delete this.scoreHistory[playerKey];
        }
        if (this.activePlayerScore?.player.key === playerKey) {
            this.changeActivePlayer(1, this.players)
        }
    }

    @action
    shiftPlayer = (playerKey: string, direction: 1 | -1) => {
        if (playerKey && this.players) {
            const playerIndex = this.players.findIndex(p => p.key === playerKey);
            let newIndex = playerIndex + direction;
            if (newIndex < 0) {
                newIndex = this.players.length - 1;
            } else if (newIndex >= this.players.length) {
                newIndex = 0;
            }
            this.players = swap(this.players, playerIndex, newIndex);
        }
    }

    // End Player functionality

    @action
    copyGameSetup = (players: Player[], settings: Settings, description: string) => {
        this.initGameState({
            key: generateUuid(),
            description,
            scoreHistory: {},
            date: new Date().getTime(),
            players,
            settings
        });
    }

    @action
    updateRoundScore = (playerKey: string, roundIndex: number, newScore: number) => {
        if (this.scoreHistory && this.scoreHistory.hasOwnProperty(playerKey)) {
            this.scoreHistory[playerKey].scores.splice(roundIndex, 1, newScore);
            this.scoreHistory[playerKey] = reCalcCurrentScore(this.scoreHistory[playerKey]);
            this.editingPlayerScore = undefined;
        }
    };

    @action
    endPlayerTurn = (turnScore: number = 0, gamePlayers: Player[]) => {
        if (this.scoreHistory && this.activePlayerScore) {
            const { playerScore, player } = this.activePlayerScore;
            playerScore.scores.push(turnScore);
            playerScore.currentScore += (turnScore);
            this.scoreHistory[player.key] = playerScore;
            this.changeActivePlayer(1, gamePlayers);
            if (this.settings?.dealerSettings === DealerSettings.NewPerRound &&
                this.fullRoundComplete(this.scoreHistory)
            ) {
                const dealerIndex = this.players.findIndex(p => p.key === this.dealingPlayerKey);
                const newDealer = this.getNextPlayer(1, dealerIndex, this.players);
                this.setDealer(newDealer.key);
            }
        }
    }

    @action
    setActivePlayer = (player: Player) => {
        console.log('setting active player');
        if (player?.key !== this.activePlayerScore?.player?.key) {
            this.activePlayerScore = this.createPlayerScore(player);
        }
    }

    @action
    cancelEditPlayerScore = () => {
        this.editingPlayerScore = undefined;
    }

    @action
    editPlayerScore = (data: {
        playerKey: string;
        scoreIndex: number;
        score: number;
    }) => {
        const player = this.players.find(p => p.key === data.playerKey);
        if (player) {
            this.editingPlayerScore = this.createPlayerScore(player, data.scoreIndex);
        }
    }

    @action
    deletePlayerScore = ({ playerKey, scoreIndex }: { playerKey: string, scoreIndex: number }) => {
        if (this.scoreHistory) {
            this.scoreHistory[playerKey].scores.splice(scoreIndex, 1);
            this.scoreHistory[playerKey] = reCalcCurrentScore(this.scoreHistory[playerKey]);
            if (this.activePlayerScore?.player.key === playerKey && this.activePlayerScore.scoreIndex >= scoreIndex) {
                this.activePlayerScore = { ...this.activePlayerScore, scoreIndex: this.activePlayerScore.scoreIndex - 1 }
            }
        }
    }

    @action
    startGame = () => {
        if (!Object.keys(this.scoreHistory ?? {}).length && this.players?.length) {
            this.scoreHistory = buildInitialHistory(
                this.players ?? [],
                this.settings?.startingScore ?? 0
            );
        }
        this.date = new Date().getTime();
        this.setActivePlayer(this.players[0]);
    }

    @action
    setFavorite = (favorites: { key: string, description: string }[]) => {
        this.favorite = favorites.some(f => f.description === this.description);
    }

    changeActivePlayer = (n: 1 | -1, gamePlayers: Player[]) => {
        if (this.scoreHistory && this.activePlayerScore) {
            const { playerIndex } = this.activePlayerScore;
            const player = this.getNextPlayer(n, playerIndex, gamePlayers);
            this.setActivePlayer(player);
        }
    }

    getNextPlayer = (n: 1 | -1, playerIndex: number, gamePlayers: Player[]): Player => {
        let newIndex = playerIndex + n;
        if (newIndex >= gamePlayers.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = gamePlayers.length - 1;
        }
        return gamePlayers[newIndex];
    }

    createPlayerScore = (player: Player, round?: number) => {
        if (player) {
            const playerIndex = this.players.findIndex(p => p.key === player.key);
            const playerScore = this.scoreHistory[player.key];
            const roundIndex = round !== undefined ?
                round :
                playerScore.scores.length ?? 0;
            let roundScore = this.settings.defaultScoreStep || 0;
            if (round !== undefined) {
                roundScore = playerScore?.scores[round];
            }
            return {
                playerScore,
                player,
                playerIndex,
                scoreIndex: roundIndex,
                score: roundScore,
            };
        }
    }

    isDealer = (playerKey?: string): boolean => {
        return !!this.dealingPlayerKey && this.dealingPlayerKey === playerKey;
    }

    fullRoundComplete = (scoreHistory: GameScoreHistory) => {
        const roundsCompleted = new Set<number>();
        for (let playerKey in scoreHistory) {
            if (roundsCompleted.size > 1) {
                return false;
            }
            const playerScoreHistory = scoreHistory[playerKey];
            const playerRoundsCompleted = playerScoreHistory.scores.length;
            if (playerRoundsCompleted > 0) {
                roundsCompleted.add(playerRoundsCompleted);
            }
        }
        return roundsCompleted.size === 1;
    }
}

export const gameStore = new GameStore();
export const gameContext = createContext(gameStore);