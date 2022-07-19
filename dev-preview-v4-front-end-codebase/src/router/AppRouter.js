import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from '../pages/Login';
const AppRouter = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route component={Login} path="/" exact={true} />
               {/*<Route component={Portfolio} path="/Portfolio" exact={true} />*/} 
            </Switch>
        </BrowserRouter>
    );
};

export default AppRouter;
