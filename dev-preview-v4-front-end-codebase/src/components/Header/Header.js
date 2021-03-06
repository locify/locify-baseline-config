import React, {useState} from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    InputBase,
    Menu,
    MenuItem,
    Fab,
} from "@material-ui/core";
import {
    Menu as MenuIcon,
    MailOutline as MailIcon,
    NotificationsNone as NotificationsIcon,
    Person as AccountIcon,
    Search as SearchIcon,
    Send as SendIcon,
    ArrowBack as ArrowBackIcon,
    Settings as SettingsIcon
} from "@material-ui/icons";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import {Badge, Typography} from "../Wrappers/Wrappers";
import Notification from "../Notification/Notification";
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Logo from "./locifyLogo.png"

// context
import {
    useLayoutState,
    useLayoutDispatch,
    toggleSidebar,
} from "../../context/LayoutContext";
import {useUserDispatch, signOut} from "../../context/UserContext";
import {
    loginNearWallet,
    signOutNearWallet,
    useNearWalletDispatch,
    useNearWalletState
} from "../../context/NearWalletContext";
import {Avatar, Box, Popover, Stack} from "@mui/material";
import {formatNearAmount} from "near-api-js/lib/utils/format";

const messages = [
    {
        id: 0,
        variant: "warning",
        name: "Jane Hew",
        message: "Hey! How is it going?",
        time: "9:32",
    },
    {
        id: 1,
        variant: "success",
        name: "Lloyd Brown",
        message: "Check out my new Dashboard",
        time: "9:18",
    },
    {
        id: 2,
        variant: "primary",
        name: "Mark Winstein",
        message: "I want rearrange the appointment",
        time: "9:15",
    },
    {
        id: 3,
        variant: "secondary",
        name: "Liana Dutti",
        message: "Good news from sale department",
        time: "9:09",
    },
];

const notifications = [
    {id: 0, color: "warning", message: "Check out this awesome ticket"},
    {
        id: 1,
        color: "success",
        type: "info",
        message: "What is the best way to get ...",
    },
    {
        id: 2,
        color: "secondary",
        type: "notification",
        message: "This is just a simple notification",
    },
    {
        id: 3,
        color: "primary",
        type: "e-commerce",
        message: "12 new orders has arrived today",
    },
];

