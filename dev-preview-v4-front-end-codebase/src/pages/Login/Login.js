import React, {useState} from "react";
import {
    Grid,
    Typography,
    Button
} from "@material-ui/core";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import * as Icons from "@material-ui/icons";
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
// styles
import useStyles from "./styles";
import {withRouter} from "react-router-dom";
// context
import {useUserDispatch, loginUser} from "../../context/UserContext";

function Login(props) {
    var classes = useStyles();

    // global
    var userDispatch = useUserDispatch();

    // local
    var [isLoading, setIsLoading] = useState(false);
    var [error, setError] = useState(null);
    var [nameValue, setNameValue] = useState("");
    var [loginValue, setLoginValue] = useState("");
    var [passwordValue, setPasswordValue] = useState("");

    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [scroll1, setScroll1] = React.useState('paper');

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };
    const handleClickOpen1 = (scrollType) => () => {
        setOpen1(true);
        setScroll1(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClose1 = () => {
        setOpen1(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const {current: descriptionElement} = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    const descriptionElementRef1 = React.useRef(null);
    React.useEffect(() => {
        if (open1) {
            const {current: descriptionElement} = descriptionElementRef1;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open1]);

    const steps = [
        'Quick wallet info'
    ];
    const steps1 = [
        'Quick account'
    ];
    const label = {inputProps: {'aria-label': 'Checkbox demo'}};
    const preventDefault = (event) => event.preventDefault();

    return (
        <>
            <Grid container className={classes.container} spacing={4}>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    <div className={classes.logotypeContainer}>
                        {/*<img src={logo} alt="logo" className={classes.logotypeImage} />*/}
                        <Typography className={classes.logotypeText}>Logo</Typography>
                    </div>
                    <Typography className={classes.loginwelcometext}>Welcome to Lorem Ipsum</Typography>
                    <Typography className={classes.logincontent}>Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.</Typography>
                </Grid>
                <Grid item className={classes.loginFormContainer} lg={4} md={4} sm={12} xs={12}>
                    <h1 className={classes.loginTitle}>Log in / Sign up</h1>
                    <div className={classes.buttonWrapper}>
                        <Typography variant="h6" className={classes.chooseOption}>Choose one of the options
                            below:</Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            className={classes.buttonStyle}
                            onClick={handleClickOpen('paper')}>
                            Create Account
                        </Button>

                        <Dialog
                            open={open}
                            onClose={handleClose}
                            scroll={scroll}
                            aria-labelledby="scroll-dialog-title"
                            aria-describedby="scroll-dialog-description"
                            fullWidth
                            maxWidth="md"
                        >
                            <DialogTitle id="scroll-dialog-title">
                                <Box sx={{width: '100%'}}>
                                    <Stepper activeStep={0} alternativeLabel>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>
                            </DialogTitle>
                            <DialogContent dividers={scroll === 'paper'}>
                                <DialogContentText
                                    id="scroll-dialog-description"
                                    ref={descriptionElementRef}
                                    tabIndex={-1}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            '& > :not(style)': {m: 1},
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Email*"
                                            id="fullWidth"
                                            helperText="Enter valid email address"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Password*"
                                            id="fullWidth"
                                            helperText="Minimum 8 characters, a number, an uppercase and a lowercase letter required"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Confirm Password*"
                                            id="fullWidth"
                                        />
                                        <FormControl sx={{m: 1, width: '100%'}}>
                                            <InputLabel id="demo-simple-select-helper-label">How did you hear about
                                                us?</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value={age}
                                                label="How did you hear about us?"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={'fecbook'}>Fecbook</MenuItem>
                                                <MenuItem value={'twitter'}>Twitter</MenuItem>
                                                <MenuItem value={'linkedIn'}>LinkedIn</MenuItem>
                                                <MenuItem value={'reddit'}>Reddit</MenuItem>
                                                <MenuItem value={'google'}>Google</MenuItem>
                                            </Select>
                                            <FormHelperText>Please select where you heard about us</FormHelperText>
                                        </FormControl>
                                        <FormControl sx={{m: 1, width: '100%'}}>
                                            <InputLabel id="demo-simple-select-helper-label">I will use the platform
                                                as:</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value={age}
                                                label="I will use the platform as:"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={'advertiser'}>
                                                    Advertiser
                                                    <Tooltip
                                                        title="Lorem Ipsum is simply dummy text of the printing and typesetting industry.">
                                                        <IconButton>
                                                            <Icons.Info color={"primary"} fontSize="small"/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </MenuItem>
                                                <MenuItem value={'publisher'}>
                                                    Publisher
                                                    <Tooltip
                                                        title="Lorem Ipsum is simply dummy text of the printing and typesetting industry.">
                                                        <IconButton>
                                                            <Icons.Info color={"primary"} fontSize="small"/>
                                                        </IconButton>
                                                    </Tooltip>
                                                </MenuItem>
                                            </Select>
                                            <FormHelperText>If you plan to use your account as both, indicate the
                                                primary use.</FormHelperText>
                                        </FormControl>
                                        <Grid
                                            className={classes.termsConditionWrp}
                                            item
                                        >
                                            <Checkbox {...label} />
                                            <Box
                                                sx={{
                                                    typography: 'body1',
                                                    '& > :not(style) + :not(style)': {
                                                        ml: 2,
                                                    },
                                                }}
                                                onClick={preventDefault}
                                                className={classes.linkWrp}
                                            >
                                                <Typography className={classes.termsCondition}>I have read and agree to
                                                    the </Typography>
                                                <Link href="#" className={classes.termsConditionLink}>Terms and
                                                    conditions <Icons.Launch color={"primary"}
                                                                             className={classes.launchIcon}/></Link>
                                            </Box>
                                        </Grid>
                                    </Box>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    className={classes.buttonStyle}
                                    onClick={handleClose}>
                                    Continue
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.buttonStyle}
                            onClick={handleClickOpen1('paper')}>
                            Login
                        </Button>
                        <Dialog
                            open={open1}
                            onClose={handleClose1}
                            scroll={scroll1}
                            aria-labelledby="scroll-dialog-title"
                            aria-describedby="scroll-dialog-description"
                            fullWidth
                            maxWidth="md"
                        >
                            <DialogTitle id="scroll-dialog-title">
                                <Box sx={{width: '100%'}}>
                                    <Stepper activeStep={0} alternativeLabel>
                                        {steps1.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>
                            </DialogTitle>
                            <DialogContent dividers={scroll1 === 'paper'}>
                                <DialogContentText
                                    id="scroll-dialog-description"
                                    ref={descriptionElementRef1}
                                    tabIndex={-1}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            '& > :not(style)': {m: 1},
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Email*"
                                            id="fullWidth"
                                            value={loginValue}
                                            onChange={e => setLoginValue(e.target.value)}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Password*"
                                            id="fullWidth"
                                            value={passwordValue}
                                            onChange={e => setPasswordValue(e.target.value)}
                                        />
                                        <FormControl sx={{m: 1, width: '100%'}}>
                                            <InputLabel id="demo-simple-select-helper-label">I will use the platform
                                                as:</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value={age}
                                                label="I will use the platform as:"
                                                onChange={handleChange}
                                            >
                                                <MenuItem value={'advertiser'}>
                                                    Advertiser
                                                </MenuItem>
                                                <MenuItem value={'publisher'}>
                                                    Publisher
                                                </MenuItem>
                                            </Select>
                                            <FormHelperText>If you plan to use your account as both, indicate the
                                                primary use.</FormHelperText>
                                        </FormControl>
                                    </Box>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose1}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    className={classes.buttonStyle}
                                    disabled={
                                        loginValue.length === 0 || passwordValue.length === 0
                                    }
                                    onClick={() =>
                                        loginUser(
                                            userDispatch,
                                            loginValue,
                                            passwordValue,
                                            props.history,
                                            setIsLoading,
                                            setError,
                                        )
                                    }
                                >
                                    Continue
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Button
                            variant="outlined"
                            color="inherit"
                            size="large"
                            className={classes.buttonStyle}>
                            Metamax
                        </Button>
                        <Button
                            variant="outlined"
                            color="inherit"
                            size="large"
                            className={classes.buttonStyle}>
                            Trezor
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default withRouter(Login);