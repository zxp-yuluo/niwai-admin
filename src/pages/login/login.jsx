import React from 'react';
import nw from './login.module.css'

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
const {Item} = Form


const Login = () => {
  
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  return (
    <div className={nw.login}>
      <div className={nw.content}>
        <h1 className={nw.title}>用户登录</h1>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Item
            name="username"
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
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Item>
          <Item
            name="password"
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
              }
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
            />
          </Item>

          <Item>
            <Button type="primary" htmlType="submit" className={nw.submit}>
              登录
            </Button>
          </Item>
        </Form>
      </div>
    </div>
  );
}

export default Login