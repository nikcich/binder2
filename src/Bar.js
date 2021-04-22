import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ListIcon from '@material-ui/icons/List';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import {Link} from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';

const LinkStyles={
    width: "5vh",
    height: "5vh",
    maxHeight: "5vh" 
};

const iconStyles={
    height: "5vh", 
    width: "5vh", 
    maxHeight: "5vh" 
};
const icStyles = {
    fill: "white", 
    height: "5vh",
    width: "5vh", 
    maxHeight: "5vh" 
};

const Bar = (props) => {

    return (
        <div>
            <div className="Bar">
                <div className="left-bar">
                <div className="right-bar">
                    <Link to="/home" style={LinkStyles}>
                        <IconButton style={iconStyles}>
                            <HomeIcon style={icStyles}/>
                        </IconButton>
                    </Link>
                </div>
                </div>
                <img src={'http://66.228.51.99:4000/getimage/-1'} className="barLogo" alt="Loading..."></img>
                <div className="right-bar">
                    <Link to="/top" style={LinkStyles}>
                        <IconButton style={iconStyles}>
                            <ListIcon style={icStyles}/>
                        </IconButton>
                    </Link>

                    <Link to="/account" style={LinkStyles}>
                        <IconButton style={iconStyles}>
                            <AccountBoxIcon style={icStyles}/>
                        </IconButton>
                    </Link>
                </div>
            </div>
            <div className="marginBar">

            </div>
        </div>

        
    );
}
  
export default Bar;