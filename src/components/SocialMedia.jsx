import React from 'react'
import {BsLinkedin, BsGithub, BsInstagram} from 'react-icons/bs'

function SocialMedia() {
  return (
    <div className='app__social'>

      <div>
      <a href="https://www.linkedin.com/in/hamza-bouras-922477217/" target="_blank" rel="noopener noreferrer">

        <BsLinkedin />

      </a>
      </div>

      <div>
      <a href="https://github.com/hamzabourass" target="_blank" rel="noopener noreferrer">
        <BsGithub />

      </a>
      </div>

      <div>
      <a href="https://www.instagram.com/hamzabrse/" target="_blank" rel="noopener noreferrer">
        <BsInstagram />

      </a>
      </div>

    </div>
  )
}

export default SocialMedia