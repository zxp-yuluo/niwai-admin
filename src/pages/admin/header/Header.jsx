import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FullscreenOutlined, FullscreenExitOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { Button, Modal } from 'antd';
import screenfull from 'screenfull';
import dayjs from 'dayjs'
import { delUserInfo } from '../../../store/slices/userSlice';
import nw from '../css/header.module.css';

const menuList = [
  {
    label: '首页',
    key: 'home',
    icon: '<HomeOutlined />',
  },
  {
    label: '歌单',
    key: 'sheet',
    icon: '<OrderedListOutlined />',
  },
  {
    label: '歌曲',
    key: 'song',
    icon: '<AppstoreOutlined />',
  },
  {
    label: '歌手',
    key: 'singer',
    icon: '<UserOutlined />'
  },
  {
    label: '专辑',
    key: 'album',
    icon: '<WalletOutlined />'
  },
  {
    label: '用户管理',
    key: 'manage',
    icon: '<UsergroupAddOutlined />',
  },
  {
    label: '角色管理',
    key: 'role',
    icon: '<SafetyCertificateOutlined />',
  }
]
function getTitle(params) {
  let title 
  menuList.forEach(item => {
    if(item.children instanceof Array) {
      let result = item.children.find(ele => {
        return ele.key === params
      })
      if(result) title = result.label
    }else {
      if(item.key === params ) {
        title = item.label
      }
    }
  });
  return title
}
const Header = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  // const [date, setDate] = useState(new Date().toLocaleString())
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  // redux中获取登录用户的信息
  const { user } = useSelector(state => state.userInfo)
  const [isFull, setIsFull] = useState(false)
  const [titleText, setTitleText] = useState()
  // 全屏点击事件
  const fullScreenClick = () => {
    screenfull.toggle()
  }
  // 退出登录
  const signOut = () => {
    Modal.confirm({
      title: '退出登录',
      icon: <ExclamationCircleOutlined />,
      content: '你确定退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk(){
        dispatch(delUserInfo())
      }
    });
    
  }
  // 监听全屏变化
  screenfull.onchange(useCallback(() => {
    setIsFull(prevData => !prevData)
  }, []))

  useEffect(() => {
    let temp = location.pathname.replace('/admin/','')
    if(temp.includes('song')) {
      temp = 'song'
    }
    setTitleText(getTitle(temp))
    let clearId = setInterval(() => {
      setDate(dayjs().format('YYYY-MM-DD  HH:mm:ss'))
    }, 1000)
    return () => {
      clearInterval(clearId)
    }
  }, [location.pathname])
  return (
    <div className={nw.header}>
      <div className={nw.header_top}>
        {
          isFull ?
            <Button size='small' onClick={fullScreenClick}><FullscreenExitOutlined /></Button> :
            <Button size='small' onClick={fullScreenClick}><FullscreenOutlined /></Button>
        }

        <div className={nw.welcome}>你好，{user?user.username: ''}！</div>
        <Button type='link' size='small' onClick={signOut}>退出登录</Button>
      </div>
      <div className={nw.header_bottom}>
        <div className={nw.title}>{titleText}</div>
        <div className={nw.date}>{date}</div>
      </div>
    </div>
  )
}

export default Header