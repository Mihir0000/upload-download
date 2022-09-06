import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const nevigate = useNavigate();

    const proceedClick = (e) => {
        e.preventDefault();
        const userName = nameRef.current.value;
        const email = emailRef.current.value;
        const userData = {
            userName,
            email,
        };
        if (userName.length !== 0 && email.length !== 0) {
            localStorage.setItem('userData', JSON.stringify(userData));
            nevigate('/upload');
        } else {
            alert('Name or Email cannot be empty');
        }
    };

    return (
        <>
            <div className="form-container">
                <div>
                    <h1 className="text">Hey! Welcome</h1>
                </div>
                <form>
                    <div className="inputFiled">
                        <input type="text" placeholder="Name" ref={nameRef} />
                        <input
                            type="email"
                            placeholder="Email"
                            ref={emailRef}
                        />
                    </div>
                    <button className="proceedBtn" onClick={proceedClick}>
                        Proceed to upload
                    </button>
                </form>
            </div>
        </>
    );
};

export default Home;
