import React from 'react'
import ReactDOM from 'react-dom/client'
import Landing_pg from './components/Landing_pg/Landing_pg'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup.jsx'
import Home from './components/Home/Home.jsx'
import Event_details from './components/Event_details/Event_details.jsx'
import Create_event from './components/Create_event/Create_event.jsx'
import Organize_event from './components/Organize_event/Organize_event.jsx'
import Layout from './layout.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
        <Route path='' element={<Landing_pg/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='signup' element={<Signup/>}/>
        <Route path='home' element={<Home/>}/>
        <Route path='event_details' element={<Event_details/>}/>
        <Route path='create_event' element={<Create_event/>}/>
        <Route path='organize_event' element={<Organize_event/>}/>
    </Route>
  )
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
