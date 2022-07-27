import React, {useEffect} from 'react';
import {
    Grid,
    Typography
} from "@material-ui/core";
import useStyles from "./styles";

import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {visuallyHidden} from '@mui/utils';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ArchiveIcon from '@mui/icons-material/Archive';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {styled} from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import classNames from "classnames";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CancelIcon from '@mui/icons-material/Cancel';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import {
    sendBid, startAuction,
    useNearWalletDispatch,
    useNearWalletState,
    viewPlayerByAccount,
    viewPlayers
} from "../../context/NearWalletContext";
import {formatNearAmount, parseNearAmount} from "near-api-js/lib/utils/format";
import {CircularProgress, ListItemText, OutlinedInput} from "@mui/material";

function createData(name, calories, fat, carbs, protein, type, date) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        type,
        date
    };
}


const rows = [
    createData('Cupcake', '5 Star Class', 7777, 5999, 4.3, '120x600', '12 Dec, 2020'),
    createData('Donut', 'VFX 18', 5024, 4222, 4.9, '120x600', '12 Dec, 2020'),
    createData('Eclair', 'Rohit Sharma Cricket', 4014, 2234, 6.0, '120x600', '12 Dec, 2020'),
    createData('Frozen yoghurt', 'Sachin Tendulkar LIC', 3022, 1456, 4.0, '120x600', '12 Dec, 2020'),
    createData('Gingerbread', 'HDFC Bank Diwali', 2024, 987, 3.9, '120x600', '12 Dec, 2020'),
    createData('Honeycomb', 'ICC Club ', 1222, 652, 6.5, '120x600', '12 Dec, 2020'),
    createData('Ice cream sandwich', 999, 245, 245, 4.3, '120x600', '12 Dec, 2020'),
    createData('Jelly Bean', 'BCC Club', 0, 94, 0.0, '120x600', '12 Dec, 2020'),
    createData('KitKat', 'Coaching Class', 26.0, 65, 7.0, '120x600', '12 Dec, 2020'),
    createData('Lollipop', '5 Star Class', 0.2, 98, 0.0, '120x600', '12 Dec, 2020'),
    createData('Marshmallow', 'VFX 18', 0, 81, 2.0, '120x600', '12 Dec, 2020'),
    createData('Nougat', 'Rohit Sharma Cricket', 19.0, 9, 37.0, '120x600', '12 Dec, 2020'),
    createData('Oreo', 'BCC Club', 18.0, 63, 4.0, '120x600', '12 Dec, 2020'),
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {

        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'media',
        numeric: false,
        disablePadding: true,
        label: 'Media',
    },
    {
        id: 'title',
        numeric: true,
        disablePadding: false,
        label: 'Title',
    },
    {
        id: 'impression',
        numeric: true,
        disablePadding: false,
        label: 'Impression',
    },
    {
        id: 'clicks',
        numeric: true,
        disablePadding: false,
        label: 'Clicks',
    },
    {
        id: 'ctr',
        numeric: true,
        disablePadding: false,
        label: 'CTR',
    },
    {
        id: 'type',
        numeric: true,
        disablePadding: false,
        label: 'Type',
    },
    {
        id: 'created',
        numeric: true,
        disablePadding: false,
        label: 'Created',
    },
    {
        id: 'actions',
        numeric: true,
        disablePadding: false,
        label: 'Actions',
    },
];

