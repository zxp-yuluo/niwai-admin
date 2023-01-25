import React, { useState, useEffect, useRef } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux'
import { Button, Card, message, Space, Table, Modal, Form, Input, Select } from 'antd';
// import nw from './manage.module.css';
import { getUserList, addUser, updateUserInfo, deleteUserInfo, getRoleList } from '../../network';

const { Item } = Form
const { confirm } = Modal

const Manage = () => {

  // const { user } = useSelector(state => state.userInfo)

  const formRef = useRef()

  //用户列表
  const [userList, setUserList] = useState()
  //修改用户的信息
  const [updateInfo, setUpdateInfo] = useState()
  //角色列表
  const [roleList, setRoleList] = useState()
  // 添加true修改false
  const [operation, setOperation] = useState(true)
  // 对话框是否显示
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '所属角色',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (id, all) => {
        return (
          <Space>
            <Button size='small' type='primary' onClick={() => updateUserClick(id, all)}>修改</Button>
            <Button size='small' type='primary' onClick={() => delUserClick(id, all)}>删除</Button>
          </Space>
        )
      }
    },
  ];
  // 点击对话框确定按钮
  const handleOk = () => {
    formRef.current.submit()
    setIsModalOpen(false);
  };
  // 点击对话框取消按钮
  const handleCancel = () => {
    formRef.current.resetFields()
    setIsModalOpen(false);
  };
  // 点击删除
  const delUserClick = async (id, all) => {
    confirm({
      title: "你确定删除吗？",
      icon: <ExclamationCircleOutlined />,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        const result = await deleteUserInfo(id)
        if (result.status === 1) {
          message.success(result.message)
          const res = await getUserList()
          if (res.status === 1) {
            setUserList(res.data)
          } else {
            message.warning(result.message)
          }
        } else {
          message.warning(result.message)
        }
      },
      onCancel() {
      },
    })
  }
  // 点击修改
  const updateUserClick = async (id, all) => {
    setUpdateInfo(all)
    formRef.current.setFieldsValue({
      username: all.username,
      role_id: all.role_id
    })
    setIsModalOpen(true)
    setOperation(false)
  }
  // 表单提交
  const onFinish = async (values) => {
    let result
    if (operation) {
      // 添加用户
      result = await addUser(values)
    } else {
      // 修改用户
      const { username, role_name: role_id } = values
      result = await updateUserInfo(updateInfo.id, { username, role_id })
    }
    if (result.status === 1) {
      formRef.current.resetFields()
      message.success(result.message)
      const res = await getUserList()
      if (res.status === 1) {
        setUserList(res.data)
      } else {
        message.warning(result.message)
      }
    } else {
      message.warning(result.message)
    }
  };
  // 选择角色
  const selectChange = (w) => {
  }
  useEffect(() => {
    async function query() {
      const result = await getUserList()
      const res = await getRoleList()
      if (result.status === 1) {
        setUserList(result.data)
      } else {
        message.warning(result.message)
      }
      if (res.status === 1) {
        const temp = []
        res.data.forEach(ele => {
          temp.unshift({ value: ele.id, label: ele.role_name })
        });
        setRoleList(temp)
      } else {
        message.warning(res.message)
      }
    }
    query()
  }, [])
  return (
    <Card
      title={<Button onClick={() => {
        setIsModalOpen(true)
        setOperation(true)
      }} type="primary">添加用户</Button>}
    >
      <Table bordered rowKey="id" dataSource={userList} columns={columns} />;
      <Modal
        title={operation ? '添加用户' : '修改用户'}
        open={isModalOpen}
        forceRender
        okText="确定"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          ref={formRef}
          labelCol={{
            span: 4,
          }}
          onFinish={onFinish}
        >
          <Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名！',
              },
              {
                min: 3,
                message: '用户名最少3位！',
              },
              {
                max: 20,
                message: '用户名最大20位！',
              }
            ]}
          >
            <Input />
          </Item>
          {
            operation ?
              <Item
                name="password"
                label="密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                  {
                    min: 6,
                    message: '密码最少6位！'
                  },
                  {
                    max: 20,
                    message: '密码最大20位！'
                  },
                  {
                    pattern: /^\w+$/,
                    message: '由字母、数字、下划线组成！'
                  }
                ]}
              >
                <Input />
              </Item> :
              <Item
                name="password"
                label="密码"
              >
                <Input disabled />
              </Item>
          }
          <Item
            name="role_name"
            label="角色"
            rules={[
              {
                required: true,
                message: '请选择角色！',
              },
            ]}
          >
            <Select onChange={selectChange} options={roleList}>
            </Select>
          </Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Manage