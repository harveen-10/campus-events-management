import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Event_info() {
    const location = useLocation();
    const { srn } = location.state || {}; // Get SRN from location state
    const navigate = useNavigate();

    const [events, setEvents] = useState([]); // To store event details
    const [selectedEvent, setSelectedEvent] = useState(''); // To track selected event
    const [eventID, setEventID] = useState(null); // To store the selected event ID
    const [selectedTab, setSelectedTab] = useState('participants'); // To handle which tab is selected (Participants, Organizers, etc.)
    const [eventData, setEventData] = useState([]); // To store event details (organizers, participants, etc.)
    const [selectedRow, setSelectedRow] = useState(null); // To track selected row
    const [selectedID, setSelectedID] = useState(null);  // To store the selected ID/SRN for deletion
    const [error, setError] = useState(null); // To handle errors
    const [refreshKey, setRefreshKey] = useState(0);
    const [totalAmountSpent, setTotalAmountSpent] = useState(0); // Store total amount spent

    

    const fetchEvents = async () => {
        try {
            const response = await fetch(`http://localhost:3000/organizingdetails?srn=${srn.srn}`);
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();
            setEvents(data); // Store event details
        } catch (error) {
            console.error("Error fetching event details:", error);
            setError("An error occurred while fetching event details.");
        }
    };


    useEffect(() => {
        if (srn) {
            fetchEvents(); // Fetch events if SRN is available
        }
    }, [srn]);

    useEffect(() => {
        const fetchEventData = async () => {
            if (eventID) {
                try {
                    let url = '';
                    switch (selectedTab) {
                        case 'organizers':
                            url = `http://localhost:3000/organizers?eventID=${eventID}`;
                            break;
                        case 'participants':
                            url = `http://localhost:3000/participants?eventID=${eventID}`;
                            break;
                        case 'sponsors':
                            url = `http://localhost:3000/sponsors?eventID=${eventID}`;
                            break;
                        case 'guests':
                            url = `http://localhost:3000/guests?eventID=${eventID}`;
                            break;
                        case 'finances':
                            url = `http://localhost:3000/finances?eventID=${eventID}`;
                            break;
                        default:
                            return;
                    }

                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Failed to fetch event data');
                    }
                    const data = await response.json();
                    if (selectedTab === 'finances') {
                        setEventData(data.finances); // Setting the finance data
                        setTotalAmountSpent(data.totalAmountSpent); // Setting the total amount spent
                    } else {
                        setEventData(data); // For other tabs, just set the event data
                    }
                    // console.log(data);

                } catch (error) {
                    console.error("Error fetching event data:", error);
                    setError("An error occurred while fetching event data.");
                }
            }
        };

        fetchEventData();
    }, [eventID, selectedTab, refreshKey]);

    const handleSelectChange = (event) => {
        const selectedEvent = event.target.value;
        setSelectedEvent(selectedEvent);
        const selectedEventObj = events.find(ev => ev.Ename === selectedEvent);
        if (selectedEventObj) {
            setEventID(selectedEventObj.EventID); // Set the eventID when a new event is selected
        }
        setEventData([]);
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab); // Change the selected tab (Participants, Organizers, etc.)
        setEventData([]); // Clear data when changing tab
    };

    useEffect(() => {
        if (selectedID !== null) {
            console.log("Updated selected ID:", selectedID);
        }
    }, [selectedID]);

    const handleRowClick = (index, item) => {
        setSelectedRow(index); // Select the row
        // console.log(item.ID);
        // console.log("current item selected: ", item.ID || item.SRN || item.TransID);
        setSelectedID(item.ID || item.SRN || item.TransID); // Set the selected ID/SRN for deletion
    };

    const handleDelete = async () => {
        console.log("while deleting selectedID: ", selectedID);
        if (!selectedID) {
            alert("Please select a row to delete.");
            return;
        }

        let url = '';
        let curID;


        // Set URL and body based on the selected tab
        switch (selectedTab) {
            case 'organizers':
                url = 'http://localhost:3000/deleteorganizerfromevent';
                curID = { SRN: selectedID };
                break;
            case 'participants':
                url = 'http://localhost:3000/participantdelete';
                curID = { SRN: selectedID };
                break;
            case 'sponsors':
                url = 'http://localhost:3000/sponsordelete';
                curID = { SponsorID: selectedID };
                break;
            case 'finances':
                url = 'http://localhost:3000/financedelete';
                curID = { TransID: selectedID };
                break;
            case 'guests':
                url = 'http://localhost:3000/guestdelete';
                curID = { GuestID: selectedID };
                break;
            default:
                return;
        }

        // Send the DELETE request
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(curID),
            });

            if (!response.ok) {
                throw new Error('Failed to delete data');
            }

            const data = await response.json();
            alert(data.message); // Show success message

            // Remove deleted item from the UI
            setEventData((prevData) => prevData.filter(item => item.ID !== selectedID && item.srn !== selectedID));

            // Reset selected ID and row
            setSelectedID(null);
            setSelectedRow(null);

            setEventData([]);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting data:", error);
            alert("An error occurred while deleting data.");
        }
    };

    const handleInsert = () => {
        if (eventID) {
            const currentUser={ tab: selectedTab, eventID: eventID,  srn: srn.srn};
            navigate("/insert", { state: { currentUser } });
        } else {
            alert("Please select an event before inserting details.");
        }
    };

    const handleUpdate = async () => {
        if (eventID && selectedID) {
            const currentUser={ tab: selectedTab, eventID: eventID,  srn: srn.srn, ID: selectedID};
            navigate("/update", { state: { currentUser } });
        } else if(!eventID){
            alert("Please select an event before updating details.");
        } else{
            alert("Please select a row before updating details.");
        }
    };

    console.log(eventID); 

    const handleDeleteEvent = async () => {
        console.log(eventID);    
        try {
            const response = await fetch('http://localhost:3000/deleteevent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ EventID: eventID })
            });
    
            if (response.ok) {
                const message = await response.text();
                alert(message); // Show success message
            } else {
                const errorMessage = await response.text();
                alert(`Error: ${errorMessage}`);
            }

            fetchEvents();

        } catch (err) {
            console.error("Error occurred while deleting the event:", err);
            alert("An error occurred. Please try again.");
        }
    };
    

    return (
        <div>
            <button
                onClick={() => {
                    const currentUser = { srn: srn.srn };
                    navigate("/home", { state: { currentUser } });
                }}
                className="self-start mb-4 text-indigo-500 underline"
            >
                Back to Home
            </button>

            <div>
                <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-2">Select Event</label>
                <select
                    id="event-select"
                    value={selectedEvent}
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">-- Select an Event --</option>
                    {events.map((event, index) => (
                        <option key={index} value={event.Ename}>
                            {event.Ename}
                        </option>
                    ))}
                </select>
            </div>

            <div className="my-4 flex justify-between">
                <div className="flex space-x-4">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Delete
                    </button>
                    {['sponsors', 'finances', 'guests'].includes(selectedTab) && (
                        <button
                            onClick={handleUpdate}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                            Update
                        </button>
                    )}
                    {['sponsors', 'finances', 'guests'].includes(selectedTab) && (
                        <button
                            onClick={handleInsert}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        >
                            Insert
                        </button>
                    )}
                </div>
                <button
                    onClick={handleDeleteEvent}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                    Delete Event
                </button>
            </div>

            <div className="my-4">
                <button
                    onClick={() => handleTabChange('participants')}
                    className={`px-4 py-2 ${selectedTab === 'participants' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Participants
                </button>
                <button
                    onClick={() => handleTabChange('organizers')}
                    className={`px-4 py-2 ${selectedTab === 'organizers' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Organizers
                </button>
                <button
                    onClick={() => handleTabChange('sponsors')}
                    className={`px-4 py-2 ${selectedTab === 'sponsors' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Sponsors
                </button>
                <button
                    onClick={() => handleTabChange('finances')}
                    className={`px-4 py-2 ${selectedTab === 'finances' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Finances
                </button>
                <button
                    onClick={() => handleTabChange('guests')}
                    className={`px-4 py-2 ${selectedTab === 'guests' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Guests
                </button>
            </div>

            {eventID && (
                <div>
                    <h3 className="font-semibold text-lg">{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}</h3>
                    {eventData.length > 0 ? (
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr>
                                    {Array.isArray(eventData[0])
                                        ? Object.keys(eventData[0][0] || {}).map((key) => ( // Adjust for participant data
                                            <th key={key} className="px-4 py-2">{key}</th>
                                        ))
                                        : Object.keys(eventData[0]).map((key) => ( // Adjust for other data
                                            <th key={key} className="px-4 py-2">{key}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {eventData.map((item, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => handleRowClick(index, item)}
                                        className={`cursor-pointer ${selectedRow === index ? 'bg-gray-300' : ''}`}
                                    >
                                        {Object.values(item).map((value, idx) => (
                                            <td key={idx} className="border px-4 py-2">{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No data available for this tab.</p>
                    )}
                    {selectedTab === 'finances' && (
                        <div className="mt-4 text-right font-semibold">
                            Total Expenses = {totalAmountSpent}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

export default Event_info;
