//React
import React from "react";

//Material UI Components
import {
	Button,
	FormControl,
	Grid,
	IconButton,
	Modal,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import MUIDataTable from "mui-datatables";

//Material UI Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useSnackbar, withSnackbar } from "notistack";
import { Box } from "@mui/system";



function RepoPage() {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const [tableData, setTableData] = React.useState([]);
	window.setTableData = setTableData;

	const [extensionAdderOpen, setExtensionAdderOpen] = React.useState(false);
	const handleExtensionAdderOpen = () => setExtensionAdderOpen(true);
	const handleExtensionAdderClose = () => setExtensionAdderOpen(false);

	const [extensionPackageAdderValue, setExtensionPackageAdderValue] = React.useState('');
	const handleExtensionPackageAdderValueChange = (event) => {
		setExtensionPackageAdderValue(event.target.value);
	};

	let rows = [];

	const columns = [
		{
			name: "displayName",
			label: "Name",
			options: {
				filter: false,
				sort: true,
			}
		},
		{
			name: "name",
			label: "ID",
			options: {
				filter: false,
				sort: true,
				display: false,
			}
		},
		{
			name: "author",
			label: "Author",
			options: {
				filter: true,
				sort: true,
				display: false,
			}
		},
		{
			name: "downloadProtocols",
			label: "DL Protocols",
			options: {
				filter: false,
				sort: true,
				customBodyRender: (value, tableMeta, updateValue) => {
					if (value instanceof Array) {
						return <div>{value.join(", ")}</div>
					} else {
						return <div>{value}</div>
					}
				},
			}
		},
		{
			name: "fileExtensions",
			label: "File Extensions",
			options: {
				filter: false,
				sort: true,
				customBodyRender: (value, tableMeta, updateValue) => {
					if (value instanceof Array) {
						return <div>{value.join(", ")}</div>
					} else {
						return <div>{value}</div>
					}
				},
			}
		},
		{
			name: "folderFiles",
			label: "Folder Regexs",
			options: {
				filter: false,
				sort: true,
				display: false,
				customBodyRender: (value, tableMeta, updateValue) => {
					if (value instanceof Array) {
						return <div>{value.join(", ")}</div>
					} else {
						return <div>{value}</div>
					}
				},
			}
		},
		{
			name: "URL",
			label: "URL",
			options: {
				filter: false,
				sort: true,
				display: false,
			}
		},
		{
			name: "removeButton",
			label: "Remove",
			options: {
				filter: false,
				sort: false,
				searchable: false,
				viewColumns: false,
				empty: true,
			},
			customBodyRenderLite: (dataIndex, rowIndex) => {
				return <div align="center"><IconButton aria-label="delete" onClick={() => {
					removeExtension
						(rows[rowIndex].id, rows[rowIndex].Name)
				}}><RemoveCircleOutlineIcon /></IconButton></div>
			}
		},
	];

	const options = {
		filterType: 'checkbox',
		download: false,
		print: false,
		selectableRows: 'none',
		pagination: false,
		//storageKey: 'filesPageTable',
		customToolbar: () => {
			return (
				<React.Fragment>
					<Tooltip title={"Add Extension"}>
						<IconButton onClick={handleExtensionAdderOpen}>
							<AddCircleOutlineIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title={"Refresh"}>
						<IconButton /*className={classes.iconButton} */ onClick={refreshExtensions}>
							<RefreshIcon /*className={classes.deleteIcon}*/ />
						</IconButton>
					</Tooltip>
				</React.Fragment>
			);
		},
        textLabels: {
            body: {
              noMatch: "No extensions found",
            }
        }
	};

	async function refreshExtensions() {
		let extensions = await window.saltRunnerAsync("getExtensions");
		let rows = [];
		for (const extension in extensions) {
			if (Object.hasOwnProperty.call(extensions, extension)) {
				const extensionMetadata = extensions[extension];

				extensionMetadata.removeButton = <div align="center"><IconButton aria-label="delete" onClick={() => { removeExtension(extensionMetadata.name, extensionMetadata.displayName) }}><RemoveCircleOutlineIcon /></IconButton></div>;
				rows.push(extensionMetadata);
			}
		}
		setTableData(rows);
	}
	window.refreshExtensions = refreshExtensions;

	async function updateExtensions() {
        let sb = enqueueSnackbar(`Refreshing Files`, {
            preventDuplicate: true,
            variant: 'success',
            persist: true,
        })
        await refreshExtensions();
        closeSnackbar(sb);
	}
	window.updateExtensions = updateExtensions;

	React.useEffect(() => {
		refreshExtensions()
		// Stop infinite loop:
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function removeExtension(name, displayName) {
		console.log("Removing: " + name);
		await window.saltRunnerAsync("removeExtension",name);
		enqueueSnackbar(`Removed ${displayName}`, {
			variant: 'success',
		});

		await refreshExtensions();
	}

	async function addExtension() {
		let extensionPackage = extensionPackageAdderValue.split(/[\\/]/).pop();
		console.log("Adding: " + extensionPackage);
		await window.saltRunnerAsync("installExtension", extensionPackageAdderValue);
		enqueueSnackbar(`Added ${extensionPackage}`, {
			variant: 'success',
		});

		await refreshExtensions();

		handleExtensionAdderClose();
	}


	return (
		<Grid
			container
			spacing={0}
			alignItems="center"
			justifyContent="center"
			direction="column"
		>
			<Modal
				open={extensionAdderOpen}
				onClose={handleExtensionAdderClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 400,
						bgcolor: 'background.paper',
						border: '2px solid #000',
						boxShadow: 24,
						p: 4,
						margin: "10px",
					}}
				>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Add Repository
					</Typography>
					<form
						style={{
							width: '100%',
						}}
					>
						<TextField
							id="extensionPackageAdderValue"
							label=".saltextension Path"
							value={extensionPackageAdderValue}
							onChange={handleExtensionPackageAdderValueChange}
							variant="filled"
							sx={{
								width: "256px",
							}}
						/>

						<IconButton
							align="center"
							style={{
								width: "56px",
								height: "56px",
								marginLeft: "10px",
								marginRight: "10px",
							}}
							size="small"
							onClick={() => {
								try {
									let extension = window.pickExtensions()
									console.log(extension);
									setExtensionPackageAdderValue(extension)
								} catch (error) {

								}
							}}
						>
							<FolderOpenIcon
								style={{
									fontSize: "50px",
								}}
							/>
						</IconButton>
					</form>
					<FormControl
						sx={{
							width: '100%',
						}}
					>
						<Button
							variant="text"
							onClick={addExtension}
							sx={{
								height: "50px",
							}}
						>Add</Button>
					</FormControl>
				</Box>
			</Modal>
			<div
				style={{
					width: '100%',
				}}
			>
				<MUIDataTable
					title={"Repositories"}
					data={tableData}
					columns={columns}
					options={options}
				/>
			</div>
		</Grid>
	);
}

export default withSnackbar(RepoPage);
