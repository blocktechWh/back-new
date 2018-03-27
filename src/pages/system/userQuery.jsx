import React from 'react';
import {Form, Button, Select, Input, DatePicker, Row, Col} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function disabledDate(current) {
	// Can not select days after today
	return current > moment().endOf('day');
}

class UserQueryForm extends React.Component {
	// 页面加载
	componentDidMount() {
		// To disabled submit button at the beginning.
		this.props.form.validateFields();
	}

	handleReset = () => {
		this.props.form.resetFields();
	}

	render() {
		const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

		// Only show error after a field is touched.
		const usernameError = isFieldTouched('username') && getFieldError('username');
		const stateError = isFieldTouched('state') && getFieldError('state');
		const regDateError = isFieldTouched('regDate') && getFieldError('regDate');

		const usernameConfig = {
			rules: [{required: false, message: 'Please input your username!'}]
		}
		const stateConfig = {
			rules: [{required: false, message: 'Please input your username!'}],
			initialValue: ''
		}
		const rangeConfig = {
			rules: [{type: 'array', required: false, message: 'Please select time!'}],
			initialValue: [moment().subtract('d', 7), moment()]
		};

		// 单个Col的列宽设定（24 栅格）
		const formItemLayout = {
			labelCol: {span: 8}, // label列宽
			wrapperCol: {span: 16} // 控件列宽
		};

		return (
			<Form className="ant-search-form" onSubmit={this.props.onSubmit}>
				<Row>
					<Col span={6}>
						<FormItem label="用户名" labelCol={{span: 8}} wrapperCol={{span: 16}} validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
							{getFieldDecorator('username', usernameConfig)(
								<Input placeholder="用户名" />
							)}
						</FormItem>
					</Col>
					<Col span={6}>
						<FormItem {...formItemLayout} label="用户状态" validateStatus={stateError ? 'error' : ''} help={stateError || ''}>
							{getFieldDecorator('state', stateConfig)(
								<Select>
									<Select.Option value="">全部</Select.Option>
									<Select.Option value="valid">启用</Select.Option>
									<Select.Option value="invalid">禁用</Select.Option>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={8}>
						<FormItem {...formItemLayout} label="注册日期" validateStatus={regDateError ? 'error' : ''} help={regDateError || ''}>
							{getFieldDecorator('regDate', rangeConfig)(
								<RangePicker disabledDate={disabledDate} showTime format="YYYY-MM-DD HH:mm:ss" />
							)}
						</FormItem>
					</Col>
					<Col span={4} style={{marginTop: 4}}>
						<Button type="primary" icon="search" htmlType="submit" disabled={hasErrors(getFieldsError())}>查询</Button>
						<Button type="primary" style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
					</Col>
				</Row>
			</Form>
		)
	}
}

export default Form.create()(UserQueryForm);
