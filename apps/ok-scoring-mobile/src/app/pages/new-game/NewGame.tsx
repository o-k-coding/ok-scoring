import React, { useContext } from 'react';
import { Image, Text } from 'react-native';
import NewGamePlayers from './components/smart/NewGamePlayers';
import NewGameDescription from './components/smart/NewGameDescription';
import { observer } from 'mobx-react';
import { FavoritesRoute, GameHistoryRoute, GameRoute, GameSettingsRoute, NewGameRoute, PageNavigationProps } from '../../navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from '@ok-scoring/features/game-models';
import { useDiceIcon } from '@ok-scoring/components/react/hooks';
import { NavBar, CenterContent, MatIcons } from '@ok-scoring/components/react/mobile';
import { localDbContext, gameContext } from '@ok-scoring/features/game-ui-store';
import { sharedMobileStyles } from '@ok-scoring/styles';
;

export type SetSettingFunction = <K extends keyof Settings, T extends Settings[K]>(key: K, setting: T) => void;

const NewGame = ({ navigation }: PageNavigationProps<typeof NewGameRoute>) => {
    const { dbInitialized } = useContext(localDbContext);
    const { gameCanStart, description } = useContext(gameContext);
    const diceIcon = useDiceIcon<MatIcons>();

    return (
        <SafeAreaView style={sharedMobileStyles.pageContainer}>
            <NavBar
                leftButton={{ icon: 'cog', title: 'Game Settings', clickHandler: () => navigation.navigate(GameSettingsRoute) }}
                rightButton={{ disabled: !gameCanStart, icon: diceIcon, title: 'Start Game', clickHandler: () => navigation.navigate(GameRoute) }}
            />
            <CenterContent>
                <Image
                    source={require('../../assets/icon.png')}
                    style={sharedMobileStyles.logoImage}
                    resizeMode='contain'
                />
            </CenterContent>
            <CenterContent>
                <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.centeredText, { fontSize: 30 }]}>
                    {description || 'New Game'}
                </Text>
            </CenterContent>
            <NewGameDescription />
            <NewGamePlayers />
            {
                dbInitialized &&
                <NavBar
                    leftButton={{ icon: 'book', title: 'Game History', clickHandler: () => navigation.navigate(GameHistoryRoute) }}
                    rightButton={{ icon: 'star', title: 'Favorites', clickHandler: () => navigation.navigate(FavoritesRoute) }}
                />
            }
        </SafeAreaView>
    );
}

export default observer(NewGame);
