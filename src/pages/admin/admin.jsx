import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
// import { getUserInfo } from '../../network';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import SiderMenu from './menu/Menu';
import nw from './css/admin.module.css';
const { Sider, Content } = Layout;


const Admin = () => {
  const { isLogin } = useSelector(state => state.userInfo)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLogin) {
      navigate('/login', {
        replace: true
      })
    }
  })
  // const getUserInfoClick = async () => {
  //   const result = await getUserInfo()
  //   console.log(result);
  // }
  return (
    <Layout className={nw.layout}>
      <Sider className={nw.sider}>
        {/* <button onClick={getUserInfoClick}>获取用户信息</button> */}
        <SiderMenu />
      </Sider>
      <Layout>
        <Header />
        <Content className={nw.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default Admin