import React from 'react';
import {Modal, Button, Form, Input, message} from 'antd';
const FormItem = Form.Item;

import Api from '../../../api';
import {eventProxy} from '../../../utils';

class EditForm extends React.Component {
	// 页面即将加载
	componentWillMount() {
		// 对象信息
		this.objId = 'Role'; // 注意首字母大写
		this.objName = '角色';

		// 在此定义域的配置信息
		this.fieldsConfig = [{
			id: 'name',
			name: '角色名称',
			dataIndex: 'roleName',
			required: true,
		}, {
			id: 'desc',
			name: '角色描述',
			dataIndex: 'roleDesc',
			required: true,
		}];

		// 关联方法
		this.getFunc = Api[`get${this.objId}`];
		this.editFunc = Api[`update${this.objId}`];
	}

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
			this.getFunc(nextProps.dataKeys[0]).then(res => {
				if (200 === res.status) {
					this.setState({
						record: res.data
					});
				} else {
					message.error(res.msg);
				}
			});
		}
	}

	doEdit = () => {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.editFunc(this.state.record.id, values).then(res => {
					if (200 === res.status) {
						eventProxy.trigger('reloadEvent');
						message.info(`编辑${this.objName}成功`);
						this.props.onClose();
					} else {
						message.error(res.msg);
					}
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

		// 读取域配置信息，转换为具体组件
		const renderFields = () => {
			return this.fieldsConfig.map(conf => {
				let options = {
					initialValue: this.state.record[conf.dataIndex],
				};

				if (true === conf.required) {
					let rule = {
						required: true,
						message: `${conf.name}不可为空!`,
					}
					options.rules = [rule];
				}

				return (
					<FormItem key={conf.id} label={conf.name} {...formItemLayout}>
						{getFieldDecorator(`${conf.id}`, options)(
							<Input />
						)}
					</FormItem>
				);
			})
		}

		return (
			<Modal visible={visible} title={`编辑${this.objName}`} onCancel={onClose} footer={[
				<Button key="saveBtn" type="primary" onClick={this.doEdit}>保存</Button>,
				<Button key="resetBtn" onClick={this.doReset}>重置</Button>,
				<Button key="closeBtn" onClick={onClose}>取消</Button>,
			]}>
				<Form layout="vertical">
					{renderFields()}
				</Form>
			</Modal>
		);
	}
}

export default Form.create()(EditForm);
