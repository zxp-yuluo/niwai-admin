import React, { useState } from 'react';
import { Upload, Modal, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';
import { delPictureByName } from '.././../network';
import { useEffect } from 'react';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Cover = (props) => {
  const { getUploadInfo, operation, updateSingerInfo } = props
  // 修改时上传之前的信息
  const [currentInfo, setCurrentInfo] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = async ({ file, fileList }) => {
    if (file.status === 'done') {
      const { name, url } = file.response.data
      if(operation) {
        fileList[0].name = name
        getUploadInfo({ name, url })
      }else {
        fileList[0].name = name
        if(currentInfo) {
          await delPictureByName(currentInfo.name)
        }
        setCurrentInfo({ name, url })
        getUploadInfo({ name, url })
      }
    }
    if (file.status === 'removed') {
      const result = await delPictureByName(file.response.data.name)
      if (result.status === 1) {
        message.success(result.message)
      } else {
        message.warning(result.message)
      }
    }
    setFileList(fileList)
  };
  useEffect(() => {
    if (updateSingerInfo) {
      setFileList([updateSingerInfo])
    }
  }, [updateSingerInfo])
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
      <ImgCrop rotate>
        <Upload
          action="http://139.196.78.237/api/upload/image"
          method='POST'
          name='image'
          maxCount={1}
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          onPreview={handlePreview}
        >
          {fileList.length >= 8 ? null : uploadButton}
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
  )
}

export default Cover