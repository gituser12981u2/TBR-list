// components/SettingsContext.tsx
import React, {createContext, useState, useEffect, ReactNode} from "react";
import {
	SettingsState,
	defaultSettings,
	SettingValue,
} from "../components/types";

export const SettingsContext = createContext<{
	settings: SettingsState;
	setSetting: (id: string, value: SettingValue) => void;
}>({
	settings: Object.keys(defaultSettings).reduce(
		(res, key) => ({...res, [key]: defaultSettings[key].defaultValue}),
		{}
	),
	setSetting: () => {},
});

interface SettingsProviderProps {
	children?: ReactNode;
}

const SettingsProvider: React.FC<SettingsProviderProps> = ({children}) => {
	const [settings, setSettings] = useState<SettingsState>(() => {
		const savedSettings = localStorage.getItem("settings");
		if (savedSettings) {
			return JSON.parse(savedSettings);
		}

		return Object.keys(defaultSettings).reduce(
			(res, key) => ({...res, [key]: defaultSettings[key].defaultValue}),
			{}
		);
	});

	useEffect(() => {
		localStorage.setItem("settings", JSON.stringify(settings));
	}, [settings]);

	const setSetting = (id: string, value: SettingValue) => {
		setSettings((prevSettings) => ({...prevSettings, [id]: value}));
	};

	return (
		<SettingsContext.Provider value={{settings, setSetting}}>
			{children}
		</SettingsContext.Provider>
	);
};

export default SettingsProvider;
