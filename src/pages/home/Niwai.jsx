import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
const Niwai = (props) => {
  const navigate = useNavigate()
  const goLogin = () => {
    navigate('/login')
  }
  const manageSystemGithub = () => {
    window.location.href="https://github.com/zxp-yuluo/niwai-music-admin"
  }
  const clientSystemGithub = () => {
    window.location.href="https://github.com/zxp-yuluo/niwai-music-client"
  }
  const serveSystemGithub = () => {
    window.location.href="https://github.com/zxp-yuluo/niwai-music-server"
  }
  return (
    <div className='home_nxl'>
      <div className='home_nxl_item'>
        <Card
          title="腻歪小程序练习代码"
          style={{
            width: 300,
          }}
        >
          <p><span onClick={goLogin} className='manage_system'>后台管理系统（React练习）</span><span onClick={manageSystemGithub} className='nxl_item_icon'><GithubOutlined /></span></p>
          <p><span>小程序（原生练习）</span><span onClick={clientSystemGithub} className='nxl_item_icon'><GithubOutlined /></span></p>
          <p><span>小程序服务器（nodeJs练习）</span><span onClick={serveSystemGithub} className='nxl_item_icon'><GithubOutlined /></span></p>
        </Card>
      </div>
    </div>
  )
}

export default Niwai