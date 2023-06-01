// components/SettingsDialog.tsx
import React, {useContext, useState} from "react";
import {defaultSettings, SettingGroup, Setting} from "../types";
import {SettingsContext} from "../../context/SettingsContext";
import {useNavigate} from "react-router-dom";

import {
	Dialog,
	Box,
	DialogTitle,
	DialogContent,
	DialogActions,
	List,
	ListItemButton,
	Typography,
	Switch,
	Button,
	Select,
	MenuItem,
	Slider,
} from "@mui/material";

const SettingsDialog: React.FC<{
	open: boolean;
	handleClose: () => void;
}> = ({open, handleClose}) => {
	const {settings, setSetting} = useContext(SettingsContext);
	const navigate = useNavigate();
	const [selectedGroup, setSelectedGroup] = useState<SettingGroup>(
		SettingGroup.General
	);

	const settingsByGroup = Object.values(defaultSettings).filter(
		(setting) => setting.group === selectedGroup
	);

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	const renderSettingControl = (setting: Setting) => {
		const value = settings[setting.id];
		switch (setting.type) {
			case "switch":
				return (
					<Switch
						checked={value as boolean}
						onChange={(_, checked) => setSetting(setting.id, checked)}
					/>
				);
			case "select":
				return (
					<Select
						value={value as string}
						onChange={(event) =>
							setSetting(setting.id, event.target.value as string)
						}
					>
						{setting.options?.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</Select>
				);
			case "slider":
				const {min, max, step} = setting;
				return (
					<Slider
						value={value as number}
						onChange={(_, newValue) =>
							setSetting(setting.id, newValue as number)
						}
						step={step}
						min={min}
						max={max}
					/>
				);
			default:
				throw new Error(`Unsupported setting type: ${setting.type}`);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
			<DialogTitle>Settings</DialogTitle>
			<DialogContent>
				<Box sx={{display: "flex", width: "100%", height: "90%"}}>
					<Box sx={{width: "30%", borderRight: "1px solid gray"}}>
						<List component="nav">
							{Object.values(SettingGroup).map((group) => (
								<ListItemButton
									key={group}
									selected={selectedGroup === group}
									onClick={() => setSelectedGroup(group)}
								>
									<Typography variant="h6">{group}</Typography>
								</ListItemButton>
							))}
						</List>
					</Box>
					<Box sx={{width: "70%", padding: 2}}>
						{settingsByGroup.map((setting) => (
							<div key={setting.id}>
								<Typography variant="body1">{setting.label}</Typography>
								{renderSettingControl(setting)}
							</div>
						))}
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Close</Button>
				{selectedGroup === SettingGroup.Account && (
					<Button variant="contained" color="secondary" onClick={handleLogout}>
						Logout
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default SettingsDialog;
