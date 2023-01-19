import React, { useState, useEffect } from 'react';
import {
  AppstoreOutlined,
  HomeOutlined,
  OrderedListOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate,useLocation } from 'react-router-dom';
import nw from '../css/menu.module.css';

const menuList = [
  {
    label: '首页',
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: '歌单',
    key: 'sheet',
    icon: <OrderedListOutlined />,
  },
  {
    label: '歌曲',
    key: 'song',
    icon: <AppstoreOutlined />,
  },
  {
    label: '歌手',
    key: 'singer',
    icon: <UserOutlined />,
    children: [
      {
        label: '男歌手',
        key: 'singer/male',
      },
      {
        label: '女歌手',
        key: 'singer/female',
      },
      {
        label: '组合',
        key: 'singer/combination',
      }
    ]
  },
  {
    label: '用户管理',
    key: 'manage',
    icon: <UsergroupAddOutlined />,
  },
  {
    label: '角色管理',
    key: 'role',
    icon: <SafetyCertificateOutlined />,
  }
]
const rootSubmenuKeys = ['singer'];
const SiderMenu = () => {
  const location = useLocation()
  const [selectedKeys, setSelectedKeys] = useState(['home']);
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    const tempA = location.pathname.replace('/admin/','')
    const tempB = location.pathname.split('/').splice(2)
    setSelectedKeys([tempA])
    setOpenKeys(tempB)
  },[location.pathname])
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const menuClick = (e) => {
    navigate('/admin/' + e.key)
    setSelectedKeys([e.key])
    setOpenKeys(e.key.split('/'))
  }

  return (
    <div className={nw.menu}>
      <div className={nw.title}>腻歪音乐</div>
      <Menu
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={onOpenChange}
        items={menuList}
        onClick={menuClick}
      />
    </div>
  );
}

export default SiderMenu