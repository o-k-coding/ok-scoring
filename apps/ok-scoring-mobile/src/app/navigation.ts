import { GameScoreProps } from './pages/game-scores/GameScores';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createNavigationContainerRef, RouteProp } from '@react-navigation/native';

export const NewGameRoute = 'NewGame';
export const GameRoute = 'Game';
export const GameHistoryRoute = 'GameHistory';
export const GameScoresRoute = 'GameScore';
export const GameSettingsRoute = 'GameSettings';
export const GameScoreHistoryRoute = 'GameScoreHistory';
export const FavoritesRoute = 'Favorites';


export type RootStackParamList = {
    [NewGameRoute]: undefined,
    [GameRoute]: undefined,
    [GameScoresRoute]: GameScoreProps,
    [GameHistoryRoute]: undefined,
    [GameSettingsRoute]: undefined,
    [GameScoreHistoryRoute]: undefined,
    [FavoritesRoute]: undefined,
}

export type Routes = keyof RootStackParamList;

export type PageNavigationProps<TRouteName extends Routes> = {
    route: RouteProp<RootStackParamList, TRouteName>,
    navigation: NativeStackNavigationProp<RootStackParamList, TRouteName>,
};


export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export function navigateInRoot(name: Routes, params?: any) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}
