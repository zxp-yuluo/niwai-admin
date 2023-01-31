import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Button,
  Table,
  message,
  Space,
  Modal,
  Form,
  Input,
  Image
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import nw from './sheet.module.css';
import Picture from '../picture/Picture';
import {
  getUserSheetByUsername,
  establishUserSheet,
  updateUserSheet,
  delUserSheet,
  delPictureByName
} from '../../network';
const { TextArea } = Input;

/**
 * @param {*} username 用户名
 * @param {*} fun 设置歌单的函数
 */
async function getSheetList(username, fun) {
  const result = await getUserSheetByUsername(username)
  if (result.status === 1) {
    fun(result.data)
  } else {
    message.warning(result.message)
  }
}

const Sheet = () => {
  // 获取form表单组件
  const formRef = useRef()
  // 获取用户信息
  const { user } = useSelector(state => state.userInfo)
  // 上传图片的名字
  const [pictureInfo, setPictureInfo] = useState(null)
  // 修改图片时，得到的图片名
  const [updatePictureInfo, setUpdatePictureInfo] = useState(null)
  // 歌单列表
  const [songSheet, setSongSheet] = useState()
  // 创建(true)或修改(false)
  const [operation, setOperation] = useState(true)
  // 被修改歌单的id
  const [updateId, setUpdateId] = useState()
  // 被修改歌单的信息
  const [updateInfo, setUpdateInfo] = useState(null)

  // 对话框 开始
  const [open, setOpen] = useState(false);
  // 点击对话框确定
  const handleOk = () => {
    formRef.current.submit()
  };
  // 关闭对话框
  const handleCancel = async () => {
    setOpen(false)
    formRef.current.resetFields()
    // 清除修改歌单的信息
    setUpdateInfo(null)
    // 没提交，删除上传的图片
    if(operation) {
      if(pictureInfo) {
        if(!pictureInfo.name) return
        await delPictureByName(pictureInfo.name)
        setPictureInfo(null)
      }
    }else {
      // 上传图片成功，但没有点击修改。删除上传的图片
      if(updatePictureInfo) {
        if(!updatePictureInfo.updataInfo) return
        await delPictureByName(updatePictureInfo.updataInfo.name)
        setUpdatePictureInfo(null)
      }
    }
    // getSheetList(user.username, setSongSheet)
  };
  // 对话框 结束

  // 表格 开始
  const columns = [
    {
      title: '歌单名字',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
    },
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      render: (_, record) =>
        <Image
          width={50}
          src={_}
          fallback="data:image/png;base64,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"
        />
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '创建人',
      dataIndex: 'create_author',
      key: 'create_author',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'operation',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: '删除歌单',
                icon: <ExclamationCircleOutlined />,
                content: '你确定删除吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  delSheetClick(record)
                }
              });
            }}>删除</Button>
          <Button
            size="small"
            type="primary"
            onClick={() => updateSheetClick(_, record)}>修改</Button>
        </Space>
      ),
    }
  ];
  // 表格 结束

  // 获取用户歌单

  useEffect(() => {
    if(user) {
      getSheetList(user.username, setSongSheet)
    }
  }, [user])

  // 获取图片url地址
  const getPictureInfo = info => {
    setPictureInfo(info)
  }
  // 修改时获取图片信息
  const getUpdataPictureInfo = info => {
    setUpdatePictureInfo(info)
  }

  // form表单 开始
  const onFinish = async values => {
    // const { name, describe } = values
    const create_author = user.username
    // 创建歌单
    let result
    if (operation) {
      if(!pictureInfo) {
        message.warning('请上传图片！')
        return
      }
      result = await establishUserSheet({ ...values, create_author, cover: pictureInfo?pictureInfo.url:'' })
    } else {
      // 修改歌单
      result = await updateUserSheet(updateId, {...values,cover: updatePictureInfo?updatePictureInfo.updataInfo.url:''}, )
      if(updatePictureInfo.currentInfo) {
        await delPictureByName(updatePictureInfo.currentInfo.name)
      }
      if(updatePictureInfo.originalInfo) {
        await delPictureByName(updatePictureInfo.originalInfo.name)
      }
      setUpdatePictureInfo(null)
    }
    if (result.status === 1) {
      message.success(result.message)
      getSheetList(user.username, setSongSheet)
      formRef.current.resetFields()
    } else {
      message.warning(result.message)
      getSheetList(user.username, setSongSheet)
      formRef.current.resetFields()
    }
    setOpen(false);
    setPictureInfo(null)
    setUpdateInfo(null)
  };
  // form表单 结束

  // 点击修改
  const updateSheetClick = async (_, record) => {
    const pictureName = record.cover.split('/').reverse()[0]
    setOpen(true)
    setOperation(false)
    setUpdateId(_)
    setUpdateInfo({...record,pictureName})
    formRef.current.setFieldsValue({
      name: record.name,
      describe: record.describe
    })
  }
  // 删除歌单
  const delSheetClick = async sheet => {
    const { id,cover} = sheet
    const result = await delUserSheet(id)
    if (result.status === 1) {
      message.success(result.message)
      getSheetList(user.username, setSongSheet)
      if(cover) {
        const name = 'niwaiyinyue' + cover.split('niwaiyinyue').reverse()[0]
        await delPictureByName(name)
      }
    } else {
      message.warning(result.message)
      getSheetList(user.username, setSongSheet)
    }
  }
  return (
    <>
      <Card
        className={nw.card}
        extra={
          <Button
            type="primary"
            onClick={
              () => {
                setOpen(true)
                setOperation(true)
              }
            }
          >
            <PlusOutlined />创建
          </Button>
        }
      >
        <Table
          rowKey='id'
          bordered
          dataSource={songSheet}
          columns={columns}
          pagination={{ pageSize: 3 }}
        />;
      </Card>
      <Modal
        title={operation ? '创建歌单' : '修改歌单'}
        open={open}
        forceRender={true}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
        okText="确认"
        cancelText="取消"
      >
        <Form
          ref={formRef}
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          labelCol={
            { span: 6 }
          }
        >
          <Form.Item
            name="name"
            label="歌单名字"
            rules={[
              {
                required: true,
                message: '请输入名字',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="describe"
            label="歌单描述"
            rules={[
              {
                required: true,
                message: '请输入名字描述',
              },
            ]}
          >
            <TextArea className={nw.textarea} rows={4} />
          </Form.Item>
          <Form.Item
            name="cover"
            label="上传封面"
          >
            <Picture
              operation={operation}
              getPictureInfo={getPictureInfo}
              updateInfo={updateInfo}
              getUpdataPictureInfo={getUpdataPictureInfo}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Sheet