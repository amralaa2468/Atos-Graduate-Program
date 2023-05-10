import React from "react";
import PortalReactDOM from 'react-dom';
import { CSSTransition } from "react-transition-group";


import "./SideDrawer.css";

function SideDrawer(props) {
    const content = (
        <CSSTransition
            in={props.show}
            timeout={200}
            classNames="slide-in-left"
            mountOnEnter
            unmountOnExit>
            <aside className="side-drawer" onClick={props.onClick}>
                {props.children}
            </aside>
        </CSSTransition>
    );

    return PortalReactDOM.createPortal(
        content,
        document.getElementById("drawer-hook"));
}


export default SideDrawer;