import React from 'react';
import {Form, Button, Select, Input, DatePicker, Row, Col} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import {eventProxy} from '../../../utils';

class QueryForm extends React.Component {
	// 页面加载完成
	componentDidMount() {
		// 初始查询
		this.doSearch();
	}

	// 查询，使用观察者模式通知表格
	doSearch = (e) => {
		if (e) e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				eventProxy.trigger('queryEvent', values);
			}
		});
	}

	handleReset = () => {
		this.props.form.resetFields();
	}

	render() {
		const {getFieldDecorator} = this.props.form;

		const afterToday = (current) => {
			// Can not select days after today
			return current > moment().endOf('day');
		}

		const usernameConfig = {
			rules: [{required: false, message: 'Please input your username!'}]
		}
		const stateConfig = {
			rules: [{required: false, message: 'Please input your username!'}],
			initialValue: ''
		}
		const rangeConfig = {
			rules: [{type: 'array', required: false, message: 'Please select time!'}],
			initialValue: [moment().subtract('M', 1), moment()]
		};

		// 单个Col的列宽设定（24 栅格）
		const formItemLayout = {
			labelCol: {span: 6}, // label列宽
			wrapperCol: {span: 16} // 控件列宽
		};

		return (
			<Form className="ant-search-form" onSubmit={this.doSearch}>
				<Row>
					<Col span={7}>
						<FormItem label="用户名" {...formItemLayout}  >
							{getFieldDecorator('username', usernameConfig)(
								<Input placeholder="用户名" />
							)}
						</FormItem>
					</Col>
					<Col span={7}>
						<FormItem {...formItemLayout} label="用户状态" >
							{getFieldDecorator('state', stateConfig)(
								<Select>
									<Select.Option value="">全部</Select.Option>
									<Select.Option value="valid">启用</Select.Option>
									<Select.Option value="invalid">禁用</Select.Option>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={7}>
						<FormItem {...formItemLayout} label="注册日期">
							{getFieldDecorator('regDate', rangeConfig)(
								<RangePicker disabledDate={afterToday} showTime format="YYYY-MM-DD HH:mm:ss" />
							)}
						</FormItem>
					</Col>
					<Col span={3} style={{marginTop: 4}}>
						<Button type="primary" icon="search" htmlType="submit" >查询</Button>
						<Button type="primary" style={{marginLeft: 8}} onClick={this.handleReset}>重置</Button>
					</Col>
				</Row>
			</Form>
		)
	}
}

export default Form.create()(QueryForm);
