import React from 'react';
import axios from 'axios';
import {Form, Icon, Input, Button, Checkbox, message} from 'antd';
const FormItem = Form.Item;
import {login} from '../api';

class Login extends React.Component {
    componentDidMount() {
        this.props.form.setFieldsValue({
            userName: 'sup',
            password: 123456
        });
    }

    handleSubmit = (e) => {
        this.setState({loading: true});
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                login(values.userName, values.password).then(res => {
                    console.log("get token=" + res.data.token);
                    localStorage.setItem('token', res.data.token);
                    // 主动写入内存。因为localStorage存在读写时差，导致接下来的接口调用获取错误token
                    axios.defaults.headers.common['Authorization'] = res.data.token;
                    this.props.router.push('/nav/system/user');
                    this.setState({loading: false});
                }).catch(function (error) {
                    if (error.status) {
                        message.error(error.msg);
                    } else {
                        message.error(error);
                    }
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div className="login" style={{textAlign: 'center', marginTop: '100px'}}>
                <div className="login-form" >
                    <div className="login-logo">
                        <span>管理后台</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{margin: '0 auto', maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{required: true, message: '请输入用户名!'}]
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: '请输入密码!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })(
                                <Checkbox style={{float: 'left'}}>记住我</Checkbox>
                            )}
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Form.create()(Login);
