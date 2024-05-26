import React, { useState } from 'react';
import './LoginSignUp.css';
import user_icon from '~/assets/person.png';
import email_icon from '~/assets/email.png';
import password_icon from '~/assets/password.png';
import background_Left from '~/assets/screenshot-1715241826881.png';
import background_Right from '~/assets/screenshot-1715241848237.png';
import { loginAPI, signupAPI } from '~/apis';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginSignUp = ({onLoginSuccess}) => {
    const [action, setAction] = useState("Login");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setAction('Login');
        if (action === 'Login') {
            try {
                const res = await loginAPI({ email, password });
                const ownerIds = res.ownerIds;
                localStorage.setItem('ownerIds', ownerIds);
                toast.success(res?.message);
                onLoginSuccess();
                navigate('/boards', { state: { ownerIds: ownerIds } });
            } catch (error) {
                console.error('Error during login:', error);
                toast.error('An error occurred while logging in. Please try again later.');
            }
        }
    };
    

    const handleSignUp = () => {
        setAction('Sign Up');
        if (action === 'Sign Up') {
            signupAPI({ email, password, username })
                .then(res => {
                    const ownerIds = res.ownerIds;
                    localStorage.setItem('ownerIds', ownerIds);
                    toast.success(res?.message);
                    onLoginSuccess();
                    navigate('/boards', { state: { ownerIds: ownerIds } });
                })
                .catch(error => {
                    console.error('Error during signup:', error);
                    toast.error('An error occurred while signing up. Please try again later.');
                });
        }
    };

    return (
        <div className='login-signup-container'>
            <div className="background-left"></div>
            <div className="background-right"></div>
            <div className="left-image-container">
                <img src={background_Left} alt="Background Left" className="left-image" />
            </div>
            <div className="right-image-container">
                <img src={background_Right} alt="Background Right" className="right-image" />
            </div>
            <div className='container'>
                <div className="header">
                    <div className="text">{action}</div>
                    <div className='underline'></div>
                </div>
                <div className='inputs'>
                    {action === 'Login' ? null :
                        <div className='input'>
                            <img src={user_icon} alt="" className="icon-primary" />
                            <input
                                type="text"
                                placeholder='Username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>}

                    <div className='input'>
                        <img src={email_icon} alt="" className="icon-primary" />
                        <input
                            type="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='input'>
                        <img src={password_icon} alt="" className="icon-primary" />
                        <input
                            type="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                {action === 'Sign Up' ? null : <div className='forgot-password'> Lost password? <span>Click Here!</span> </div>}

                <div className='submit-container'>
                    <div className={action === 'Sign Up' ? "submit gray" : 'submit'} onClick={handleLogin}> Login</div>
                    <div className={action === 'Login' ? 'submit gray' : 'submit'} onClick={handleSignUp}> Sign Up</div>
                </div>
            </div>
        </div>
    )
}

export default LoginSignUp;
