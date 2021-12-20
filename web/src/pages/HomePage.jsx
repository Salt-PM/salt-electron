//React
import React from "react";

//Material UI Components
import { Grid, Typography } from "@mui/material";

function HomePage() {
	return (
		<div>
			<Grid
					container
					spacing={0}
					alignItems="center"
					justifyContent="center"
					direction="column"
				>
					<Typography variant="h3">Welcome!</Typography>
					<Typography sx={{
						margin: "10px"
					}}>
						This app allows you to access Salt files, manage Salt repositories, and manage Salt extensions.
					</Typography>
				</Grid>
		</div>
	);
}

export default HomePage;
