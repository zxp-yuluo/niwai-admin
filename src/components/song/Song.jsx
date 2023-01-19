import React from 'react';
import { Outlet } from 'react-router-dom';
const Song = () => {
  return (
    <div>
      <Outlet></Outlet>
    </div>
  )
}

export default Song