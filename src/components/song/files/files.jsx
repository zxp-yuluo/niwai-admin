import React, { useState, useEffect } from 'react';
import { Upload, Button, Modal, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop';
import { delAudioByName, delLyricsByName, delPictureByName } from '../../../network'

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Files = (props) => {
  const { 
    type,
    getUploadImage,
    getUploadAudio,
    getUploadLyrics,
    updateInfo
  } = props
  let listType = type === 'image' ? 'picture-card' : 'text'
  let action
  let name
  switch (type) {
    case 'image':
      action = 'http://139.196.78.237/api/upload/image'
      // action = 'http://localhost:3000/upload/image'
      name = 'image'
      break;
    case 'audio':
      action = 'http://139.196.78.237/api/upload/audio'
      // action = 'http://localhost:3000/upload/audio'
      name = 'audio'
      break;
    case 'lyrics':
      action = 'http://139.196.78.237/api/upload/lyrics'
      // action = 'http://localhost:3000/upload/lyrics'
      name = 'lyrics'
      break;
  } 
  
  // 上传列表
  const [fileList, setFileList] = useState([]);
  // 图片信息
  const [imageFile, setImageFile] = useState();
  // 音频信息
  const [audioFile, setAudioFile] = useState();
  // 歌词信息
  const [lyricsFile, setLyricsFile] = useState();

  // 预览哪个图片
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  // 预览是否打开
  const [previewOpen, setPreviewOpen] = useState(false);
  // 控制预览
  const handleCancel = () => setPreviewOpen(false);
  // 上传文件
  const onChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      if (file.response.status === 0) {
        message.warning(file.response.message)
        return
      }
      const tempData = file.response ? file.response.data : ''
      if ('image' in tempData) {
        if (imageFile) {
          if (imageFile.name !== tempData.name) {
            delPictureByName(imageFile.name)
          }
        }
        setImageFile(tempData)
        if (getUploadImage) {
          getUploadImage(tempData)
        }
      } else if ('audio' in tempData) {
        if (audioFile) {
          if (audioFile.name !== tempData.name) {
            delAudioByName(audioFile.name)
          }
        }
        setAudioFile(tempData)
        if (getUploadAudio) {
          getUploadAudio(tempData)
        }
      } else if ('lyrics' in tempData) {
        if (lyricsFile) {
          if (lyricsFile.name !== tempData.name) {
            delLyricsByName(lyricsFile.name)
          }
        }
        setLyricsFile(tempData)
        if (getUploadLyrics) {
          getUploadLyrics(tempData)
        }
      }
      fileList[0].name = file.response.data.name
    }
    if (file.status === 'removed') {
      if (!file.response) {
        setFileList([])
        return
      }
      const tempData = file.response ? file.response.data : ''
      const { name } = tempData
      if ('image' in tempData) {
        delPictureByName(name)
      } else if ('audio' in tempData) {
        delAudioByName(name)
      } else if ('lyrics' in tempData) {
        delLyricsByName(name)
      }
    }
    setFileList(fileList);
  };

  // 图片预览
  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  }

  useEffect(() => {
    if (updateInfo) {
      // console.log(updateInfo.flag);
      let temp = {
        uid: -1
      }
      if ('image' in updateInfo) {
        const { image } = updateInfo
        if (image) {
          temp.url = image
          temp.name = 'niwaiyinyue_' + image.split('niwaiyinyue_')[1]
          if(updateInfo.flag) {
            setFileList([]);
          }else {
            setFileList([temp]);
          }
          getUploadImage(temp)
          // console.log(temp, '-------');
        }
      } else if ('url' in updateInfo) {
        const { url } = updateInfo
        if (url) {
          temp.url = url
          temp.name = 'niwaiyinyue_' + url.split('niwaiyinyue_')[1]
          if(updateInfo.flag) {
            setFileList([]);
          }else {
            setFileList([temp]);
          }
          getUploadAudio(temp)
        }
      } else if ('lyrics' in updateInfo) {
        const { lyrics } = updateInfo
        if (lyrics) {
          temp.url = lyrics
          temp.name = 'niwaiyinyue_' + lyrics.split('niwaiyinyue_')[1]
          if(updateInfo.flag) {
            setFileList([]);
          }else {
            setFileList([temp]);
          }
          getUploadLyrics(temp)
        }
      }
    }
  }, [])
  return (
    <div>
      {
        type === 'image'
          ?
          <>
            <ImgCrop rotate>
              <Upload
                action={action}
                method='POST'
                name={name}
                listType={listType}
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                maxCount={1}
              >
                {fileList.length <= 1 && '+ Upload'}
              </Upload>
            </ImgCrop>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img
                alt="example"
                style={{
                  width: '100%',
                }}
                src={previewImage}
              />
            </Modal>
          </>
          :
          <Upload
            action={action}
            method='POST'
            name={name}
            listType={listType}
            fileList={fileList}
            onChange={onChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </Upload>
      }
    </div>
  )
}

export default Files