import React from 'react';
import {Modal, Button, Form, Input, Message} from 'antd';
const FormItem = Form.Item;

import {getUser, updateUser} from '../../api';
import {eventProxy} from '../../utils';

class UserEditForm extends React.Component {
    // 定义状态属性
    state = {
        record: {}
    }

    // props发生变化
    componentWillReceiveProps(nextProps) {
        // 判定发生有效变化
        if (nextProps.dataKeys !== this.props.dataKeys && nextProps.dataKeys.length > 0) {
            console.log("componentWillReceiveProps, dataKeys=" + nextProps.dataKeys);

            // 加载数据
            getUser(nextProps.dataKeys[0]).then(res => {
                this.setState({
                    record: res.data
                });
            });
        }
    }

    doEdit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                updateUser(this.state.record.id, values.username, values.realname).then(res => {
                    eventProxy.trigger('reloadEvent');
                    Message.info("编辑用户成功");
                    this.props.onClose();
                });
            }
        });
    }

    doReset = () => {
        this.props.form.resetFields();
    }

    render() {
        let {visible, onClose} = this.props;
        let {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

        let usernameConfig = {
            rules: [{required: true, message: '用户名不可为空!'}],
            initialValue: this.state.record.userName
        }
        let userRealnameConfig = {
            rules: [{required: true, message: '姓名不可为空!'}],
            initialValue: this.state.record.userRealname
        }

        let formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };

        return (
            <Modal
                visible={visible}
                title="编辑用户"
                onCancel={onClose}
                footer={[<Button key="saveBtn" type="primary" onClick={this.doEdit}>保存</Button>,
                <Button key="resetBtn" onClick={this.doReset}>重置</Button>,
                <Button key="closeBtn" onClick={onClose}>取消</Button>]}
            >
                <Form layout="vertical">
                    <FormItem label="用户名"  {...formItemLayout}>
                        {getFieldDecorator('username', usernameConfig)(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="姓名"  {...formItemLayout} >
                        {getFieldDecorator('realname', userRealnameConfig)(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal >
        );
    }
}

export default Form.create()(UserEditForm);
