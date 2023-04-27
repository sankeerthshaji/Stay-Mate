import React from 'react'
import { SpinningCircleLoader } from 'react-loaders-kit';

function Loader() {

    const loaderProps = {
        loading: true,
        size: 50,
        duration: 1,
        colors: ['#5e22f0', '#ffffff']
    }

  return (
    <div className="loader flex justify-center items-center h-screen">
        <SpinningCircleLoader {...loaderProps}/>
    </div>
  )
}

export default Loader;