function EnhancedTableHead(props) {
    const {onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            IconComponent={ArrowDropDownIcon}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};


const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({theme}) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

const steps = [
    'Description',
    'Media',
    'Preview and save',
];

export default function Adunits() {
    var classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    // const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    var nearWalletState = useNearWalletState();
    var nearWalletDispatch = useNearWalletDispatch();

    var [auctionId] = React.useState(() => crypto.randomUUID())
    var [bidId] = React.useState(() => crypto.randomUUID())
    var [addUnitsId] = React.useState(() => crypto.randomUUID())

    var [bidFloor, setBidFloor] = React.useState('1')
    var [bidPrice, setBidPrice] = React.useState('1')
    var [bidAuctionId, setBidAuctionId] = React.useState('')

    React.useEffect(() => {
        if (nearWalletState.wallet.isSignedIn()) {
            if (nearWalletState.playerInfo === 'not-set') {
                viewPlayerByAccount(nearWalletDispatch, nearWalletState.contract, nearWalletState.currentAccount.accountId)
            }
        }
    }, [])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const moreMenuHandleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openAdUnit, setOpenAdUnit] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');

    const handleClickAdUnitOpen = (scrollType) => () => {
        setOpenAdUnit(true);
        setScroll(scrollType);
    };

    const handleCloseAdUnit = () => {
        setOpenAdUnit(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (openAdUnit) {
            const {current: descriptionElement} = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openAdUnit]);


    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const [playerId, setPlayerId] = React.useState([]);

    const handleChangePlayers = (event) => {
        const {
            target: {value},
        } = event;
        setPlayerId(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    React.useEffect(() => {
        if (nearWalletState.wallet.isSignedIn()) {
            if (nearWalletState.players === 'not-set') {
                viewPlayers(nearWalletDispatch, nearWalletState.contract)
            }
        }
    }, [])

    const [auctionType, setAuctionType] = React.useState("open");

    const handleChange = (event) => {
        console.log(`handle change: ${event.target.value}`)
        setAuctionType(event.target.value);
    };
// Stepper
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            console.log('finish')
            handleCloseAdUnit()
            startAuction(nearWalletDispatch, auctionId, bidFloor, playerId)
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    // drag state
    const [dragActive, setDragActive] = React.useState(false);
    // ref
    const inputRef = React.useRef(null);

    // handle drag events
    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // triggers when file is dropped
    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // handleFiles(e.dataTransfer.files);
        }
    };

    // triggers when file is selected with click
    const filehandleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            // handleFiles(e.target.files);
        }
    };

    // triggers the input when the button is clicked
    const onButtonClick = () => {
        inputRef.current.click();
    };

    function formatNear(balance) {
        console.log(`balance: ${balance}`)
        return formatNearAmount(balance, 2)
    }

    return (
        <>
            <Grid container className={classes.container} spacing={4}>
                <Grid item lg={12} className={classes.headingContainer}>
                    {nearWalletState.wallet.isSignedIn()
                        ? nearWalletState.isLoading ? <CircularProgress/>
                            : <Stack spacing={1}>
                                <Typography variant={'h1'} weight="bold"
                                            className={classes.advKey}>{nearWalletState.playerInfo.player_type} | Key
                                    Analystics</Typography>
                                <Typography
                                    className={classes.acBalance}>{formatNear(nearWalletState.currentAccount.balance)} NEAR
                                    ACCOUNT BALANCE</Typography></Stack>
                        : <Typography className={classes.acBalance}> -- NEAR BALANCE</Typography>
                    }
                </Grid>
            </Grid>
            <Grid item className={classes.cardContainer} lg={12}>
                <Grid item lg={12} className={classes.chartsTitleWrp}>
                    <Typography className={classes.chartsTitle}>All Ad Units</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" startIcon={<AddIcon/>} onClick={handleClickAdUnitOpen('body')}>
                            New Ad Unit
                        </Button>
                    </Stack>
                </Grid>

                <Box sx={{width: '100%'}}>
                    <Paper sx={{width: '100%', mb: 2}} className={classes.customTableContainer}>
                        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                        <TableContainer>
                            <Table
                                sx={{minWidth: 750}}
                                aria-labelledby="tableTitle"
                                size={'medium'}
                                className={classes.customTable}
                            >
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                />
                                <TableBody>
                                    {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                                rows.slice().sort(getComparator(order, orderBy)) */}
                                    {stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.name);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    // onClick={(event) => handleClick(event, row.name)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.name}
                                                    selected={isItemSelected}
                                                    className={classes.tableRowCustomStyle}
                                                >
                                                    <TableCell padding="checkbox" className={classes.firstTd}>
                                                        <Checkbox
                                                            onClick={(event) => handleClick(event, row.name)}
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputProps={{
                                                                'aria-labelledby': labelId,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        <div className={classes.mediaWrp}></div>
                                                    </TableCell>
                                                    <TableCell align="left">{row.calories}</TableCell>
                                                    <TableCell align="left">{row.fat}</TableCell>
                                                    <TableCell align="left">{row.carbs}</TableCell>
                                                    <TableCell align="left">
                                                        <div
                                                            className={classNames(
                                                                classes.ctrWrp,
                                                                classes.ctrGreen,
                                                            )}>{row.protein}</div>
                                                    </TableCell>
                                                    <TableCell align="left">{row.type}</TableCell>
                                                    <TableCell align="left"><CalendarMonthIcon color="primary"
                                                                                               className={classes.calIcon}/>{row.date}
                                                    </TableCell>
                                                    <TableCell align="left" className={classes.lastTd}>
                                                        <RemoveRedEyeIcon color="primary"
                                                                          className={classes.customIcon}/>
                                                        <ContentCopyIcon color="primary"
                                                                         className={classes.customIcon}/>
                                                        <ArchiveIcon className={classes.customIcon}/>
                                                        <div className={classes.customIcon}>
                                                            <IconButton
                                                                id="demo-customized-button"
                                                                aria-controls={open ? 'demo-customized-menu' : undefined}
                                                                aria-haspopup="true"
                                                                aria-expanded={open ? 'true' : undefined}
                                                                variant="contained"
                                                                disableElevation
                                                                onClick={moreMenuHandleClick}
                                                            >
                                                                <MoreHorizIcon/>
                                                            </IconButton>
                                                            <StyledMenu
                                                                id="demo-customized-menu"
                                                                MenuListProps={{
                                                                    'aria-labelledby': 'demo-customized-button',
                                                                }}
                                                                anchorEl={anchorEl}
                                                                open={open}
                                                                onClose={handleClose}
                                                            >
                                                                <MenuItem onClick={handleClose} disableRipple
                                                                          className={classes.editItem}>
                                                                    <EditIcon className={classes.editIconColor}/>
                                                                    <span className={classes.editLable}>Edit</span>
                                                                </MenuItem>
                                                                <MenuItem onClick={handleClose} disableRipple
                                                                          className={classes.deleteItem}>
                                                                    <DeleteIcon className={classes.deleteIconColor}/>
                                                                    <span className={classes.deleteLable}>Delete</span>
                                                                </MenuItem>
                                                            </StyledMenu>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: (53) * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>
            </Grid>
            <Dialog
                open={openAdUnit}
                onClose={handleCloseAdUnit}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                className={classes.customModalWrp}
            >
                <CancelIcon onClick={handleCloseAdUnit} className={classes.customCloseIcon}/>
                <DialogTitle id="scroll-dialog-title" className={classes.customTitle}>Create New AD Unit</DialogTitle>
                <DialogContent dividers={scroll === 'paper'} className={classes.customContentWrp}>
                    <Box sx={{width: '100%'}}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>{label}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography sx={{mt: 2, mb: 1}}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {activeStep == 0 &&
                                    <>
                                        <div className={classes.customInputField}>
                                            <TextField
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: "#353535"
                                                    }
                                                }}
                                                variant="outlined"
                                                label="Type your Title"
                                                placeholder="Type your Title"
                                                InputLabelProps={{shrink: true}}
                                                fullWidth={true}
                                                inputProps={{
                                                    sx: {
                                                        "&::placeholder": {
                                                            color: "black"
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className={classes.customInputField}>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Description"
                                                placeholder="Type your Description"
                                                helperText="Type your Description"
                                                multiline
                                                rows={4}
                                                fullWidth={true}
                                            />
                                        </div>
                                        <div className={classes.customInputField}>
                                            <TextField
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: "#353535"
                                                    }
                                                }}
                                                variant="outlined"
                                                label="Target URL"
                                                placeholder="Type your entire URL"
                                                helperText="Include your entire URL including http:// or https://"
                                                InputLabelProps={{shrink: true}}
                                                fullWidth={true}
                                                inputProps={{
                                                    sx: {
                                                        "&::placeholder": {
                                                            color: "black"
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className={classes.customInputField}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Auction Type</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={auctionType}
                                                    label="Auction Type"
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={"open"}>Open Auction</MenuItem>
                                                    <MenuItem value={"private"}>Private Auction</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        {auctionType === "private" && (
                                            nearWalletState.players !== 'not-set' &&
                                            nearWalletState.players.length > 0
                                                ? <FormControl fullWidth>
                                                    <InputLabel id="demo-multiple-checkbox-label">Invited
                                                        advertisers</InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-checkbox-label"
                                                        id="demo-multiple-checkbox"
                                                        multiple
                                                        value={playerId}
                                                        onChange={handleChangePlayers}
                                                        input={<OutlinedInput label="Invited Advertisers"/>}
                                                        renderValue={(selected) => selected.join(', ')}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {nearWalletState.players.filter((player) => player.player_type === "Advertiser")
                                                            .map((player) => (
                                                                <MenuItem key={player.id}
                                                                          value={player.id}>
                                                                    <Checkbox
                                                                        checked={playerId.indexOf(player.id) > -1}/>
                                                                    <ListItemText primary={player.linked_account}/>
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                </FormControl>
                                                : <Typography>Players not found</Typography>)
                                        }
                                        <div className={classes.customInputField}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Programatic
                                                    direct</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={auctionType}
                                                    label="AProgramatic direct"
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={10}>Ten</MenuItem>
                                                    <MenuItem value={20}>Twenty</MenuItem>
                                                    <MenuItem value={30}>Thirty</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </>
                                }
                                {activeStep == 1 &&
                                    <form id="form-file-upload" className={classes.formFileUpload}
                                          onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                                        <input ref={inputRef} type="file" id="input-file-upload"
                                               className={classes.inputFileUpload} multiple={true}
                                               onChange={filehandleChange}/>
                                        <label id="label-file-upload" htmlFor="input-file-upload"
                                               className={dragActive ? classes.dragActiveStyle : classes.labelFileUpload}>
                                            <div>
                                                <p>Drag and drop your file here or</p>
                                                <button className={classes.uploadButton} onClick={onButtonClick}>Upload
                                                    a file
                                                </button>
                                            </div>
                                        </label>
                                        {dragActive && <div id="drag-file-element" className={classes.dragFileElement}
                                                            onDragEnter={handleDrag} onDragLeave={handleDrag}
                                                            onDragOver={handleDrag} onDrop={handleDrop}></div>}
                                    </form>
                                }
                                {activeStep == 2 &&
                                    <>
                                        <div className={classes.customInputField}>
                                            <TextField
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: "#353535"
                                                    }
                                                }}
                                                variant="outlined"
                                                label="Title"
                                                // placeholder="Type your Title"
                                                value={'John Almea'}
                                                InputLabelProps={{shrink: true}}
                                                fullWidth={true}
                                                inputProps={{
                                                    sx: {
                                                        "&::placeholder": {
                                                            color: "black"
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className={classes.customInputField}>
                                            <TextField
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: "#353535"
                                                    }
                                                }}
                                                variant="outlined"
                                                label="Owner"
                                                // placeholder="Type your Title"
                                                value={'0x35472435f6C4341D86e3B58fE1cb01C50e9E0516'}

                                                InputLabelProps={{shrink: true}}
                                                fullWidth={true}
                                                inputProps={{
                                                    sx: {
                                                        "&::placeholder": {
                                                            color: "black"
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className={classes.customInputField}>
                                            <TextField
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: "#353535"
                                                    }
                                                }}
                                                variant="outlined"
                                                label="Target URL"
                                                // placeholder="Type your Title"
                                                value={'http://abcefghijklmno.com'}

                                                InputLabelProps={{shrink: true}}
                                                fullWidth={true}
                                                inputProps={{
                                                    sx: {
                                                        "&::placeholder": {
                                                            color: "black"
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className={classes.customInputField}>
                                            <TextField
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: "#353535"
                                                    }
                                                }}
                                                variant="outlined"
                                                label="Avertising Type"
                                                // placeholder="Type your Title"
                                                value={'legacy_300x250 '}

                                                InputLabelProps={{shrink: true}}
                                                fullWidth={true}
                                                inputProps={{
                                                    sx: {
                                                        "&::placeholder": {
                                                            color: "black"
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className={classes.customInputField}>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Description"
                                                // placeholder="Type your Description"
                                                value={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing"}

                                                multiline
                                                rows={4}
                                                fullWidth={true}
                                            />
                                        </div>
                                    </>
                                }
                            </React.Fragment>
                        )}

                    </Box>
                </DialogContent>
                <DialogActions className={classes.custonButtonWrp}>
                    <Button onClick={handleBack} disabled={activeStep === 0} variant="outlined"
                            className={classes.roundedButton}>Back</Button>
                    <Button onClick={handleNext} variant="contained"
                            className={classes.roundedButton}>{activeStep === steps.length - 1 ? 'Publish' : 'Continue'}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}