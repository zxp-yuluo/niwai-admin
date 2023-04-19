import { PlusOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useState, useEffect } from 'react';
import { delPictureByName } from '../../network'
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const Picture = (props) => {
  const { updateInfo } = props

  // 上传图片前显示的图片信息
  const [currentInfo, setCurrentInfo] = useState()
  // 上传图片的名字
  const [pictureName, setPictureName] = useState();
  // 预览是否打开
  const [previewOpen, setPreviewOpen] = useState(false);
  // 预览哪个图片
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  // 控制预览
  const handleCancel = () => setPreviewOpen(false);
  // 点击预览图片
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  // 上传图片
  const handleChange = async ({ file, fileList: newFileList }) => {
    const { operation } = props
    if (file.status === 'done') {
      if (operation) {
        // 创建歌单
        const { name, url } = file.response.data
        // 如果pictureName不为空，第一次上传
        if (pictureName) {
          if (name !== pictureName) {
            await delPictureByName(pictureName)
          }
        }
        newFileList[0].name = name
        setPictureName(name)
        props.getPictureInfo({ url, name })
      } else {
        // 修改歌单
        // 原始歌单封面信息
        const originalInfo = {
          name: updateInfo.pictureName,
          url: updateInfo.cover
        }
        // const currentInfo = {
        //   name: updateInfo.pictureName,
        //   url: updateInfo.cover
        // }
        if (originalInfo.name !== currentInfo.name) {
          //如果原始的信息和上传前显示的信息相同，说明是第一次上传，不相同把上传前显示的图片删除
          await delPictureByName(currentInfo.name)
        }
        // 图片上传成功，但还没发送修改请求，图片信息
        const updataInfo = {
          name: file.response.data.name,
          url: file.response.data.url
        }
        props.getUpdataPictureInfo({ currentInfo, updataInfo, originalInfo })
        setCurrentInfo(updataInfo)
      }
    }
    if (file.status === 'removed') {
      const result = await delPictureByName(file.name)
      if (result.status === 1) {
        message.success(result.message)
      } else {
        message.warning(result.message)
      }
    }
    setFileList(newFileList)
  };

  useEffect(() => {
    let temp = []
    if (updateInfo) {
      temp = [{
        uid: updateInfo.id,
        name: updateInfo.pictureName,
        status: 'done',
        url: updateInfo.cover
      }]
      setCurrentInfo({
        name: updateInfo.pictureName,
        url: updateInfo.cover,
      })
      props.getUpdataPictureInfo({ currentInfo:null, updataInfo:{name: updateInfo.pictureName,
        url: updateInfo.cover,}, originalInfo:null })
    } else {
      temp = []
    }
    setFileList(temp)
  }, [updateInfo])

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <ImgCrop>
        <Upload
          // action="http://139.196.78.237/api/upload/image"
          // action="http://zhuxinpeng.cn/api/upload/image"
          action="http://localhost:3000/upload/image"
          method='POST'
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          maxCount={1}
        >
          {fileList.length >= 2 ? null : uploadButton}
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
  );
};


export default Picture;