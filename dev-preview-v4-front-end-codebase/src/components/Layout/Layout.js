import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Adunits from "../../pages/adunits/Adunits";
import Campaigns from '../../pages/campaigns/Campaigns'
import Audiences from '../../pages/audiences/Audiences'
import Topupaccount from '../../pages/topupaccount/Topupaccount'
import Transactions from '../../pages/transactions/Transactions'
import Account from '../../pages/account/Account'
// import Icons from '../../pages/icons/Icons'

// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path="/app/dashboard" component={Dashboard} />
              <Route path="/app/adunits" component={Adunits} />
              <Route path="/app/campaigns" component={Campaigns} />
              <Route path="/app/audiences" component={Audiences} />
              <Route path="/app/topupaccount" component={Topupaccount} />
              <Route path="/app/transactions" component={Transactions} />
              <Route path="/app/account" component={Account} />
         {/* <Route path="/app/icons" component={Icons} /> */}
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
