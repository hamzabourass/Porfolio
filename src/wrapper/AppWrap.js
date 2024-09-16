import React from 'react'
import  {NavigationDots, SocialMedia} from '../components'

// This is a heigher order component which means that it takes a component and returns a new component
 const  AppWrap = (Component, idName, classNames) => function HOC() {
  return (
    <div id={idName} className={`app__container ${classNames}`}>

      <SocialMedia />

      <div className='app__wrapper app__flex'>
        <Component />
      </div>
      <NavigationDots active={idName} />
    </div>
  )
}

export default AppWrap