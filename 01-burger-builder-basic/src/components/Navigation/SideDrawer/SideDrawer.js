import React from 'react'
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';
import Logo from '../../Logo/Logo';
import Backdrop from '../../UI/Backdrop/Backdrop';
import NavigationItems from '../NavigationItems/NavigationItems';

import classes from './SideDrawer.css'

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close]
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open]
    }
    return (
        <Auxiliary>
            <Backdrop show={props.open} clicked={props.closed}> </Backdrop>
            <div className={attachedClasses.join(' ')}>
                <div className={classes.Logo}>
                    <Logo ></Logo>
                </div>
                <nav>
                    <NavigationItems></NavigationItems>

                </nav>
            </div>
        </Auxiliary>
    )
}

export default sideDrawer;