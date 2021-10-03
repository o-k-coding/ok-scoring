import React, { useEffect, useContext } from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
// TODO <https://docs.swmansion.com/react-native-gesture-handler/docs/#installation>
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import NewGame from './pages/new-game/NewGame';
import Game from './pages/game/Game';
import GameHistory from './pages/game-history/GameHistory';
import GameScores from './pages/game-scores/GameScores';
import GameSettings from './pages/game-settings/GameSettings';
import GameScoreHistory from './pages/game-score-history/GameScoreHistory';
import Favorites from './pages/favorites/Favorites';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { NewGameRoute, GameRoute, GameHistoryRoute, GameScoresRoute, GameSettingsRoute, GameScoreHistoryRoute, FavoritesRoute } from './navigation';
import { favoriteGamesContext, gameHistoryContext, localDbContext, playerHistoryContext } from '@ok-scoring/features/game-ui-store';
import { CenterContent } from '@ok-scoring/components/react/mobile';
import { sharedMobileStyles } from '@ok-scoring/styles';
const icon = require('./assets/icon.png');
function App() {

  const { dbInitialized, initLocalDb } = useContext(localDbContext);
  const { loadGames } = useContext(gameHistoryContext);
  const { loadPlayers } = useContext(playerHistoryContext);
  const { loadFavoriteGames } = useContext(favoriteGamesContext);

  const [fontsLoaded, error] = useFonts({
    Quicksand: require('./assets/fonts/Quicksand/static/Quicksand-Regular.ttf'),
  });

  const initDbAndData = async () => {
    await initLocalDb();
    loadGames();
    loadPlayers();
    loadFavoriteGames();
  }

  useEffect(() => {
    if (fontsLoaded && !dbInitialized) {
      initDbAndData();
    }

    return () => {
      // TODO clean up db?
    }
    // It seems that I need to listen to dbInitialized
  }, [fontsLoaded, dbInitialized]);

  if (!fontsLoaded || !dbInitialized) {
    return <>
      <View style={sharedMobileStyles.column}>
        <CenterContent>
          <Image
            source={icon}
            style={sharedMobileStyles.logoImage}
            resizeMode='contain'
          />
        </CenterContent>
        <Text style={[sharedMobileStyles.centeredText]}>...Loading</Text>
      </View>
    </>;
  }

  // TODO set some backup global font family?
  if (error) {
    console.error('error loading fonts!!', error);
  }

  const Stack = createNativeStackNavigator();

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={true} />
      <ActionSheetProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={NewGameRoute} screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name={NewGameRoute} component={NewGame} />
            <Stack.Screen name={GameRoute} component={Game} />
            <Stack.Screen name={GameHistoryRoute} component={GameHistory} />
            <Stack.Screen name={GameScoresRoute} component={GameScores} />
            <Stack.Screen name={GameSettingsRoute} component={GameSettings} />
            <Stack.Screen name={GameScoreHistoryRoute} component={GameScoreHistory} />
            <Stack.Screen name={FavoritesRoute} component={Favorites} />
          </Stack.Navigator>
        </NavigationContainer>
      </ActionSheetProvider>
    </>
  );
}

export default observer(App);
