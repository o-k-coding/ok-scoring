import { Text } from 'react-native';
import { sharedMobileStyles } from '@ok-scoring/styles';
import { WrapperComponentProps } from './WrapperComponentProps';

export const BodyText = ({ children }: WrapperComponentProps) => {
    return (
        <Text style={sharedMobileStyles.bodyText}>{children}</Text>
    );
}

export default BodyText;
