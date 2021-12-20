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
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSnackbar, withSnackbar } from "notistack";
import { Box } from "@mui/system";





function RepoPage() {
	const { enqueueSnackbar } = useSnackbar();

	const [tableData, setTableData] = React.useState([]);
	window.setTableData = setTableData;

	const [repoAdderOpen, setRepoAdderOpen] = React.useState(false);
	const handleRepoAdderOpen = () => setRepoAdderOpen(true);
	const handleRepoAdderClose = () => setRepoAdderOpen(false);

	const [repoAdderURL, setRepoAdderURL] = React.useState('');
	const handleRepoAdderURLChange = (event) => {
		setRepoAdderURL(event.target.value);
	};

	let rows = [];
	const salt = window.salt;

	const columns = [
		{
			name: "Name",
			label: "Name",
			options: {
				filter: false,
				sort: true,
			}
		},
		{
			name: "id",
			label: "ID",
			options: {
				filter: false,
				sort: true,
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
					removeRepository
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
					<Tooltip title={"Add Repository"}>
						<IconButton /*className={classes.iconButton} */ onClick={handleRepoAdderOpen}>
							<AddCircleOutlineIcon /*className={classes.deleteIcon}*/ />
						</IconButton>
					</Tooltip>
					<Tooltip title={"Refresh"}>
						<IconButton /*className={classes.iconButton} */ onClick={refreshRepositories}>
							<RefreshIcon /*className={classes.deleteIcon}*/ />
						</IconButton>
					</Tooltip>
				</React.Fragment>
			);
		}
	};

	async function refreshRepositories() {
		let repos = await salt.getRepoList()
		let rows = [];
		for (const id in repos) {
			if (Object.hasOwnProperty.call(repos, id)) {
				const repo = repos[id];
				repo.id = id;
				repo.removeButton = <div align="center"><IconButton aria-label="delete" onClick={() => { removeRepository(id, repo.Name) }}><RemoveCircleOutlineIcon /></IconButton></div>;
				rows.push(repo);
			}
		}
		setTableData(rows);
		return rows;
	}
	window.refreshRepositories = refreshRepositories;

	React.useEffect(() => {
		refreshRepositories()
		// Stop infinite loop:
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function removeRepository(id, name) {
		console.log("Removing: " + id);
		await salt.removeRepository(id);
		enqueueSnackbar(`Removed ${name}`, {
			variant: 'success',
		});
		await refreshRepositories();
		await window.refreshFiles();
	}

	async function addRepository() {
		let url = new URL(repoAdderURL);
		console.log("Adding: " + url);
		let repoMeta = await salt.addRepository(url);
		enqueueSnackbar(`Added ${repoMeta.Name}`, {
			variant: 'success',
		});
		await refreshRepositories();
		await window.refreshFiles();
		handleRepoAdderClose();
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
				open={repoAdderOpen}
				onClose={handleRepoAdderClose}
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
					<FormControl
						sx={{
							width: '100%',
							margin: "10px",
						}}
					>
						<TextField id="repoAdderURL" label="URL" value={repoAdderURL} onChange={handleRepoAdderURLChange} variant="filled" />
						<Button
							variant="text"
							onClick={addRepository}
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
