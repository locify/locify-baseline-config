import React from 'react';
import {
    Grid,
    Typography,
    Button
} from "@material-ui/core";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import * as Icons from "@material-ui/icons";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import classNames from "classnames";
import useStyles from "./styles";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import {formatNearAmount} from "near-api-js/lib/utils/format";
import {useNearWalletState} from "../../context/NearWalletContext";

export default function Dashboard(props) {
    var classes = useStyles();

    const [timeframe, setTimeframe] = React.useState('');
    const [value, setValue] = React.useState(new Date());

    const handleChange = (event) => {
        setTimeframe(event.target.value);
    };

    function formatNear(balance) {
        console.log(`balance: ${balance}`)
        return formatNearAmount(balance, 2)
    }
    var nearWalletState = useNearWalletState();

    return (
        <>
            <Grid container className={classes.container} spacing={4}>
                <Grid item lg={12} className={classes.headingContainer}>
                    <Typography variant="h1" weight="bold" className={classes.advKey}>Advertiser | Key
                        Analystics</Typography>
                    {nearWalletState.wallet.isSignedIn()
                        ? <Typography
                            className={classes.acBalance}> {formatNear(nearWalletState.currentAccount.balance)} NEAR
                            ACCOUNT BALANCE</Typography>
                        : <Typography className={classes.acBalance}> -- NEAR BALANCE</Typography>
                    }
                </Grid>
                <Grid item className={classes.cardContainer} lg={12}>
                    <Grid item lg={12} className={classes.chartsTitleWrp}>
                        <Typography className={classes.chartsTitle}>Charts</Typography>
                    </Grid>
                    <Grid item lg={12}>
                        <Grid item lg={12} className={classes.headerWrapper}>
                            <Grid item lg={2} md={2} sm={12} xs={12} className={classes.timeFrameWrp}>
                                <FormControl sx={{width: '100%'}}>
                                    <InputLabel id="demo-simple-select-helper-label">Timeframe</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        value={timeframe}
                                        label="Timeframe"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'hour'}>Hour</MenuItem>
                                        <MenuItem value={'day'}>Day</MenuItem>
                                        <MenuItem value={'week'}>Week</MenuItem>
                                        <MenuItem value={'month'}>Month</MenuItem>
                                        <MenuItem value={'year'}>Year</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={10} md={10} sm={12} xs={12} className={classes.dateTimeWrp}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        renderInput={(props) => <TextField {...props} />}
                                        label="Select Date"
                                        value={value}
                                        onChange={(newValue) => {
                                            setValue(newValue);
                                        }}
                                    />
                                </LocalizationProvider>
                                <div className={classes.headerIconWrp}>
                                    <CalendarMonthIcon color="primary"/>
                                </div>
                                <div className={classes.headerIconWrp}>
                                    <AccessTimeFilledIcon color="primary"/>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item className={classes.boxContainer} lg={12} md={12} sm={12} xs={12}>
                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <Grid className={classes.boxWrapper}>
                                    <div className={classes.iconWrp}>
                                        <Icons.RemoveRedEye className={classes.eyeIcon} fontSize="small"/>
                                    </div>
                                    <div className={classes.content}>
                                        <Typography className={classes.number}>0</Typography>
                                        <Typography className={classes.labelName}>Total Impression</Typography>
                                    </div>
                                    <div className={classes.arrowWrapper}>
                                        <Icons.ChevronRight className={classes.rightIcon} fontSize="large"/>
                                    </div>
                                </Grid>
                            </Grid>

                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <Grid
                                    className={classNames(
                                        classes.boxWrapper,
                                        classes.whiteBg,
                                    )}>
                                    <div
                                        className={classNames(
                                            classes.iconWrp,
                                            classes.iconWhiteBg,
                                        )}>
                                        <Icons.RemoveRedEye className={classes.eyeIcon} fontSize="small"/>
                                    </div>
                                    <div className={classes.content}>
                                        <Typography
                                            className={classNames(
                                                classes.number,
                                                classes.numberBlack,
                                            )}>0(0.00 % CTR)</Typography>
                                        <Typography
                                            className={classNames(
                                                classes.labelName,
                                                classes.labelNameBlack,
                                            )}>Total Click & CTR</Typography>
                                    </div>
                                    <div className={classes.arrowWrapper}>
                                        <Icons.ChevronRight
                                            className={classNames(
                                                classes.rightIcon,
                                                classes.rightIconBlack,
                                            )} fontSize="large"/>
                                    </div>
                                </Grid>
                            </Grid>

                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <Grid
                                    className={classNames(
                                        classes.boxWrapper,
                                        classes.whiteBg,
                                    )}>
                                    <div
                                        className={classNames(
                                            classes.iconWrp,
                                            classes.iconWhiteBg,
                                        )}>
                                        <Icons.RemoveRedEye className={classes.eyeIcon} fontSize="small"/>
                                    </div>
                                    <div className={classes.content}>
                                        <Typography
                                            className={classNames(
                                                classes.number,
                                                classes.numberBlack,
                                            )}>~0.00 NEAR</Typography>
                                        <Typography
                                            className={classNames(
                                                classes.labelName,
                                                classes.labelNameBlack,
                                            )}>Total Speed</Typography>
                                    </div>
                                    <div className={classes.arrowWrapper}>
                                        <Icons.ChevronRight
                                            className={classNames(
                                                classes.rightIcon,
                                                classes.rightIconBlack,
                                            )} fontSize="large"/>
                                    </div>
                                </Grid>
                            </Grid>

                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <Grid
                                    className={classNames(
                                        classes.boxWrapper,
                                        classes.whiteBg,
                                    )}>
                                    <div
                                        className={classNames(
                                            classes.iconWrp,
                                            classes.iconWhiteBg,
                                        )}>
                                        <Icons.RemoveRedEye className={classes.eyeIcon} fontSize="small"/>
                                    </div>
                                    <div className={classes.content}>
                                        <Typography
                                            className={classNames(
                                                classes.number,
                                                classes.numberBlack,
                                            )}>~0.00 NEAR / CPM</Typography>
                                        <Typography
                                            className={classNames(
                                                classes.labelName,
                                                classes.labelNameBlack,
                                            )}>Average CPM</Typography>
                                    </div>
                                    <div className={classes.arrowWrapper}>
                                        <Icons.ChevronRight
                                            className={classNames(
                                                classes.rightIcon,
                                                classes.rightIconBlack,
                                            )} fontSize="large"/>
                                    </div>
                                </Grid>
                            </Grid>

                        </Grid>

                        <Grid item className={classes.noDataContainer} lg={12} md={12} sm={12} xs={12}>
                            <Typography className={classes.noData}>No Data</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}