export enum DealerSettings {
    Constant = 'constant',
    NewPerRound = 'newPerRound',
    Manual = 'manual',
}

export const DealerSettingsText = {
    [DealerSettings.Constant]: 'Same Dealer Per Round',
    [DealerSettings.NewPerRound]: 'New Dealer Per Round',
    [DealerSettings.Manual]: 'Set Dealer Manually',
}
