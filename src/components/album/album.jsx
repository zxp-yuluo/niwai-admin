import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Input, message, Space, Image } from 'antd';
import { useSelector } from 'react-redux';
import Cover from '../cover/cover';
import { addAlbum, getAlbumList, delPictureByName, deleteAlbum, updateAlbum } from '../../network';

const { Item } = Form
const { confirm } = Modal
const Album = () => {
  const columns = [
    {
      title: '专辑',
      dataIndex: 'album',
      key: 'album',

    },
    {
      title: '封面',
      dataIndex: 'cover',
      key: 'cover',
      render: (cover) => <Image width={50} src={cover}></Image>
    },
    {
      title: '创建人',
      dataIndex: 'create_author',
      key: 'create_author',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (id, all) =>
      (<Space>
        <Button size='small' type='primary' onClick={() => { updateAlbumClick(id, all) }}>修改</Button>
        <Button size='small' type='primary' onClick={() => { deleteAlbumClick(id, all) }} danger>删除</Button>
      </Space>)
    }
  ]

  const { user } = useSelector(state => state.userInfo)
  const formRef = useRef()

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 要修改的专辑原始信息
  const [updateAlbumInfo, setUpdateAlbumInfo] = useState(null);
  // 添加true修改false
  const [operation, setOperation] = useState(true);
  // 上传的专辑封面信息
  const [uploadInfo, setUploadInfo] = useState(null);
  // 专辑列表
  const [albumList, setAlbumList] = useState([]);
  // 页数
  const [pageNum, setPageNum] = useState(1);
  // 每页数量
  const [pageSize] = useState(4);
  // 总页数
  const [total, setTotal] = useState();

  // 点击对话框确定按钮
  const handleOk = () => {
    formRef.current.submit()
    setIsModalOpen(false);
  };
  // 点击对话框取消按钮
  const handleCancel = async () => {
    formRef.current.resetFields()
    setUpdateAlbumInfo(null)
    setIsModalOpen(false);
    if (uploadInfo) {
      await delPictureByName(uploadInfo.name)
    }
  };
  //表单提交
  const onFinish = async (values) => {
    if (!uploadInfo) {
      message.warning('请上传图片！')
    }
    if (operation) {
      // 添加
      const result = await addAlbum({ ...values, cover: uploadInfo.url, create_author: user.username })
      if (result.status === 1) {
        message.success(result.message)
        const res = await getAlbumList(pageNum, pageSize)
        if (res.status === 0) {
          message.warning(res.message)
        } else {
          setAlbumList(res.data.list)
          setTotal(res.data.total)
          setUploadInfo(null)
        }
        formRef.current.resetFields()
      } else {
        message.warning(result.message)
        formRef.current.resetFields()
        if (uploadInfo) {
          await delPictureByName(uploadInfo.name)
        }
      }
    } else {
      // 修改
      const result = await updateAlbum(updateAlbumInfo.id, { ...values, cover: uploadInfo.url })
      if (result.status === 1) {
        message.success(result.message)
        await delPictureByName(updateAlbumInfo.name)
        const res = await getAlbumList(pageNum, pageSize)
        if (res.status === 0) {
          message.warning(res.message)
        } else {
          setAlbumList(res.data.list)
          setTotal(res.data.total)
          setUploadInfo(null)
          setUpdateAlbumInfo(null)
        }
        formRef.current.resetFields()
      } else {
        message.warning(result.message)
        formRef.current.resetFields()
        if (uploadInfo) {
          await delPictureByName(uploadInfo.name)
        }
      }
    }
  }
  // 点击添加专辑按钮
  const addAlbumClick = () => {
    setIsModalOpen(true)
    setOperation(true)
  }
  // 获取上传图片的信息
  const getUploadInfo = (info) => {
    setUploadInfo(info)
  }
  // 点击修改专辑
  const updateAlbumClick = (id, all) => {
    if (user.role_id !== '1') {
      if (all.create_author !== user.username) {
        message.info('你没有权限操作！')
        return
      }
    }
    formRef.current.setFieldsValue({
      album: all.album
    })
    const name = all.cover.split('/').reverse()[0]
    setUpdateAlbumInfo({ uid: '-1', name, url: all.cover, id })
    setIsModalOpen(true)
    setOperation(false)
  }
  // 点击删除专辑
  const deleteAlbumClick = (id, all) => {
    if (user.role_id !== '1') {
      if (all.create_author !== user.username) {
        message.info('你没有权限操作！')
        return
      }
    }
    confirm({
      title: '你确定删除吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const result = await deleteAlbum(id)
        if (result.status === 1) {
          message.success(result.message)
          const temp = all.cover.split('/').reverse()[0]
          await delPictureByName(temp)
          const res = await getAlbumList(pageNum, pageSize)
          if (res.status === 1) {
            if (res.data.list.length === 0 && pageNum !== 1) {
              setPageNum(pre => pre - 1)
              const cRes = await getAlbumList(pageNum-1, pageSize)
              if (cRes.status === 1) {
                setAlbumList(cRes.data.list)
                setTotal(cRes.data.total)
              }
            }else {
              setAlbumList(res.data.list)
              setTotal(res.data.total)
            }
          } else {
            message.warning(res.message)
          }
        } else {
          message.warning(result.message)
        }
      },
      onCancel: () => {
      }
    })
  }
  // 点击页码
  const tableChange = async (values) => {
    setPageNum(values.current)
    const result = await getAlbumList(values.current, pageSize)
    if (result.status === 1) {
      setAlbumList(result.data.list)
      setTotal(result.data.total)
      setUploadInfo(null)
    } else {
      message.warning(result.message)
    }
  }
  useEffect(() => {
    async function query(pageNum, pageSize) {
      const result = await getAlbumList(pageNum, pageSize)
      if (result.status === 1) {
        setAlbumList(result.data.list)
        setTotal(result.data.total)
        setUploadInfo(null)
      } else {
        message.warning(result.message)
      }
    }
    query(pageNum, pageSize)
  }, [])
  return (
    <Card
      extra={<Button type='primary' onClick={addAlbumClick}>添加专辑</Button>}
    >
      <Table
        bordered
        dataSource={albumList}
        pagination={
          {
            pageSize,
            total
          }
        }
        rowKey='id' columns={columns}
        onChange={tableChange}
      />
      <Modal
        title={operation ? "添加专辑" : "修改专辑"}
        okText="确定"
        cancelText='取消'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        forceRender
      >
        <Form
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          ref={formRef}
        >
          <Item
            name="album"
            label="专辑名字"
            rules={[
              {
                required: true,
                message: '请输入专辑名字！',
              },
            ]}
          >
            <Input placeholder='请输入专辑名字！' />
          </Item>
          <Item
            name="cover"
            label="专辑图片"
          >
            <Cover
              operation={operation}
              updateSingerInfo={updateAlbumInfo}
              getUploadInfo={getUploadInfo}
            ></Cover>
          </Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Album