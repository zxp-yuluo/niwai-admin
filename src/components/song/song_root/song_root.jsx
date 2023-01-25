import React, { useEffect, useState } from 'react';
import { Button, Card, Select, Input, Table, Image, Space, message, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getUserSongBySearch, delSongById, delAudioByName, delPictureByName, delLyricsByName } from '../../../network';
import nw from './song_root.module.css';
const { confirm } = Modal;

const getSongList = async (params, fun1, fun2, fun3) => {
  const { pageNum, pageSize, create_author, keyword, keywordType } = params
  const result = await getUserSongBySearch(keywordType, keyword, create_author, pageNum, pageSize)
  if (result.status === 1) {
    fun1([...result.data.list])
    fun2(result.data.pages)
    fun3(result.data.total)
  } else {
    message.warning(result.message)
  }
}

const SongRoot = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // 获取用户信息
  const { user } = useSelector(state => state.userInfo)
  // 歌曲列表
  const [songlist, setSongList] = useState(null)
  // 歌曲列表页数
  const [songPages, setSongPages] = useState(1)
  // 歌曲列表总数
  const [songTotal, setSongTotal] = useState()
  // 歌曲列表每页数量
  const [songPageSize] = useState(4)
  // 关键字类型
  const [keywordType, setKeywordType] = useState('all')
  // 关键字
  const [keyword, setKeyword] = useState()
  useEffect(() => {
    getSongList({ keywordType, keyword, create_author: user.username, pageNum: songPages, pageSize: songPageSize },
      setSongList,
      setSongPages,
      setSongTotal
    )
  }, [])
  const columns = [
    {
      title: '歌曲',
      dataIndex: 'song_name',
      key: 'song_name',
    },
    {
      title: '歌手',
      dataIndex: 'author_name',
      key: 'author_name',
    },
    {
      title: '封面',
      dataIndex: 'image',
      key: 'image',
      render: (_, all) =>
        <Image width={50}
          src={_}
        ></Image>
    },
    {
      title: '专辑',
      dataIndex: 'album_name',
      key: 'album_name',
    },
    {
      title: '创建者',
      dataIndex: 'create_author',
      key: 'create_author',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (_, all) => (
        <>
          <Space>
            <Button size='small' type='primary' onClick={() => modifySongClick(_, all)}>修改</Button>
            <Button size='small' danger onClick={() => deleteSongClick(_, all)} >删除</Button>
          </Space>
        </>
      )
    }
  ];
  // 选择器（select）改变
  const selectChange = (value) => {
    setKeywordType(value)
  }
  // 点击搜索按钮
  const keywordSearchSong = async () => {
    if(keywordType !== 'all') {
      if(!keyword) {
        message.warning('关键字不能为空！')
        return
      }
    }
    getSongList({ keywordType, keyword, create_author: user.username, pageNum: 1, pageSize: songPageSize },
      setSongList,
      setSongPages,
      setSongTotal
    )
  }
  // 输入关键字
  const keywordChange = (e) => {
    setKeyword(e.target.value.trim())
  }
  // 点击页码
  const paginationChange = async value => {
    getSongList({ keywordType, keyword, create_author: user.username, pageNum: value, pageSize: songPageSize },
      setSongList,
      setSongPages,
      setSongTotal
    )
  }
  // 点击添加歌曲
  const addSongClick = () => {
    navigate('/admin/song/add_song', {
      state: { pathname: location.pathname }
    })
  }
  // 点击修改
  const modifySongClick = (_, all) => {
    navigate('/admin/song/modify_song/' + all.id, {
      state: {
        pathname: location.pathname,
        songInfo: all
      }
    })
  }

  // 点击删除歌曲
  const deleteSongClick = (_,all) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      cancelText: '取消',
      okText: '确定',
      title: '你确定删除吗？',
      onOk: async () => {
        const result = await delSongById(_)
        const audio = all.url.split('/').reverse()[0]
        const picture = all.image.split('/').reverse()[0]
        const lyrics = all.lyrics.split('/').reverse()[0] 
        if (result.status === 1) {
          message.success(result.message)
          getSongList({ keywordType, keyword, create_author: user.username, pageNum: songPages, pageSize: songPageSize },
            setSongList,
            setSongPages,
            setSongTotal
          )
          if(picture) {
            await delPictureByName(picture)
          }
          if(lyrics) {
            await delPictureByName(picture)
            await delLyricsByName(lyrics)
          }
          await delAudioByName(audio)
        } else {
          message.warning(result.message)
        }
      },
      onCancel() {
        
      }
    })

  }
  return (
    <div className={nw.song}>
      <Card
        title={
          <div>
            <Select
              defaultValue={
                {
                  label: '全部',
                  value: 'all'
                }
              }
              options={[
                {
                  label: '全部',
                  value: 'all'
                },
                {
                  label: '歌手',
                  value: 'singer'
                },
                {
                  label: '歌曲',
                  value: 'song'
                },
              ]}
              onChange={selectChange}
            >
            </Select>
            <Input onChange={keywordChange} allowClear placeholder='请输入关键字' style={{ width: '150px', margin: '0 10px' }} />
            <Button onClick={keywordSearchSong}>搜索</Button>
          </div>
        }
        extra={<Button type='primary' onClick={addSongClick}>添加歌曲</Button>}
      >
        <Table
          dataSource={songlist}
          rowKey='id'
          columns={columns}
          pagination={
            {
              total: songTotal,
              pageSize: songPageSize,
              onChange: paginationChange
            }
          }
        />;
      </Card>
    </div>
  )
}

export default SongRoot