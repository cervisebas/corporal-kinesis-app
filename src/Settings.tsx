import React from 'react';

type SettingsType = {
    animations: "fade" | "none" | "slide"
};

const Settings = React.createContext({
    setSettings: (props: SettingsType)=>{},
    getSettings: {
        animations: "none"
    }
});

export default Settings;