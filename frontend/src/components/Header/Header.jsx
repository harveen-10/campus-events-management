import React from 'react';
import Logo from '../Logo/Logo';

function Header() {
    return (
        <div className="flex items-center justify-between bg-[#000000] px-4 py-4 h-20">
            <div className="flex items-center">
                <Logo />
            </div>
            {/* Add any other content you want within the header here */}
        </div>
    );
}

export default Header;
