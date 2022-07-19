import React, { useState, useEffect } from "react";
import { Drawer, IconButton, List } from "@material-ui/core";
import {
  Dashboard as HomeIcon,
  BorderAll as AddUnits,
  People as Audiences,
  AttachMoney as Account,
  Help as HelpIcon,
  AttachMoney as Transaction,
  AccountCircle as AccountProfile,
  ArrowBack as ArrowBackIcon,
  AcUnit as IconsIcon
} from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CampaignIcon from '@mui/icons-material/Campaign';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";

// context
import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

const structure = [
  { id: 0, label: "Dashboard", link: "/app/dashboard", icon: <HomeIcon /> },
  {
    id: 1,
    label: "Ad Units",
    link: "/app/adunits",
    icon: <FormatListBulletedIcon />,
  },
  { id: 2, label: "Camapigns", link: "/app/campaigns", icon: <CampaignIcon /> },
  {
    id: 3,
    label: "Audiences",
    link: "/app/audiences",
    icon: <Audiences />,
  },
  {
    id: 4,
    label: "Top Up Account",
    link: "/app/topupaccount",
    icon: <MonetizationOnIcon />,
  },
  {
    id: 5,
    label: "Help",
    link: "/app/help",
    icon: <HelpOutlineIcon />,
  },
  {
    id: 6,
    label: "Transactions",
    link: "/app/transactions",
    icon: <Transaction />,
  },
  {
    id: 7,
    label: "Account",
    link: "/app/account",
    icon: <AccountProfile />,
  },
  // {
  //   id: 7,
  //   label: "Icons",
  //   link: "/app/icons",
  //   icon: <IconsIcon />,
  // }
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  // global
  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  // local
  var [isPermanent, setPermanent] = useState(true);

  useEffect(function() {
    window.addEventListener("resize", handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener("resize", handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? "permanent" : "temporary"}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
