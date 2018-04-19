import React from 'react';
import {Form, Button, Input, Row, Col} from 'antd';
const FormItem = Form.Item;
import {eventProxy} from '../../../utils';

class QueryForm extends React.Component {
	// 页面即将加载
	componentWillMount() {
		// 在此定义域的配置信息
		this.fieldsConfig = [{
			id: 'code',
			name: '菜单编号',
		}, {
			id: 'name',
			name: '菜单名称',
		}];
	}

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

		// 单个Col的列宽设定（24 栅格）
		const formItemLayout = {
			labelCol: {span: 6}, // label列宽
			wrapperCol: {span: 16} // 控件列宽
		};

		// 读取域配置信息，转换为具体组件
		const renderFields = () => {
			let fields = this.fieldsConfig.map(conf => {
				let options = {
					initialValue: '',
				};

				if (true === conf.required) {
					let rule = {
						required: true,
						message: `${conf.name}不可为空!`,
					}
					options.rules = [rule];
				}

				// 每行三个组件
				return (
					<Col key={conf.id} span={7} >
						<FormItem label={conf.name} {...formItemLayout}>
							{getFieldDecorator(`${conf.id}`, options)(
								<Input />
							)}
						</FormItem>
					</Col>
				);
			})

			// 补充空格位
			if (0 !== fields.length % 3) {
				fields.push(<Col key={'blank'} span={7 * (3 - fields.length % 3)} />)
			}

			return fields;
		}

		return (
			<Form className="ant-search-form" onSubmit={this.doSearch}>
				<Row>
					{renderFields()}
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
