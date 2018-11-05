import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Home from './views/home';
import About from './views/about';
import Data from './views/data';
import Tokens from './views/tokens';
import FourOhFour from './views/404';

const Routes = () => (
  <Switch>
    <Redirect exact from="/" to="/tokens/1" />
    <Route path="/tokens" exact component={Tokens} />
    <Route path="/tokens/:tokenId" exact component={Home} />
    <Route path="/about" exact component={About} />
    <Route path="/data" exact component={Data} />
    <Route path="*" component={FourOhFour} />
  </Switch>
);

export default Routes;
