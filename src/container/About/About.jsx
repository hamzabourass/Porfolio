import React, {useState, useEffect} from 'react'
import './About.scss'
import {motion} from 'framer-motion'
import {AppWrap} from '../../wrapper'
import { urlFor, client } from '../../client'
import {MotionWrap} from '../../wrapper'
function About() {

  const [abouts, setabouts] = useState([])
  useEffect(() => {
    const query = '*[_type == "abouts"]';

    client.fetch(query)
    .then((data) => setabouts(data));
  }, [])
  
  return (
    <>
    <h2 className='head-text'>
      I Know that
      <span> Good Development </span>
      <br />
      means
      <span> Good Business </span>

    </h2>
    <div className='app__profiles'>

      {abouts.map((about, index) => (
        <motion.div
        whileInView={{opacity: [0, 1]}}
        whileHover={{scale: 1.1}}
        transition={{duration: 0.5, type: 'tween'}}
        className='app__profile-item'
        key={about.title + index}
        >
          <img src={urlFor(about.image)} alt={about.title} />
          <h2 className='bold-text' style={{marginTop: 20}}>{about.title}</h2>
          <p className='p-text' style={{marginTop: 10}}>
            {about.description}
          </p>
        </motion.div>
      ))}

    </div>
    </>
  )
}

export default AppWrap(MotionWrap(About,'app__about'),
   'about',
   'app__whitebg') // About is the name of the component, about is the id of the About