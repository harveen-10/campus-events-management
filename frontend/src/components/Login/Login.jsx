// import React, { useState } from 'react'
// import Landing_pg from '../Landing_pg/Landing_pg'
// import {Link, useNavigate} from 'react-router-dom'

// function Login() {
//     const [responseMessage, setResponseMessage] = useState("");
//     const [user, setuser] = useState({
//         srn: "",
//         password: "",
//     });
//     const navigate=useNavigate();
    
//     const handleSubmit = async (e) =>{
//         e.preventDefault();
//         console.log(user);

//         try{
//             const response=await fetch(`http://localhost:3000/login`, {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': "application/json",
//                 },
//                 body: JSON.stringify(user)
//             });

//             const responseData = await response.text();
            
//             if(responseData==="Incorrect password" || responseData==="User not found" || responseData==="SRN is required" || responseData==="Error comparing password:"){
//                 setResponseMessage(responseData);
//             }
//             else if(response.ok){
//                 const currentUser = { srn: user.srn };
//                 setuser({
//                     srn: "",
//                     password: "",            
//                 });
//                 console.log("currentuser: ", currentUser);
//                 navigate("/home", { state: { currentUser } });
//             }
//         }
//         catch(err){
//             console.log("error in registration", err);
//         }
//     }
      

//     return <>
//     <div>
        
//     </div>
//         <form onSubmit={handleSubmit}>
//             <div className='font-raleway fixed inset-0 w-full h-screen bg-black bg-opacity-60 z-10'>
//             <div className='flex justify-center items-center h-screen'>
//                 <div className='bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col'> 
//                     <label htmlFor="SRN" className="font-semibold text-gray-800">SRN</label>
//                     <input type="text" name="SRN" id="SRN" value={user.srn} className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none" onChange={(e) => setuser({ ...user, srn: e.target.value })}/>
//                     <label htmlFor="password" className="mt-4 font-semibold text-gray-800">Password</label>
//                     <input type="password" name="password" id="password" value={user.password} className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-400 text-gray-800 font-semibold focus:border-orange-500 focus:outline-none" onChange={(e) => setuser({ ...user, password: e.target.value })}/>
//                     <p className='text-red-700'>{responseMessage}</p>
//                     <button type='submit' className='w-1/3 mx-auto px-3 py-1 my-4 bg-[#5C75CF] text-white rounded shadow hover:bg-[#1C3068]'>Login</button>
//                     <div className='border-t border-gray-300 my-4'></div>
//                     <p className='mx-auto'>Dont have an account?</p>
//                     <Link to='/signup' className='flex justify-center'>
//                         <button className='w-1/4 mx-auto px-3 py-1 bg-[#D28A27] text-white rounded shadow hover:bg-[#D08D2A]'>Sign up</button>
//                     </Link>
//                 </div>
//             </div>
//             </div>
//         </form>
//         <Landing_pg/>
//     </>
// }

// export default Login


import React, { useState } from "react";
import Landing_pg from "../Landing_pg/Landing_pg";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [responseMessage, setResponseMessage] = useState("");
    const [user, setuser] = useState({
        srn: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user);

        try {
            const response = await fetch(`http://localhost:3000/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const responseData = await response.text();

            if (
                responseData === "Incorrect password" ||
                responseData === "User not found" ||
                responseData === "SRN is required" ||
                responseData === "Error comparing password:"
            ) {
                setResponseMessage(responseData);
            } else if (response.ok) {
                const currentUser = { srn: user.srn };
                setuser({
                    srn: "",
                    password: "",
                });
                console.log("currentUser: ", currentUser);
                navigate("/home", { state: { currentUser } });
            }
        } catch (err) {
            console.error("Error in login: ", err);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
                >
                    <h1 className="text-2xl font-bold text-center text-gray-800">
                        Login
                    </h1>

                    {/* SRN */}
                    <div>
                        <label
                            htmlFor="SRN"
                            className="block text-sm font-semibold text-gray-700"
                        >
                            SRN
                        </label>
                        <input
                            type="text"
                            name="SRN"
                            id="SRN"
                            value={user.srn}
                            onChange={(e) =>
                                setuser({ ...user, srn: e.target.value })
                            }
                            className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={user.password}
                            onChange={(e) =>
                                setuser({ ...user, password: e.target.value })
                            }
                            className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Response Message */}
                    {responseMessage && (
                        <p className="text-center text-sm text-red-600 font-medium">
                            {responseMessage}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all shadow-md"
                    >
                        Login
                    </button>

                    <div className="border-t border-gray-300 my-4"></div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-700">
                            Don’t have an account?
                        </p>
                        <Link to="/signup">
                            <button
                                type="button"
                                className="w-2/3 mt-2 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all shadow-md"
                            >
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </form>
            </div>

            <Landing_pg />
        </>
    );
}

export default Login;
