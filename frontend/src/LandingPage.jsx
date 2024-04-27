/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import SignInForm from './SignInForm'

const LandingPage = ({handleLogin}) => {

    useEffect(() => {
        document.body.style.backgroundColor = '#f0f2f5'
    }, []);
  return (
    <div className='landing-page'>
        <div className='left-landing'>
            <h1 className='all-nba-title'>PulseFeed</h1>
            <h3 className='title-text'>Experience the Future of Personalized News Today!</h3>
        </div>
        <div className='right-landing'>
            <SignInForm handleLogin={handleLogin}/>
        </div>
    </div>
  )
}

export default LandingPage