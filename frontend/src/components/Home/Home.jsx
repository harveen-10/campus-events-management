import React, {useState, useEffect} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Component_home from '../Component_home/Component_home'
import './Home.css'

function Home() {
    const location = useLocation();
    const { currentUser } = location.state || {};

    const navigate = useNavigate();

    const [eventdetails, seteventdetails]= useState([{
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
                console.log(data.products)
                seteventdetails(data.products.map(event => ({
                    Ename: event.Ename,
                    Event_date: event.Event_date,
                    Poster: event.Poster,
                    EventID: event.EventID
                })));

            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }

        fetchData();

    }, []);

    const handleNavigate = (event) => {
        const newUser = {eventID: event.EventID, srn: currentUser.srn}; 
        console.log("Navigating with newUser: ", newUser);

        // Navigate to the EventDetails page and pass the currentUser as state
        navigate("/event_details", { state: { newUser } });
    }

    const handleCreateEvent = () => {
        // Navigate to the "Create New Event" page
        navigate("/create_event");
    };

    const handleOrganizeEvent = () => {
        // Navigate to the "Organize an Existing Event" page
        navigate("/organize_event");
    };

    const handleEventDetails = () => {
        // Navigate to the "Event Details" page
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
                        <div 
                            key={event.EventID}
                            className="event-card cursor-pointer"
                            onClick={() => handleNavigate(event)}
                        >
                            <Component_home 
                                imgSrc={event.Poster} 
                                name={event.Ename} 
                                date={new Date(event.Event_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home
