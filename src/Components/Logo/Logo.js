import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import logo from './Logo.png';
const Logo = () => {
    return(
        <div className="ma4 mt0">
            <Tilt className="Tilt br2 shadow-2" style={{ height: '150px',width: '150px'}}>
                <div className="Tilt-inner pa3">
                    <img style={{padding:'5px'}} alt="Logo" src={logo} />
                </div>
            </Tilt>
        </div>
    );
}
export default Logo;