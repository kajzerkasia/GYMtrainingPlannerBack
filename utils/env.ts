const isFeatureEnabled = (name: string): boolean => {
    return process.env[name] === '1';
}

export const isDemoEnabled: () => boolean = isFeatureEnabled.bind(null, 'IS_DEMO')