export default function Header(props) {
    var classes = useStyles();

    // global
    var layoutState = useLayoutState();
    var layoutDispatch = useLayoutDispatch();
    var userDispatch = useUserDispatch();
    var nearWalletState = useNearWalletState();
    var nearWalletDispatch = useNearWalletDispatch();

    // local
    var [mailMenu, setMailMenu] = useState(null);
    var [isMailsUnread, setIsMailsUnread] = useState(true);
    var [notificationsMenu, setNotificationsMenu] = useState(null);
    var [isNotificationsUnread, setIsNotificationsUnread] = useState(true);
    var [profileMenu, setProfileMenu] = useState(null);
    var [isSearchOpen, setSearchOpen] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <IconButton
                    color="inherit"
                    onClick={() => toggleSidebar(layoutDispatch)}
                    className={classNames(
                        classes.headerMenuButton,
                        classes.headerMenuButtonCollapse,
                    )}
                >
                    {layoutState.isSidebarOpened ? (
                        <ArrowBackIcon
                            classes={{
                                root: classNames(
                                    classes.headerIcon,
                                    classes.headerIconCollapse,
                                ),
                            }}
                        />
                    ) : (
                        <MenuIcon
                            classes={{
                                root: classNames(
                                    classes.headerIcon,
                                    classes.headerIconCollapse,
                                ),
                            }}
                        />
                    )}
                </IconButton>
                <Box
                    component={'img'}
                    sx={{
                        height: 32,
                    }}
                    alt={'Locify logo'}
                    src={Logo}
                />
                <div className={classes.grow}/>
                <IconButton
                    color="inherit"
                    aria-haspopup="true"
                    aria-controls="mail-menu"
                    className={classes.headerMenuButton}
                >
                    <Badge
                        color="secondary"
                    >
                        <SettingsIcon
                            classes={{
                                root: classNames(
                                    classes.headerRightIcon
                                ),
                            }}
                        />
                    </Badge>
                </IconButton>
                <IconButton
                    color="inherit"
                    aria-haspopup="true"
                    aria-controls="mail-menu"
                    onClick={e => {
                        setNotificationsMenu(e.currentTarget);
                        setIsNotificationsUnread(false);
                    }}
                    className={classes.headerMenuButton}
                >
                    <Badge
                        badgeContent={isNotificationsUnread ? notifications.length : null}
                        color="warning"
                    >
                        <NotificationsIcon classes={{root: classes.headerRightIcon}}/>
                    </Badge>
                </IconButton>

                <IconButton
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.headerMenuButton}
                    aria-controls="profile-menu"
                    onClick={e => setProfileMenu(e.currentTarget)}
                >
                    <AccountIcon classes={{root: classes.headerRightIcon}}/>
                </IconButton>

                <Menu
                    id="notifications-menu"
                    open={Boolean(notificationsMenu)}
                    anchorEl={notificationsMenu}
                    onClose={() => setNotificationsMenu(null)}
                    className={classes.headerMenu}
                    disableAutoFocusItem
                >
                    {notifications.map(notification => (
                        <MenuItem
                            key={notification.id}
                            onClick={() => setNotificationsMenu(null)}
                            className={classes.headerMenuItem}
                        >
                            <Notification {...notification} typographyVariant="inherit"/>
                        </MenuItem>
                    ))}
                </Menu>
                <Menu
                    id="profile-menu"
                    open={Boolean(profileMenu)}
                    anchorEl={profileMenu}
                    onClose={() => setProfileMenu(null)}
                    className={classes.headerMenu}
                    classes={{paper: classes.profileMenu}}
                    disableAutoFocusItem
                >
                    <div className={classes.profileMenuUser}>
                        <Typography variant="h4" weight="medium">
                            John Smith
                        </Typography>
                        <Typography
                            className={classes.profileMenuLink}
                            component="a"
                            color="primary"
                            href="https://flatlogic.com"
                        >
                            Flalogic.com
                        </Typography>
                    </div>
                    {nearWalletState.wallet.isSignedIn() ? (
                            <><Popover
                                id="mouse-over-popover"
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={open}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                onClose={handlePopoverClose}
                                disableRestoreFocus
                            >
                                <Typography
                                    sx={{p: 1}}>Balance: {formatNearAmount(nearWalletState.currentAccount.balance, 2)}</Typography>
                            </Popover>
                                <MenuItem
                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                    aria-haspopup="true"
                                    onMouseEnter={handlePopoverOpen}
                                    onMouseLeave={handlePopoverClose}
                                    className={classNames(
                                        classes.profileMenuItem,
                                        classes.headerMenuItem,
                                    )}
                                >
                                    <Stack
                                        alignItems={'center'}
                                        direction={'row'}
                                        spacing={2}>
                                        <AccountIcon className={classes.profileMenuIcon}/>
                                        {nearWalletState.currentAccount.accountId}
                                        <IconButton
                                            aria-label="logout"
                                            onClick={() => signOutNearWallet(nearWalletDispatch)}
                                        >
                                            <LogoutIcon/>
                                        </IconButton>
                                    </Stack>

                                </MenuItem></>)
                        : (<MenuItem
                            className={classNames(
                                classes.profileMenuItem,
                                classes.headerMenuItem,
                            )}
                            onClick={() => loginNearWallet(nearWalletDispatch)}
                        >
                            <Stack
                                alignItems={'center'}
                                direction={'row'}
                                spacing={2}>
                                <AccountIcon className={classes.profileMenuIcon}/>
                                Near Login
                                <IconButton
                                    aria-label="logout"
                                    onClick={() => signOutNearWallet(nearWalletDispatch)}
                                >
                                    <LoginIcon/>
                                </IconButton>
                            </Stack>
                        </MenuItem>)
                    }

                    <MenuItem
                        className={classNames(
                            classes.profileMenuItem,
                            classes.headerMenuItem,
                        )}
                    >
                        <AccountIcon className={classes.profileMenuIcon}/> Profile
                    </MenuItem>
                    <MenuItem
                        className={classNames(
                            classes.profileMenuItem,
                            classes.headerMenuItem,
                        )}
                    >
                        <AccountIcon className={classes.profileMenuIcon}/> Tasks
                    </MenuItem>
                    <MenuItem
                        className={classNames(
                            classes.profileMenuItem,
                            classes.headerMenuItem,
                        )}
                    >
                        <AccountIcon className={classes.profileMenuIcon}/> Messages
                    </MenuItem>
                    <div className={classes.profileMenuUser}>
                        <Typography
                            className={classes.profileMenuLink}
                            color="primary"
                            onClick={() => signOut(userDispatch, props.history)}
                        >
                            Sign Out
                        </Typography>
                    </div>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
