import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Card, Space, Form, Input, Image, message } from 'antd';
import {
  addUserSong,
  delAudioByName,
  delLyricsByName,
  delPictureByName,
  updateSongById
} from '../../../network';
import Files from '../files/files';
import nw from './add_song.module.css';

const { Item } = Form

const AddSong = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { username } = useSelector(state => state.userInfo.user)
  const [previousPage, setPreviousPage] = useState()
  // 修改歌曲的信息
  let { songInfo } = location.state
  // 上传图片信息
  const [image, setImage] = useState(null)
  // 上传音频信息
  const [url, setUrl] = useState(null)
  // 上传歌词信息
  const [lyrics, setLyrics] = useState(null)

  const [flag, setFlag] = useState(null);

  // 修改时初始图片信息
  const [originalImage, setOriginalImage] = useState(null)
  // 修改时初始音频信息
  const [originalUrl, setOriginalUrl] = useState(null)
  // 修改时初始歌词信息
  const [originalLyrics, setOriginalyrics] = useState(null)

  const formRef = useRef()
  const imageRef = useRef()
  const urlRef = useRef()
  const lyricsRef = useRef()
  const originalImageRef = useRef()
  const originalUrlRef = useRef()
  const originalLyricsRef = useRef()

  useEffect(() => {
    imageRef.current = image;
    urlRef.current = url;
    lyricsRef.current = lyrics;
    originalImageRef.current = originalImage;
    originalUrlRef.current = originalUrl;
    originalLyricsRef.current = originalLyrics;
  }, [lyrics, image, url]);

  useEffect(() => {
    setPreviousPage(location.state.pathname)
    if (id) {
      const { album_name, author_name, song_name, image, lyrics, url } = location.state.songInfo
      formRef.current.setFieldsValue({
        album_name,
        author_name,
        song_name
      })
      const imageName = image.split('/').reverse()[0]
      const urlName = url.split('/').reverse()[0]
      const lyricsName = lyrics.split('/').reverse()[0]
      setOriginalImage({ name: imageName, url: image, tag: '标识' })
      setOriginalUrl({ name: urlName, url, tag: '标识' })
      setOriginalyrics({ name: lyricsName, url: lyrics, tag: '标识' })
    }
    return async () => {
      // 如果没提交删除上传的图片音频歌词
      if (id) {
        // 修改
        if (originalImageRef.current && imageRef.current && originalImageRef.current.name !== imageRef.current.name) {
          await delPictureByName(imageRef.current.name)
        }
        if (originalLyricsRef.current && lyricsRef.current && originalLyricsRef.current.name !== lyricsRef.current.name) {
          await delPictureByName(lyricsRef.current.name)
        }
        if (originalUrlRef.current && urlRef.current && originalUrlRef.current.name !== urlRef.current.name) {
          await delPictureByName(urlRef.current.name)
        }
      } else {
        // 添加
        if (urlRef.current) {
          await delAudioByName(urlRef.current.name)
        }
        if (imageRef.current) {
          await delPictureByName(imageRef.current.name)
        }
        if (lyricsRef.current) {
          await delLyricsByName(lyricsRef.current.name)
        }
      }
    }
  }, [])

  // 点击返回
  const goBackClick = () => {
    navigate(previousPage)
  }
  // 提交表单
  const onFinish = async value => {
    let tempLyrics = lyrics ? lyrics.url : ''
    let tempImage = image ? image.url : ''
    if (id) {
      // 有id修改歌曲
      const result = await updateSongById(id, { ...value, url: url.url, lyrics: tempLyrics, image: tempImage })
      if (result.status === 1) {
        setFlag(true)
        if (originalImage.name !== image.name) {
          await delPictureByName(originalImage.name)
        }
        if (originalLyrics.name !== lyrics.name) {
          await delLyricsByName(originalLyrics.name)
        }
        if (originalUrl.name !== url.name) {
          await delAudioByName(originalUrl.name)
        }
        message.success(result.message)
        formRef.current.resetFields()
        setImage(null)
        setLyrics(null)
        setUrl(null)
      } else {
        message.warning(result.message)
      }
    } else {
      // 没有id添加歌曲
      if (!url || !url.url) {
        message.warning('请上传音频！')
        return
      }
      const params = { ...value, url: url.url, lyrics: tempLyrics, image: tempImage, create_author: username }
      const result = await addUserSong(params)
      if (result.status === 1) {
        message.success(result.message)
        formRef.current.resetFields()
        // 提交成功歌词音频图片设置为空
        setImage(null)
        setLyrics(null)
        setUrl(null)
      } else {
        message.warning(result.message)
      }
    }

  }
  // 获取上传图片
  const getUploadImage = async (info) => {
    setImage(info)
  }
  // 获取上传音频
  const getUploadAudio = (info) => {
    setUrl(info)
  }
  // 获取上传歌词
  const getUploadLyrics = (info) => {
    setLyrics(info)
  }
  return (
    <div className={nw.add_song}>
      <Card
        title={
          <Space>
            <Button size='small' type='link' onClick={goBackClick}>返回</Button>
            <span>歌曲{id ? '修改' : '添加'}</span>
          </Space>
        }
      >
        <Form
          ref={formRef}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          disabled={flag}
          onFinish={onFinish}
        >
          <Item
            name="song_name"
            label="歌曲名字"
            rules={[
              {
                required: true,
                message: '请输入名字',
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            name="author_name"
            label="歌手名字"
            rules={[
              {
                required: true,
                message: '请输入歌手名字',
              },
            ]}
          >
            <Input placeholder='多个请用/分开' />
          </Item>
          <Item
            name="album_name"
            label="专辑"
          >
            <Input />
          </Item>
          <Item
            name="image"
            label="上传图片"
          >
            <Files
              type="image"
              updateInfo={{ image: songInfo ? songInfo.image : '', flag }}
              originalImage={originalImage}
              getUploadImage={getUploadImage}
            />
          </Item>
          <Item
            name="lyrics"
            label="上传歌词"
          >
            <Files
              type='lyrics'
              updateInfo={{ lyrics: songInfo ? songInfo.lyrics : '', flag }}
              originalLyrics={originalLyrics}
              getUploadLyrics={getUploadLyrics}
            />
          </Item>
          <Item
            name="audio"
            label="上传音频"
          >
            <Files
              type='audio'
              updateInfo={{ url: songInfo ? songInfo.url : '', flag }}
              originalUrl={originalUrl}
              getUploadAudio={getUploadAudio}
            />
          </Item>
          {id ? '' : <Item
            label="歌词格式"
          >
            <Image width={100} src="http://139.196.78.237/api/image/example.png"></Image>
          </Item>}
          <Item>
            <Button type="primary" htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card>
    </div >
  )
}

export default AddSong