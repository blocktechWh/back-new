import React from 'react';
import {Form, Modal, Input} from 'antd';
const FormItem = Form.Item;

// 修改密码
class ChangePasswordForm extends React.Component {
    state = {
        confirmDirty: false
    };

    checkPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('确认密码和密码不相同!');
        } else {
            callback();
        }
    }

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    render() {
        // 外部传参
        let {visible, handleOk, handleCancel, form} = this.props;

        // 元素样式
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

        let {getFieldDecorator} = form;

        let that = this;

        return (
            <Modal
                visible={visible}
                title="编辑用户"
                okText="确定"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form layout="vertical">
                    <FormItem label="原密码"  {...formItemLayout}>
                        {getFieldDecorator('oldPassword', {})(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem label="密码"  {...formItemLayout}>
                        {getFieldDecorator('newPassword', {
                            rules: [{validator: that.checkConfirm.bind(that)}, {required: true, message: '请输入新密码!'}],
                        })(
                            <Input type="password" />
                        )}
                    </FormItem>
                    <FormItem label="确认密码"  {...formItemLayout}>
                        {getFieldDecorator('confirm', {
                            rules: [{validator: that.checkPassword.bind(that)}, {required: true, message: '请输入确认密码!'}],
                        })(
                            <Input type="password" onBlur={this.handleConfirmBlur} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(ChangePasswordForm);
