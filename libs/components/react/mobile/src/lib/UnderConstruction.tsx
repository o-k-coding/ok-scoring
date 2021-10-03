import { Text, View } from 'react-native';
import { sharedMobileStyles } from '@ok-scoring/styles';
import { SvgXml } from 'react-native-svg';
import { workInProgressXML } from '@ok-scoring/assets';

export const UnderConstruction = () => {
    return (
        <View style={[sharedMobileStyles.column]}>
            <View style={sharedMobileStyles.centeredContent}>
                <SvgXml xml={workInProgressXML} width={'150'} height={'150'} />
            </View>
            <Text style={[sharedMobileStyles.bodyText, sharedMobileStyles.centeredText]}>
                Work in progress, Come back soon for more cool features!
            </Text>
        </View>
    );
}

export default UnderConstruction;
