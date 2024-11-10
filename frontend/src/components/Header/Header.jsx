import React from 'react'
import Logo from '../Logo/Logo'


function Header() {
    return (
        <>
            <div className="flex items-center justify-between bg-[#FFAC30] px-4 py-2.5 h-11">   
            </div>
            <div className="flex">
                <div className="ml-[-40px]">
                    <Logo />
                </div>
            </div>
        </>
    )
}

export default Header
