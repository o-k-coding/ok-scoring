import { createContext } from 'react';
import { action, observable, computed, reaction, makeObservable } from 'mobx';
import { GameState, Player, GameScoreHistory, PlayerScore, GameRules, DealerSettings, PlayerScoreMode, DealerSettingsText, ScoreRound } from '@ok-scoring/data/game-models';
import { addOrReplaceByKey, swap } from '@ok-scoring/utils/array-fns';
import { favoriteGamesStore } from './favorite-games.store';
import { playerHistoryStore } from './players-history.store';

import { determineWinner } from '@ok-scoring/features/game-rules-fns';
import { buildInitialHistory, buildScoreHistoryRounds, reCalcCurrentScore, recalcCurrentScoreRecursive } from '@ok-scoring/features/player-score-history-fns'
import { generateUuid } from '@ok-scoring/data/generate-uuid';

export interface RadioItem {
  onPress: () => void;
  text: string;
  selected: boolean;
}

export interface UIGameState extends GameState {
  players?: Player[];
  playerNamesForDisplay?: string;
  favorite?: boolean;
  scoreHistoryMap?: GameScoreHistory;
}

class GameStore implements UIGameState {
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
  rules: GameRules = {
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
  scoreHistoryMap: GameScoreHistory = {};

  @observable
  activePlayerScore?: PlayerScore;
  @observable
  editingPlayerScore?: PlayerScore;

  constructor() {
    makeObservable(this);
    reaction(() => this.activePlayerScore, () => {
      this.setWinningPlayerKey(determineWinner(this.scoreHistoryMap, this.rules.highScoreWins));
    });
    reaction(() => favoriteGamesStore.favoriteGames, () => this.setFavorite(favoriteGamesStore.favoriteGames.slice()));
  }

  @computed
  get canSetDealer(): boolean {
    return this.rules?.dealerSettings === DealerSettings.Manual;
  }

  @computed
  get playerScoreMode(): PlayerScoreMode {
    return this.editingPlayerScore ? PlayerScoreMode.Editing : PlayerScoreMode.Current;
  }

  @computed
  get activeGamePlayerScore(): PlayerScore | undefined {
    console.log('computing active player');
    return this.editingPlayerScore ? this.editingPlayerScore : this.activePlayerScore;
  }

  @computed
  get gameCanStart() {
    return this.players.length && !!this.description;
  }

  @computed
  get gameState(): UIGameState {
    return {
      key: this.key,
      description: this.description,
      scoreHistoryMap: this.scoreHistoryMap,
      date: this.date,
      players: this.players,
      rules: this.rules,
      winningPlayerKey: this.winningPlayerKey,
      dealingPlayerKey: this.dealingPlayerKey,
      favorite: this.favorite
    };
  }

  @computed
  get scoreHistoryRounds(): number[] {
    // TODO memo?
    return buildScoreHistoryRounds(this.scoreHistoryMap);
  }

  @computed
  get hasDealerSettings(): boolean {
    return !!this.rules?.dealerSettings;
  }

  @computed
  get dealerSettingsItems(): RadioItem[] {
    return [undefined, ...Object.values(DealerSettings)].map(s => ({
      text: !s ? 'None' : DealerSettingsText[s],
      selected: this.rules.dealerSettings === s,
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
  initGameState = (gameState?: UIGameState) => {
    this.key = gameState?.key ?? generateUuid();
    this.description = gameState?.description ?? '';
    this.scoreHistoryMap = gameState?.scoreHistoryMap ?? {};
    this.date = gameState?.date ?? new Date().getTime();
    this.players = gameState?.players ?? [];
    this.favorite = gameState?.favorite ?? false;
    this.rules = gameState?.rules ?? {
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
  setSetting = <K extends keyof GameRules, T extends GameRules[K]>(key: K, setting: T) => {
    this.rules = { ...this.rules, [key]: setting };
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
    this.players = addOrReplaceByKey(this.players, player);
    // TODO handle updating score history if player does not exist?
  };

  @action
  deletePlayer = (playerKey: string) => {
    if (playerKey && this.gameState && this.players) {
      this.players = this.players.filter(p => p.key !== playerKey);
      delete this.scoreHistoryMap[playerKey];
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
  copyGameSetup = (players: Player[], rules: GameRules, description: string) => {
    this.initGameState({
      key: generateUuid(),
      description,
      scoreHistoryMap: {},
      date: new Date().getTime(),
      players,
      rules
    });
  }

  @action
  updateRoundScore = (playerKey: string, roundIndex: number, newScore: ScoreRound) => {
    if (this.scoreHistoryMap && this.scoreHistoryMap.hasOwnProperty(playerKey)) {
      this.scoreHistoryMap[playerKey].scores.splice(roundIndex, 1, newScore);
      this.scoreHistoryMap[playerKey] = recalcCurrentScoreRecursive(this.scoreHistoryMap[playerKey]);
      this.editingPlayerScore = undefined;
    }
  };

  @action
  endPlayerTurn = (turnScore: ScoreRound, gamePlayers: Player[]) => {
    if (this.scoreHistoryMap && this.activePlayerScore) {
      const { playerScore, player } = this.activePlayerScore;
      playerScore.scores.push(turnScore);
      this.scoreHistoryMap[player.key] = recalcCurrentScoreRecursive(playerScore);
      this.changeActivePlayer(1, gamePlayers);
      if (this.rules?.dealerSettings === DealerSettings.NewPerRound &&
        this.fullRoundComplete(this.scoreHistoryMap)
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
    if (this.scoreHistoryMap) {
      this.scoreHistoryMap[playerKey].scores.splice(scoreIndex, 1);
      this.scoreHistoryMap[playerKey] = reCalcCurrentScore(this.scoreHistoryMap[playerKey]);
      if (this.activePlayerScore?.player.key === playerKey && this.activePlayerScore.scoreIndex >= scoreIndex) {
        this.activePlayerScore = { ...this.activePlayerScore, scoreIndex: this.activePlayerScore.scoreIndex - 1 }
      }
    }
  }

  @action
  startGame = () => {
    if (!Object.keys(this.scoreHistoryMap ?? {}).length && this.players?.length) {
      this.scoreHistoryMap = buildInitialHistory(
        this.players ?? [],
        this.rules?.startingScore ?? 0
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
    if (this.scoreHistoryMap && this.activePlayerScore) {
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

  createPlayerScore = (player: Player, round?: number): PlayerScore => {
    if (player) {
      const playerIndex = this.players.findIndex(p => p.key === player.key);
      const playerScore = this.scoreHistoryMap[player.key];
      const roundIndex = round !== undefined ?
        round :
        playerScore.scores.length ?? 0;
      let roundScore = this.rules.defaultScoreStep || 0;
      if (round !== undefined) {
        roundScore = playerScore?.scores[round]?.score || 0;
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
    for (const playerKey in scoreHistory) {
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
