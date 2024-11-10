import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Component_home from '../Component_home/Component_home';
import './Home.css';

function Home() {
    const location = useLocation();
    const { currentUser } = location.state || {};
    const navigate = useNavigate();

    const [eventdetails, seteventdetails] = useState([{
        Ename: "",
        Event_date: "",
        Poster: "",
        EventID: ""
    }]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/home`, {
                    method: "GET"
                });

                const data = await response.json();
                seteventdetails(data.products.map(event => ({
                    Ename: event.Ename,
                    Event_date: event.Event_date,
                    Poster: event.Poster,
                    EventID: event.EventID
                })));
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    const handleNavigateToDetails = (eventID) => {
        const newUser = { eventID, srn: currentUser.srn };
        navigate("/event_details", { state: { newUser } });
    };

    const handleRegister = (eventID) => {
        const event = { eventID };
        navigate("/register", { state: { event } });
    };

    const handleCreateEvent = () => {
        navigate("/create_event");
    };

    const handleOrganizeEvent = () => {
        navigate("/organize_event");
    };

    const handleEventDetails = () => {
        navigate("/event_details");
    };
   
    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="flex justify-end w-full p-4 space-x-4 mb-6">
                <button 
                    onClick={handleCreateEvent} 
                    className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Create New Event
                </button>
                <button 
                    onClick={handleOrganizeEvent} 
                    className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    Organize an Existing Event
                </button>
                <button 
                    onClick={handleEventDetails} 
                    className="py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                    Event Details
                </button>
            </div>

            {eventdetails.length === 0 ? (
                <h1 className='font-raleway font-black text-3xl mt-40'>No events available</h1>
            ) : (
                <div className="flex-container">
                    {eventdetails.map(event => (
                        <Component_home 
                            key={event.EventID}
                            imgSrc={event.Poster} 
                            name={event.Ename} 
                            date={new Date(event.Event_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                            eventID={event.EventID}
                            handleNavigateToDetails={() => handleNavigateToDetails(event.EventID)}
                            handleRegister={() => handleRegister(event.EventID)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;