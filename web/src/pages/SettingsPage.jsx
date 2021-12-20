//React
import React from "react";

//Material UI Components
import {
	Checkbox,
	FormControlLabel,
	Grid,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";

//Material UI Icons
import SaveIcon from "@mui/icons-material/Save";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

function LaunchPage() {
	const [saltOutputLocation, setSaltOutputLocation] = React.useState(window.salt.getOutputDir() || "");
	const [saltInsecureConnections, setSaltInsecureConnections] = React.useState(window.salt.getInsecureConnectionsOpt() || false);

	const handleOutputLocationChange = (event) => {
		setSaltOutputLocation(event.target.value);
	};

	const handleInsecureConnectionsChange = (event) => {
		setSaltInsecureConnections(event.target.checked);
	};


	const classes = {
		root: {
			display: "flex",
		},
	}

	return (
		<div>
			<Grid
				container
				spacing={0}
				alignItems="center"
				justifyContent="center"
				direction="column"
			>
				<Typography variant="h2" component="h2">
					Settings
				</Typography>

				<form className={classes.root} noValidate autoComplete="off">
					<TextField
						id="saltOutputLocation"
						label="Download Output Location"
						variant="outlined"
						style={{
							width: "424px",
							margin: "10px",
						}}
						value={saltOutputLocation}
						onChange={handleOutputLocationChange}

					/>

					<IconButton
						align="center"
						style={{
							width: "56px",
							height: "56px",
							margin: "10px",
						}}
						size="small"
						onClick={() => {
							try {
								let outputLocation = window.pickOutputDestination()
								console.log(outputLocation);
								setSaltOutputLocation(outputLocation)
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
				<FormControlLabel
					control={
						<Checkbox
							onChange={handleInsecureConnectionsChange}
							checked={saltInsecureConnections}
							name="saltInsecureConnections"
							id="saltInsecureConnections"
						/>
					}
					label="Allow Insecure Connections"
				/>

				<IconButton
					align="center"
					style={{
						width: "100px",
						height: "100px",
						margin: "10px",
					}}
					size="small"
					onClick={() => {
						window.salt.setOutputDir(saltOutputLocation)
						window.salt.setInsecureConnectionsOpt(saltInsecureConnections)
					}
					}
				>
					<SaveIcon
						style={{
							fontSize: "50px",
						}}
					/>
				</IconButton>
			</Grid>
		</div >
	);
}

export default LaunchPage;
