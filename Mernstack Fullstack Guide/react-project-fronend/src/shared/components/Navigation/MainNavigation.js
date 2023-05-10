import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop/Backdrop"
import "./MainNavigation.css";

function MainNavigation(props) {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    function openDrawerHandler() {
        setDrawerIsOpen(true);
    }

    function closeDrawerHandler() {
        setDrawerIsOpen(false);
    }

    return (
        <React.Fragment>
            {drawerIsOpen ? <Backdrop onClick={closeDrawerHandler}></Backdrop>
                : null}

            <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks></NavLinks>
                </nav>
            </SideDrawer>

            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">YourPlaces</Link>
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks></NavLinks>
                </nav>
            </MainHeader>
        </React.Fragment>
    );
}

export default MainNavigation;