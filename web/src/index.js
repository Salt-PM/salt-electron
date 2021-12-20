import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import "typeface-roboto";
import { SnackbarProvider } from "notistack";
import DownloadingIcon from '@mui/icons-material/Downloading';
import UpdateIcon from '@mui/icons-material/Update';

ReactDOM.render(
	<React.StrictMode>
		<SnackbarProvider maxSnack={4} iconVariant={{
        info: <DownloadingIcon />,
        success: <UpdateIcon />,
    }}>
			<App />
		</SnackbarProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
