import React from 'react';
import { useAuth } from '../../contexts/authContext';
import Task from './Task';
import EditTask from './EditTask';
const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
        <Task/>
        </div>
    )
}

export default Home;