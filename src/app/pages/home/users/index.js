/* eslint-disable no-restricted-imports */
import React, { useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
    makeStyles,
    lighten,
} from "@material-ui/core/styles";
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Toolbar,
    Typography,
    TableSortLabel,
    TablePagination,
} from "@material-ui/core";
import instance from '../../../services/instance';

// Example 3
function desc3(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort3(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === "desc"
        ? (a, b) => desc3(a, b, orderBy)
        : (a, b) => -desc3(a, b, orderBy);
}

const headRows3 = [
    { id: "email", numeric: false, disablePadding: false, label: "Email" },
    { id: "emailVerified", numeric: false, disablePadding: false, label: "Email Verified" },
    { id: "registeDate", numeric: false, disablePadding: false, label: "Registe Date" },
    { id: "lastSignInTime", numeric: false, disablePadding: false, label: "Last SignIn Time" }
];

function EnhancedTableHead3(props) {
    const {
        // onSelectAllClick,
        order,
        orderBy,
        // numSelected,
        // rowCount,
        onRequestSort
    } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount && rowCount !== 0}
                        onChange={onSelectAllClick}
                        inputProps={{ "aria-label": "Select all desserts" }}
                    />
                </TableCell> */}
                {headRows3.map(row => (
                    <TableCell
                        key={row.id}
                        align={row.numeric ? "right" : "left"}
                        padding={row.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === row.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === row.id}
                            direction={order}
                            onClick={createSortHandler(row.id)}
                        >
                            {row.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead3.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const useToolbarStyles3 = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
        theme.palette.type === "light"
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
            },
    spacer: {
        flex: "1 1 100%"
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        flex: "0 0 auto"
    }
}));

const EnhancedTableToolbar3 = props => {
    const classes = useToolbarStyles3();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            <div className={classes.title}>
                {/* {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1"> {numSelected} selected </Typography>
                ) : (
                        <Typography variant="h6" id="tableTitle"> Users </Typography>
                        )} */}
                <Typography variant="h6" id="tableTitle"> Users </Typography>
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {/* {numSelected > 0 ? (
                    <ButtonGroup>
                        <Tooltip title="Edit">
                            <IconButton aria-label="Edit">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton aria-label="Delete">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>
                ) : (
                        <Tooltip title="Filter list">
                            <IconButton aria-label="Filter list">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    )} */}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar3.propTypes = {
    numSelected: PropTypes.number.isRequired
};

const useStyles3 = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3)
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750
    },
    tableWrapper: {
        overflowX: "auto"
    }
}));

export default function Users() {
    const constantForEffect = true;

    // Example 3
    const classes3 = useStyles3();
    const [order3, setOrder3] = React.useState("desc");
    const [orderBy3, setOrderBy3] = React.useState("emailVerified");
    const [selected3, setSelected3] = React.useState([]);
    const [page3, setPage3] = React.useState(0);
    const [dense3] = React.useState(false);
    const [rowsPerPage3, setRowsPerPage3] = React.useState(5);
    const [rows, setRows] = React.useState([]);

    function handleRequestSort3(event, property) {
        const isDesc = orderBy3 === property && order3 === "desc";
        setOrder3(isDesc ? "asc" : "desc");
        setOrderBy3(property);
    }

    function handleSelectAllClick3(event) {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.email);
            setSelected3(newSelecteds);
            return;
        }
        setSelected3([]);
    }

    function handleClick3(event, name) {
        const selectedIndex = selected3.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected3, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected3.slice(1));
        } else if (selectedIndex === selected3.length - 1) {
            newSelected = newSelected.concat(selected3.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected3.slice(0, selectedIndex),
                selected3.slice(selectedIndex + 1)
            );
        }
        setSelected3(newSelected);
    }

    function handleChangePage3(event, newPage) {
        setPage3(newPage);
    }

    function handleChangeRowsPerPage3(event) {
        setRowsPerPage3(+event.target.value);
    }

    const isSelected3 = name => selected3.indexOf(name) !== -1;

    const emptyRows3 =
        rowsPerPage3 - Math.min(rowsPerPage3, rows.length - page3 * rowsPerPage3);


    useEffect(() => {
        instance.get('getUserList')
            .then(response => {
                setRows(response.data.users);
            })
            .catch(err => {
                console.log("An error has been occured on Server Response");
            });
    }, [constantForEffect]);


    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className={classes3.root}>
                        <Paper className={classes3.paper}>
                            <EnhancedTableToolbar3 numSelected={selected3.length} />
                            <div className={classes3.tableWrapper}>
                                <Table
                                    className={classes3.table}
                                    aria-labelledby="tableTitle"
                                    size={dense3 ? "small" : "medium"}
                                >
                                    <EnhancedTableHead3
                                        numSelected={selected3.length}
                                        order={order3}
                                        orderBy={orderBy3}
                                        onSelectAllClick={handleSelectAllClick3}
                                        onRequestSort={handleRequestSort3}
                                        rowCount={rows.length}
                                    />
                                    <TableBody>
                                        {stableSort3(rows, getSorting(order3, orderBy3))
                                            .slice(
                                                page3 * rowsPerPage3,
                                                page3 * rowsPerPage3 + rowsPerPage3
                                            )
                                            .map((row, index) => {
                                                const isItemSelected = isSelected3(row.email);
                                                const labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <TableRow
                                                        hover
                                                        onClick={event =>
                                                            handleClick3(event, row.email)
                                                        }
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={row.email}
                                                        selected={isItemSelected}
                                                    >
                                                        {/* <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={isItemSelected}
                                                                inputProps={{
                                                                    "aria-labelledby": labelId
                                                                }}
                                                            />
                                                        </TableCell> */}

                                                        <TableCell component="th" id={labelId} scope="row">
                                                            {row.email}
                                                        </TableCell>

                                                        <TableCell align="left"> {row.emailVerified ? 'Yes' : 'No'} </TableCell>

                                                        <TableCell align="left">{row.metadata.creationTime}</TableCell>

                                                        <TableCell align="left">{row.metadata.lastSignInTime}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        {emptyRows3 > 0 && (
                                            <TableRow style={{ height: 49 * emptyRows3 }}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage3}
                                page={page3}
                                backIconButtonProps={{
                                    "aria-label": "Previous Page"
                                }}
                                nextIconButtonProps={{
                                    "aria-label": "Next Page"
                                }}
                                onChangePage={handleChangePage3}
                                onChangeRowsPerPage={handleChangeRowsPerPage3}
                            />
                        </Paper>
                    </div>
                </div>
            </div >
        </>
    );
};
