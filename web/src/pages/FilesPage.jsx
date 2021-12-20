//React
import React from "react";

//Material UI Components
import {
    Grid,
    IconButton,
    Tooltip,
} from "@mui/material";
import MUIDataTable from "mui-datatables";

//Material UI Icons
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSnackbar, withSnackbar } from "notistack";





function FilesPage() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [tableData, setTableData] = React.useState([]);
    window.setTableData = setTableData;
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
			name: "Author",
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
            name: "Series",
            label: "Series",
            options: {
                filter: true,
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
            name: "Categories",
            label: "Categories",
            options: {
                filter: true,
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
            name: "downloadButton",
            label: "Download",
            options: {
                filter: false,
                sort: false,
                searchable: false,
                viewColumns: false,

            },
            customBodyRenderLite: (dataIndex, rowIndex) => {
                return <div align="center"><IconButton aria-label="delete" onClick={() => { download(rows[rowIndex]) }}><DownloadIcon /></IconButton></div>
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
					<Tooltip title={"Refresh"}>
						<IconButton onClick={updateFiles}>
							<RefreshIcon />
						</IconButton>
					</Tooltip>
				</React.Fragment>
			);
		}
    };

    async function refreshFiles() {
        let items = await salt.getCachedListOfItems()
        for (const id in items) {
            if (Object.hasOwnProperty.call(items, id)) {
                const item = items[id];
                let row = {
                    Name: "",
                    Author: "",
                    Categories: "",
                    Series: "",
                }
                Object.assign(row, item);

                let itemSeries = item.Series;
                if (typeof itemSeries === "object" && !(itemSeries instanceof Array)) {
                    row.Series = [];
                    let objectsToProcess = [];
                    objectsToProcess.push(itemSeries);
                    while (objectsToProcess.length > 0) {
                        let currentObject = objectsToProcess.pop();
                        for (const series in currentObject) {
                            if (Object.hasOwnProperty.call(currentObject, series)) {
                                if (typeof currentObject[series] === "object" && !(series instanceof Array)) {
                                    row.Series.push(series);
                                    objectsToProcess.push(currentObject[series]);
                                } else if (currentObject[series] instanceof Array) {
                                    row.Series.concat(currentObject[series]);
                                } else if (typeof currentObject[series] === "string") {
                                    row.Series.push(currentObject[series]);
                                }
                            }
                        }
                    }
                } else if (itemSeries instanceof Array) {
                    row.Series = itemSeries;
                } else if (typeof itemSeries === "string") {
                    row.Series = [itemSeries];
                }

                let itemCategories = item.Categories;
                if (typeof itemCategories === "object" && !(itemCategories instanceof Array)) {
                    row.Categories = [];
                    let objectsToProcess = [];
                    objectsToProcess.push(itemCategories);
                    while (objectsToProcess.length > 0) {
                        let currentObject = objectsToProcess.pop();
                        for (const category in currentObject) {
                            if (Object.hasOwnProperty.call(currentObject, category)) {
                                if (typeof currentObject[category] === "object" && !(category instanceof Array)) {
                                    row.Categories.push(category);
                                    objectsToProcess.push(currentObject[category]);
                                } else if (currentObject[category] instanceof Array) {
                                    row.Categories.concat(currentObject[category]);
                                } else if (typeof currentObject[category] === "string") {
                                    row.Categories.push(currentObject[category]);
                                }
                            }
                        }
                    }
                } else if (itemCategories instanceof Array) {
                    row.Categories = itemCategories;
                } else if (typeof itemCategories === "string") {
                    row.Categories = [itemCategories];
                } else {
                    row.Categories = [];
                }

                row.downloadButton = <IconButton aria-label="delete" onClick={() => { download(row) }}><DownloadIcon /></IconButton>;
                rows.push(row);
            }
        }
        setTableData(rows);
        return rows;
    }
    window.refreshFiles = refreshFiles;

    async function updateFiles() {
        let sb = enqueueSnackbar(`Refreshing Files`, {
            preventDuplicate: true,
            variant: 'success',
            persist: true,
        })
        await window.salt.cacheRepos();
        await refreshFiles();
        closeSnackbar(sb);
    }
    window.updateFiles = updateFiles;

    React.useEffect(() => {
        refreshFiles()
        // Stop infinite loop:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function download(row) {
        let sb = enqueueSnackbar(`${row.Name}: ${row.Filename}`, {
            preventDuplicate: true,
            variant: 'info',
            persist: true,
        })
        await window.saltDownload(row.id)
        closeSnackbar(sb);
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
                <div
                    style={{
                        width: '100%',
                    }}
                >
                    <MUIDataTable
                        title={"Files"}
                        data={tableData}
                        columns={columns}
                        options={options}
                    />
                </div>
                {/*}<div
                    style={{
                        margin: "50px",
                        width: "calc(100% - 100px)",
                        textAlign: "center",
                    }}
                >
                    <LinearProgressWithLabel value={progress} id="downloadProgress" />
                    <br />
                    <Typography>Task: {task}</Typography>
                </div>*/}
            </Grid>
        </div>
    );
}

export default withSnackbar(FilesPage);
