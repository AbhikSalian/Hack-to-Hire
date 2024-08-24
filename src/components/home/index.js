import React from 'react';
import { useAuth } from '../../contexts/authContext';
import Task from './Task';

const Home = () => {
    const { currentUser } = useAuth();

    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4">
                <h2 className="card-title">
                    Hello, {currentUser.displayName ? currentUser.displayName : currentUser.email}!
                </h2>
                <p className="lead">You are now logged in.</p>
                <hr />
                <Task />
            </div>
        </div>
    );
}

export default Home;
