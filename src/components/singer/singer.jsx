import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Input, message, Space, Image } from 'antd';
import { useSelector } from 'react-redux';
import Cover from '../cover/cover';
import { addSinger, getSingerList, delPictureByName, deleteSinger, updateSinger } from '../../network';

const { Item } = Form
const { confirm } = Modal

const Singer = () => {
  const columns = [
    {
      title: '歌手名称',
      dataIndex: 'singer',
      key: 'singer',

    },
    {
      title: '封面',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => <Image width={50} src={avatar}></Image>
    },
    {
      title: '创建人',
      dataIndex: 'create_author',
      key: 'create_author',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'name',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (id, all) =>
      (<Space>
        <Button size='small' type='primary' onClick={() => { updateSingerClick(id, all) }}>修改</Button>
        <Button size='small' type='primary' onClick={() => { deleteSingerClick(id, all) }} danger>删除</Button>
      </Space>)
    }
  ]

  const { user } = useSelector(state => state.userInfo)
  const formRef = useRef()

  const [isModalOpen, setIsModalOpen] = useState(false);
  // 要修改的歌手原始信息
  const [updateSingerInfo, setUpdateSingerInfo] = useState(null);
  // 添加true修改false
  const [operation, setOperation] = useState(true);
  // 上传的歌手封面信息
  const [uploadInfo, setUploadInfo] = useState(null);
  // 歌手列表
  const [singerList, setSingerList] = useState([]);
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
    setUpdateSingerInfo(null)
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
      const result = await addSinger({ ...values, avatar: uploadInfo.url, create_author: user.username })
      if (result.status === 1) {
        message.success(result.message)
        const res = await getSingerList(pageNum, pageSize)
        if (res.status === 0) {
          message.warning(res.message)
        } else {
          setSingerList(res.data.list)
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
      const result = await updateSinger(updateSingerInfo.id, { ...values, avatar: uploadInfo.url })
      if (result.status === 1) {
        message.success(result.message)
        await delPictureByName(updateSingerInfo.name)
        const res = await getSingerList(pageNum, pageSize)
        if (res.status === 0) {
          message.warning(res.message)
        } else {
          setSingerList(res.data.list)
          setTotal(res.data.total)
          setUploadInfo(null)
          setUpdateSingerInfo(null)
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
  // 点击添加歌手按钮
  const addSingerClick = () => {
    setIsModalOpen(true)
    setOperation(true)
  }
  // 获取上传图片的信息
  const getUploadInfo = (info) => {
    setUploadInfo(info)
  }
  // 点击修改歌手
  const updateSingerClick = (id, all) => {
    if (user.role_id !== '1') {
      if (all.create_author !== user.username) {
        message.info('你没有权限操作！')
        return
      }
    }
    formRef.current.setFieldsValue({
      singer: all.singer
    })
    const name = all.avatar.split('/').reverse()[0]
    setUpdateSingerInfo({ uid: '-1', name, url: all.avatar, id })
    setUploadInfo({ name, url: all.cover })
    setIsModalOpen(true)
    setOperation(false)
  }
  // 点击删除歌手
  const deleteSingerClick = (id, all) => {
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
        const result = await deleteSinger(id)
        if (result.status === 1) {
          message.success(result.message)
          const temp = all.avatar.split('/').reverse()[0]
          await delPictureByName(temp)
          const res = await getSingerList(pageNum, pageSize)
          if (res.status === 1) {
            if (res.data.list.length === 0 && pageNum !== 1) {
              setPageNum(pre => pre - 1)
              const cRes = await getSingerList(pageNum - 1, pageSize)
              if (cRes.status === 1) {
                setSingerList(cRes.data.list)
                setTotal(cRes.data.total)
              }
            } else {
              setSingerList(res.data.list)
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
    const result = await getSingerList(values.current, pageSize)
    if (result.status === 1) {
      // console.log('获取歌手列表： ', result);
      setSingerList(result.data.list)
      setTotal(result.data.total)
      setUploadInfo(null)
    } else {
      message.warning(result.message)
    }
  }
  useEffect(() => {
    async function query(pageNum, pageSize) {
      const result = await getSingerList(pageNum, pageSize)
      if (result.status === 1) {
        // console.log('获取歌手列表： ', result);
        setSingerList(result.data.list)
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
      extra={<Button type='primary' onClick={addSingerClick}>添加歌手</Button>}
    >
      <Table
        bordered
        dataSource={singerList}
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
        title={operation ? "添加歌手" : "修改歌手"}
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
            name="singer"
            label="歌手名字"
            rules={[
              {
                required: true,
                message: '请输入歌手名字！',
              },
            ]}
          >
            <Input placeholder='请输入歌手名字！' />
          </Item>
          <Item
            name="avatar"
            label="歌手图片"
          >
            <Cover
              operation={operation}
              updateSingerInfo={updateSingerInfo}
              getUploadInfo={getUploadInfo}
            ></Cover>
          </Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Singer