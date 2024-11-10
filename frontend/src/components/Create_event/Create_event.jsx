import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Create_event() {
    const navigate = useNavigate();

    // State for form data
    const [eventData, setEventData] = useState({
        ename: '',
        category: '', // Will store the selected category
        event_date: '',
        domain: '', // Will store the selected domain
        poster: '',
        s_time: '',
        e_time: '',
        teamSize: ''
    });

    const [message, setMessage] = useState('');
    const [ecode, setEcode] = useState(null);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send the event details to the backend to create the event
            const response = await fetch('http://localhost:3000/newevent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            const data = await response.json();

            // Display the popup message with the ecode
            setMessage(`The event has been created. And this is the Event code ${data.ecode}. Please enter it for organizing the event.`);
            setEcode(data.ecode);

            // Optionally, navigate back after a short delay
            setTimeout(() => {
                navigate('/home'); // Navigate back to the home page
            }, 3000); // Delay to allow user to read the message

        } catch (err) {
            console.error('Error during event creation:', err);
            setMessage('An error occurred during event creation.');
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4">
            <h1 className="text-3xl font-semibold mb-6">Create New Event</h1>
            
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="mb-4">
                    <label className="block text-lg font-medium" htmlFor="ename">Event Name</label>
                    <input
                        type="text"
                        id="ename"
                        name="ename"
                        value={eventData.ename}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium">Category</label>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value="Hackathon"
                                checked={eventData.category === "Hackathon"}
                                onChange={handleChange}
                            />
                            Hackathon
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value="Workshop"
                                checked={eventData.category === "Workshop"}
                                onChange={handleChange}
                            />
                            Workshop
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value="Competition"
                                checked={eventData.category === "Competition"}
                                onChange={handleChange}
                            />
                            Competition
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium">Domain</label>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="domain"
                                value="Technical"
                                checked={eventData.domain === "Technical"}
                                onChange={handleChange}
                            />
                            Technical
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="domain"
                                value="Non-Technical"
                                checked={eventData.domain === "Non-Technical"}
                                onChange={handleChange}
                            />
                            Non-Technical
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="domain"
                                value="Cultural"
                                checked={eventData.domain === "Cultural"}
                                onChange={handleChange}
                            />
                            Cultural
                        </label>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium" htmlFor="event_date">Event Date</label>
                    <input
                        type="date"
                        id="event_date"
                        name="event_date"
                        value={eventData.event_date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium" htmlFor="poster">Poster URL</label>
                    <input
                        type="text"
                        id="poster"
                        name="poster"
                        value={eventData.poster}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium" htmlFor="s_time">Start Time</label>
                    <input
                        type="time"
                        id="s_time"
                        name="s_time"
                        value={eventData.s_time}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium" htmlFor="e_time">End Time</label>
                    <input
                        type="time"
                        id="e_time"
                        name="e_time"
                        value={eventData.e_time}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium" htmlFor="teamSize">Team Size</label>
                    <input
                        type="number"
                        id="teamSize"
                        name="teamSize"
                        value={eventData.teamSize}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <button 
                    type="submit" 
                    className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Save
                </button>
            </form>

            {message && (
                <div className="mt-6 text-center text-xl font-semibold text-green-600">
                    {message}
                </div>
            )}
        </div>
    );
}

export default Create_event;
