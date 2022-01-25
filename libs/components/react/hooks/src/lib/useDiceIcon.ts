import { useState, useEffect } from 'react';

// This wasn't really necessary but it's kinda fun to use a generator for this.
function* generateDiceIcon(): Generator<string> {
    let die;
    while (true) {
        const newDie = Math.ceil(Math.random() * 6);
        // Guarantee the die value is different than last time it was called.
        if (die !== newDie) {
            die = newDie;
            yield `dice-${die}`;
        }
    }
}
const diceIconGenerator = generateDiceIcon();

/**
 * Custom hook to create a random dice icon when the component is created
 * can take in an input change event and update the form state based on the input name
 *
 * Note if I wanted to, I could allow consumer to pass in something to react to to regen the dice.
 */
export function useDiceIcon<T extends string>(): T {
    const [diceIcon, setDiceIcon] = useState<string>('');
    useEffect(() => {
        setDiceIcon(diceIconGenerator.next().value as T);
    }, []);
    return diceIcon as T;
}
