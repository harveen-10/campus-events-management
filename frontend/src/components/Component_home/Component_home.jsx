import React from 'react';

function Component_home({ imgSrc, name, date }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 max-w-xs mx-auto">
            <img src={imgSrc} alt={name} className="rounded-t-lg h-40 w-full object-cover" />
            <div className="flex justify-between items-center mt-4">
                <h2 className="text-lg font-semibold">{name}</h2>
                <p className="text-sm text-gray-500">{date}</p>
            </div>
            <button 
                className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => console.log('Register clicked')}
            >
                Register
            </button>
        </div>
    );
}

export default Component_home;
