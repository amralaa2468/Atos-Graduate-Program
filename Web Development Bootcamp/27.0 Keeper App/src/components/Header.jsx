import React from "react";
import HighlightIcon from '@mui/icons-material/Highlight';

function Header() {
    return (
        <header className="header">
            <h1>
                <HighlightIcon></HighlightIcon>
                Keeper
            </h1>
        </header>
    );
}

export default Header;