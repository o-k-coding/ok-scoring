import { IconButton } from '@ok-scoring/components/react/mobile';
import { sharedMobileStyles } from '@ok-scoring/styles';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTimerState, useTimerDispatch } from '@ok-scoring/components/react/timer-provider'

const GameTimer = () => {
    const timerState = useTimerState();
    const dispatchTimerEvent = useTimerDispatch();
    const onToggleTimer = () => {
        dispatchTimerEvent({ value: timerState.timerValue, on: !timerState.timerActive });
    };

    const onResetTimer = () => {
        dispatchTimerEvent({ value: 0, on: false });
    }

    return (
        <View style={styles.timerContainer}>
            <Text style={[sharedMobileStyles.primaryText, styles.timerText]}>{timerState.timerText}</Text>
            <View>
                {
                    timerState.timerActive ?
                        <IconButton icon='pause' clickHandler={onToggleTimer} size={32} /> :
                        <IconButton icon='play-outline' clickHandler={onToggleTimer} size={32} />
                }
                <View style={sharedMobileStyles.mt10}>
                    <IconButton icon='restart' clickHandler={onResetTimer} size={32} />
                </View>
            </View>
        </View>
    );
}

export default GameTimer

const styles = StyleSheet.create({
    timerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        marginBottom: 10
    }
})
