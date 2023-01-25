import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Table, Modal, Form, Input, message, Tree } from 'antd';
import { useSelector } from 'react-redux';
import { addRole, getRoleList, roleAuth } from '../../network';

const { Item } = Form

const treeData =
  [{
    title: '平台功能',
    key: 'top',
    children: [
      {
        title: '首页',
        key: 'home'
      },
      {
        title: '歌单',
        key: 'sheet'
      },
      {
        title: '歌曲',
        key: 'song'
      },
      {
        title: '歌手',
        key: 'singer'
        // ,
        // children: [
        //   {
        //     title: '男歌手',
        //     key: 'singer/male',
        //   },
        //   {
        //     title: '女歌手',
        //     key: 'singer/female',
        //   },
        //   {
        //     title: '组合',
        //     key: 'singer/combination',
        //   }
        // ]
      },
      {
        title: '专辑',
        key: 'album',
      },
      {
        title: '用户管理',
        key: 'manage'
      },
      {
        title: '角色管理',
        key: 'role'
      }
    ]
  }];

const Role = () => {
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '授权时间',
      dataIndex: 'auth_time',
      key: 'auth_time',
    },
    {
      title: '授权人',
      dataIndex: 'auth_name',
      key: 'auth_name',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (id, all) =>
        (<Button type='link' onClick={() => showAuthModal(id, all)}>设置权限</Button>)

    },
  ];
  const formRef = useRef()
  const { user } = useSelector(state => state.userInfo)

  // 设置权限的角色id
  const [id, setId] = useState();
  // ------------------Tree 状态------------------
  // 选中的菜单数组  哪个菜单想选中就把菜单的key放进数组中
  const [checkedKeys, setCheckedKeys] = useState([]);
  // ------------------Tree 状态------------------

  // 角色列表
  const [roleList, setRoleList] = useState();

  // 添加角色对话框是否显示
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 权限设置对话框是否显示
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


  // ----------------Tree 方法-----------------------
  // 点击选择菜单调用   
  const onCheck = (checkedKeysValue) => {
    // console.log('选中的菜单数组', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };
  // ----------------Tree 方法-----------------------

  // 点击显示添加角色对话框
  const showModal = () => {
    setIsModalOpen(true)
  };
  // 点击显示权限设置对话框
  const showAuthModal = (id, all) => {
    let menus = all.menus
    setId(id)
    setIsAuthModalOpen(true)
    setCheckedKeys([])
    if (!menus) return
    menus = JSON.parse(menus)
    setCheckedKeys(menus)
  };

  // 点击添加角色对话框的确定按钮
  const handleOk = () => {
    setIsModalOpen(false);
    formRef.current.submit()
  };
  // 点击权限设置对话框的确定按钮
  const authHandleOk = async () => {
    const auth_name = user.username
    const menus = checkedKeys
    const result = await roleAuth(id, { auth_name, menus })
    if (result.status === 1) {
      message.success(result.message)
      const res = await getRoleList()
      if (res.status === 1) {
        setRoleList(res.data)
      } else {
        message.warning(res.message)
      }
    } else {
      message.warning(result.message)
    }
    // console.log('点击权限设置对话框的添加按钮');
    setIsAuthModalOpen(false);
  };

  // 点击添加角色对话框的取消按钮
  const handleCancel = () => {
    setIsModalOpen(false);
    formRef.current.resetFields()
  };
  // 点击权限设置对话框的取消按钮
  const authHandleCancel = () => {
    setIsAuthModalOpen(false);
  };

  // form表单提交
  const onFinish = async values => {
    const result = await addRole(values)
    if (result.status === 1) {
      formRef.current.resetFields()
      const getResult = await getRoleList()
      if (getResult.status === 1) {
        setRoleList(getResult.data)
      } else {
        message.warning(getResult.message)
      }
      message.success(result.message)
    } else {
      message.warning(result.message)
    }
  };

  useEffect(() => {
    async function query() {
      const result = await getRoleList()
      if (result.status === 1) {
        setRoleList(result.data)
      } else {
        message.warning(result.message)
      }
    }
    query()
  }, [])
  return (
    <Card
      title={<Button type='primary' onClick={showModal}>新增角色</Button>}
    >
      <Table bordered rowKey="id" columns={columns} dataSource={roleList} />
      <Modal
        title="新增角色"
        width={400}
        open={isModalOpen}
        okText="确定"
        cancelText='取消'
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="normal_login"
          className="login-form"
          ref={formRef}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Item
            name="role_name"
            rules={[
              {
                required: true,
                message: '请输入角色名字！',
              },
            ]}
          >
            <Input placeholder="请输入角色名字！" />
          </Item>
        </Form>
      </Modal>
      <Modal
        title="设置权限"
        open={isAuthModalOpen}
        okText="确定"
        cancelText='取消'
        onOk={authHandleOk}
        onCancel={authHandleCancel}
      >
        <Tree
          checkable
          defaultExpandAll
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          treeData={treeData}
        />
      </Modal>
    </Card>
  )
}

export default Role