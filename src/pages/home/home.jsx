import React, { useState } from 'react';
import { Outlet,useNavigate } from 'react-router-dom';
import './home.css';
const Home = (props) => {
  const [select, setSelect] = useState(0)
  const navigate = useNavigate()
  const clickTitle = (number) => {
    switch (number) {
      case 1:
        setSelect(1)
        navigate('/home/life')
        break;
      case 2:
        setSelect(2)
        navigate('/home/niwai')
        break;
      default:
        setSelect(0)
        navigate('/home/index')
        break;
    }
  }
  return (
    <div className="home">
      <div className="home_head">
        <div className="head_left">弄熊来</div>
        <div className="head_center">
          <div onClick={() => clickTitle(0)} className={select === 0 ? "active" : ""}>首页</div>
          <div onClick={() => clickTitle(1)} className={select === 1 ? "active" : ""}>生活</div>
          <div onClick={() => clickTitle(2)} className={select === 2 ? "active" : ""}>弄熊来</div>
        </div>
        <div className="head_right">朱信鹏</div>
      </div>
      <div className='home_body'>
        <Outlet></Outlet>
      </div>
      <div className='home_foot'>
        <div>C</div>
        <div>网站备案号：</div>
      </div>
    </div>
  )
}

export default Home