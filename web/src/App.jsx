import "./App.css";
import HomePage from "./pages/HomePage";
import FilesPage from "./pages/FilesPage";
import RepoPage from "./pages/RepoPage";
import ExtensionPage from "./pages/ExtensionPage";
import SettingsPage from "./pages/SettingsPage";

//React
import React from "react";

//Material UI Components
import {
	AppBar,
	createTheme,
	CssBaseline,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ThemeProvider,
	StyledEngineProvider,
	Toolbar,
	Typography,
	useMediaQuery,
	IconButton,
} from "@mui/material";

//Material UI Icons
import HomeIcon from "@mui/icons-material/Home";
import DownloadIcon from '@mui/icons-material/Download';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from "@mui/icons-material/Settings";
import ExtensionIcon from '@mui/icons-material/Extension';
import BugReportIcon from '@mui/icons-material/BugReport';

//React Router
import { /*Switch, Route,  HashRouter*/ HashRouter, Routes, Route, Link, } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import { withSnackbar } from "notistack";

const drawerWidth = "240px";

function App() {
	//const classes = useStyles();

	const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	let darkMode = "dark";
	if (!prefersDarkMode) {
		darkMode = "light";
	}

	const theme = createTheme({
		palette: {
			mode: darkMode,
			primary: {
				main: grey[700],
				contrastText: "#fff",
			},
			secondary: {
				main: grey[200],
			},
		},
	});

	const classes = {
		root: {
			display: "flex",
		},
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
		},
		drawer: {
			width: drawerWidth,
			flexShrink: 0,
			paper: {
				width: drawerWidth,
			}
		},
		drawerPaper: {
			width: drawerWidth,
		},
		drawerContainer: {
			overflow: "auto",
		},
		content: {
			flexGrow: 1,
			padding: theme.spacing(0),
			marginLeft: drawerWidth,
		},
	};

	const drawer = (
		<div sx={classes.drawerContainer}>
			<List>
				<ListItem button key="Home" component={Link} to="/">
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText>Home</ListItemText>
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem button key="Files" component={Link} to="/Files">
					<ListItemIcon>
						<DownloadIcon />
					</ListItemIcon>
					<ListItemText>Files</ListItemText>
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem button key="Repositories" component={Link} to="/Repos">
					<ListItemIcon>
						<InventoryIcon />
					</ListItemIcon>
					<ListItemText>Repositories</ListItemText>
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem button key="Extensions" component={Link} to="/Extensions">
					<ListItemIcon>
						<ExtensionIcon />
					</ListItemIcon>
					<ListItemText>Extensions</ListItemText>
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem button key="Settings" component={Link} to="/Settings">
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText>Settings</ListItemText>
				</ListItem>
			</List>
		</div>
	);

	return (
		<div sx={classes.root}>
			<StyledEngineProvider injectFirst>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<HashRouter>
						<AppBar position="fixed" sx={classes.appBar}>
							<Toolbar>
								<Typography variant="h6" noWrap>
									Salt
								</Typography>
								<Box sx={{ flexGrow: 1 }} />
								<IconButton
									onClick={window.openDevTools}
									color="inherit"
								>
									<BugReportIcon />
								</IconButton>
							</Toolbar>
						</AppBar>
						<Drawer
							sx={{
								width: drawerWidth,
								flexShrink: 0,
								'& .MuiDrawer-paper': {
									width: drawerWidth,
									boxSizing: 'border-box',
								},
							}}
							variant="permanent"
							classes={{
								paper: classes.drawerPaper,
							}}
						>
							<Toolbar />
							{drawer}
						</Drawer>

						<Box sx={classes.content}>
							<div sx={classes.toolbar} />

							<Toolbar />
							<Routes>
								<Route exact path="/" element={<HomePage />} />
								<Route path="/Files" element={<FilesPage />} />
								<Route path="/Repos" element={<RepoPage />} />
								<Route path="/Extensions" element={<ExtensionPage />} />
								<Route path="/Settings" element={<SettingsPage />} />
							</Routes>
						</Box>
					</HashRouter>
				</ThemeProvider>
			</StyledEngineProvider>
		</div>
	);
}

export default withSnackbar(App);
