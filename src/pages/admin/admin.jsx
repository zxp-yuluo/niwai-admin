import React from 'react';
import { useSelector } from 'react-redux';

const Admin = () => {
  const {user} = useSelector(state => state.userInfo)
  console.log(user);
  return (
    <div>
      Admin组件
      {
        JSON.stringify(user)
      }
      
    </div>
  )
}

export default Admin