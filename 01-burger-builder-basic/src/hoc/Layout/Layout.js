import React, { Component } from 'react';

import Auxiliary from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import classes from './Layout.css';

class Layout extends Component {

  state = {
    showDideDrawer: false,
  }

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => { return { showDideDrawer: !prevState.showDideDrawer } })
  }

  sideDrawerClosedHandler = () => {
    this.setState({ showDideDrawer: false })
  }

  render() {
    return (

      <Auxiliary>
        <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
        <SideDrawer open={this.state.showDideDrawer} closed={this.sideDrawerClosedHandler} />
        <main className={classes.Content}>{this.props.children}</main>
        )
      </Auxiliary >
    )
  }
}
export default Layout;
