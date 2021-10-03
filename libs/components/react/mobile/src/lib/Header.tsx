import { Text, View } from 'react-native'
import { sharedMobileStyles } from '@ok-scoring/styles';

interface HeaderProps {
    title?: string;
    fontSize?: number;
}

export const Header = ({ title, fontSize = 30 }: HeaderProps) => {
    return (
        <View style={[sharedMobileStyles.centeredContent]}>
            <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.centeredText, { fontSize }]}>{title}</Text>
        </View>
    )
}

export default Header;
