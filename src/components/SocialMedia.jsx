import React from 'react'
import { BsLinkedin, BsGithub, BsInstagram } from 'react-icons/bs'
import { FaFilePdf } from 'react-icons/fa'

function SocialMedia() {
  const downloadCV = () => {
    const cvPath = '/Hamza_Bouras_Resume.pdf'
    

    const link = document.createElement('a')
    link.href = cvPath
    link.download = 'Hamza_Bouras_CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='app__social'>
      <div onClick={downloadCV} style={{ cursor: 'pointer' }}>
        <FaFilePdf />
      </div>

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