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
        },
        textLabels: {
            body: {
                noMatch: "No files found",
            }
        }
    };

    async function refreshFiles() {
        let items = await window.saltRunnerAsync("getCachedListOfItems");
        for (const id in items) {
            if (Object.hasOwnProperty.call(items, id)) {
                const item = items[id];
                let row = {
                    Name: "",
                    Author: "",
                    Categories: "",
                    Series: "",
                };
                Object.assign(row, item);

                let itemSeries = item.Series;
                if (itemSeries == null) {
                    if (itemSeries.constructor === Object) {
                        row.Series = [];
                        let objectsToProcess = [];
                        objectsToProcess.push(itemSeries);
                        while (objectsToProcess.length > 0) {
                            let currentObject = objectsToProcess.pop();
                            for (const series in currentObject) {
                                if (Object.hasOwnProperty.call(currentObject, series)) {
                                    row.Series.push(series);
                                    let currentSeriesData = currentObject[series];
                                    if (currentSeriesData.constructor === Object) {
                                        objectsToProcess.push(currentSeriesData);
                                    } else if (currentSeriesData instanceof Array) {
                                        row.Series.concat(currentSeriesData);
                                    } else if (typeof currentSeriesData === "string" && currentSeriesData !== "") {
                                        row.Series.push(currentSeriesData);
                                    }
                                }
                            }
                        }
                    } else if (itemSeries instanceof Array) {
                        row.Series = itemSeries;
                    } else if (typeof itemSeries === "string") {
                        row.Series = [itemSeries];
                    }
                } else {
                    row.Categories = [];
                }

                let itemCategories = item.Categories;
                if (itemSeries == null) {
                    if (itemCategories.constructor === Object) {
                        row.Categories = [];
                        let objectsToProcess = [];
                        objectsToProcess.push(itemCategories);
                        while (objectsToProcess.length > 0) {
                            let currentObject = objectsToProcess.pop();
                            for (const category in currentObject) {
                                if (Object.hasOwnProperty.call(currentObject, category)) {
                                    let currentCategoryData = currentObject[category];
                                    row.Categories.push(category);
                                    if (currentCategoryData.constructor === Object) {
                                        objectsToProcess.push(currentCategoryData);
                                    } else if (currentCategoryData instanceof Array) {
                                        row.Categories.concat(currentCategoryData);
                                    } else if (typeof currentCategoryData === "string") {
                                        row.Categories.push(currentCategoryData);
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
        try {
            let sb = enqueueSnackbar(`Refreshing Files`, {
                preventDuplicate: true,
                variant: 'success',
                persist: true,
            })
            await window.saltRunnerAsync("cacheRepos");
            await refreshFiles();
            closeSnackbar(sb);
        } catch (error) {
            enqueueSnackbar(`Error Refreshing Files: ${error}`, {
                preventDuplicate: true,
                variant: 'error',
            })
        }
    }
    window.updateFiles = updateFiles;

    React.useEffect(() => {
        refreshFiles()
        // Stop infinite loop:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function download(row) {
        let outputDir;
        try {
            outputDir = window.salt.getOutputDir();
        } catch (error) {
            console.error(error);
            outputDir = null;
        }
        if (outputDir == null || outputDir === "") {
            enqueueSnackbar(`No output directory set. Go to settings`, {
                preventDuplicate: true,
                variant: 'error',
            })
            return;
        }

        let sb = enqueueSnackbar(`${row.Name}: ${row.Filename}`, {
            preventDuplicate: true,
            variant: 'info',
            persist: true,
        })
        try {
            await window.saltRunnerAsync("download", row.id);
        } catch (error) {
            console.log(error);
            enqueueSnackbar(`Error Downloading "${row.Name}": ${error.message}`, {
                preventDuplicate: true,
                variant: 'error',
            })
        }
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
