import React from 'react';
import { Switch, Route } from 'react-router';
import Home from './views/home';
import About from './views/about';
import Data from './views/data';
import Tokens from './views/tokens';
import FourOhFour from './views/404';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/about" exact component={About} />
    <Route path="/data" exact component={Data} />
    <Route path="/tokens" exact component={Tokens} />

    <Route path="*" component={FourOhFour} />
  </Switch>
);

export default Routes;
