import React, { useState, useEffect } from 'react';
import {
  AppstoreOutlined,
  HomeOutlined,
  OrderedListOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  SafetyCertificateOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
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
    icon: <UserOutlined />
    // ,
    // children: [
    //   {
    //     label: '男歌手',
    //     key: 'singer/male',
    //   },
    //   {
    //     label: '女歌手',
    //     key: 'singer/female',
    //   },
    //   {
    //     label: '组合',
    //     key: 'singer/combination',
    //   }
    // ]
  },
  {
    label: '专辑',
    key: 'album',
    icon: <WalletOutlined />
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

// 过滤菜单
const filterMenu = (id, array, menus) => {
  let result = []
  if (id === '1') {
    return array
  }
  // console.log(menus);
  if (!menus) {
    return [{
      label: '首页',
      key: 'home',
      icon: <HomeOutlined />,
    }]
  }
  array.forEach(ele => {
    if(ele.children) {
      let tempIndex=[]
      ele.children.forEach((item,index) => {
        if(!menus.includes(item.key)) {
          tempIndex.push(index)
        }
      })
      tempIndex.forEach(item => {
        ele.children.splice(item,1)
      })
      result.push(ele)
    }else {
      if(menus.includes(ele.key)) {
        result.push(ele)
      }
    }
  });
  return result
}
const rootSubmenuKeys = ['singer'];
const SiderMenu = () => {
  const userInfo = useSelector(state => state.userInfo)
  let role_id
  let menus
  if (userInfo.user) {
    menus = userInfo.user.menus ? JSON.parse(userInfo.user.menus) : null
    role_id = userInfo.user.role_id
  }
  const location = useLocation()
  //  角色可以显示的菜单
  const [displayMenu, setDisplayMenu] = useState(['home']);
  const [selectedKeys, setSelectedKeys] = useState(['home']);
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    const tempA = location.pathname.replace('/admin/', '')
    const tempB = location.pathname.split('/').splice(2)
    setSelectedKeys([tempA])
    setOpenKeys(tempB)
  }, [location.pathname])
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

  useEffect(() => {
    const result = filterMenu(role_id, menuList, menus)
    setDisplayMenu(result)
  }, [])

  return (
    <div className={nw.menu}>
      <div className={nw.title}>腻歪音乐</div>
      <Menu
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={onOpenChange}
        items={displayMenu}
        onClick={menuClick}
      />
    </div>
  );
}

export default SiderMenu