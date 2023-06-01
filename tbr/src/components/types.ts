// components/types.ts
export type Book = {
	_id: string;
	title: string;
	author: string;
	coverImageUrl: string;
	updatedAt: Date;
	publicationDate: string;
	synopsis: string;
};

export type SettingType = "switch" | "select" | "slider";

export type SettingValue = boolean | string | number;

export enum SettingGroup {
	General = "General",
	Account = "Account",
	Appearance = "Appearance",
	Privacy = "Privacy",
}

export type SettingOption = {
	value: string;
	label: string;
};

export type Setting = {
	id: string;
	label: string;
	type: SettingType;
	defaultValue: SettingValue;
	options?: SettingOption[];
	group: SettingGroup;
	min?: number;
	max?: number;
	step?: number;
};

export type SettingsState = {
	[id: string]: SettingValue;
};

export interface SettingValues {
	[id: string]: SettingValue;
}

export const defaultSettings: Record<string, Setting> = {
	darkMode: {
		id: "darkMode",
		label: "Light/Dark Mode",
		type: "switch",
		defaultValue: false,
		// defaultValue: "lightMode",
		// options: [
		// 	{value: "darkMode", label: "Dark Mode"},
		// 	{value: "lightMode", label: "Light Mode"},
		// 	{value: "auto", label: "Automatic (based on sunrise/sunset times"},
		// ],
		group: SettingGroup.General,
	},
	viewMode: {
		id: "viewMode",
		label: "View Mode",
		type: "select",
		defaultValue: "list",
		options: [
			{value: "list", label: "List View"},
			{value: "gallery", label: "Gallery View"},
			{value: "compact", label: "Compact View"},
		],
		group: SettingGroup.Appearance,
	},
	dataPreferences: {
		id: "dataPreferences",
		label: "Data Preferences",
		type: "switch",
		defaultValue: true,
		group: SettingGroup.Privacy,
	},
	// more settings
};
