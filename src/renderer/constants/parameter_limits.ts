export const lowVoltageLimits = {
    24: { min: 16, max: 21 },
    36: { min: 27, max: 32 },
    48: { min: 38, max: 43 },
    43: { min: 33, max: 39 },
};

export enum BatteryTypes {
    LiIon = 'liion',
    LiPo = 'lipo',
    LiFePo4 = 'lifepo4',
}

export const LowVoltageLimitsByBatteryType = {
    24: { liion: 20, lipo: -1, lifepo4: 20 },
    36: { liion: 31, lipo: -1, lifepo4: 30 },
    43: { liion: 38, lipo: -1, lifepo4: -1 },
    48: { liion: 41, lipo: -1, lifepo4: 40 },
};
