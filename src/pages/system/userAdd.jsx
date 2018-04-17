import React from 'react';
import {Modal, Button, Form, Input, Message} from 'antd';
const FormItem = Form.Item;

import Api from '../../api';
import {eventProxy} from '../../utils';

class AddForm extends React.Component {
	doAdd = () => {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				Api.addUser(values.username, values.realname).then(res => {
					eventProxy.trigger('reloadEvent');
					Message.info("新增用户成功");
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
		let {getFieldDecorator} = this.props.form;

		let usernameConfig = {
			rules: [{required: true, message: '用户名不可为空!'}]
		}
		let userRealnameConfig = {
			rules: [{required: true, message: '姓名不可为空!'}]
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
				title="新增用户"
				onCancel={onClose}
				footer={[<Button key="saveBtn" type="primary" onClick={this.doAdd}>保存</Button>,
				<Button key="resetBtn" onClick={this.doReset}>重置</Button>,
				<Button key="closeBtn" onClick={onClose}>取消</Button>]
				}
			>
				<Form layout="vertical">
					<FormItem label="用户名"  {...formItemLayout} >
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

export default Form.create()(AddForm);
