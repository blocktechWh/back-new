import React from 'react';
import {Table, Modal, Form, Button, message, Popconfirm, Select, Input, DatePicker, Switch, Row, Col} from 'antd';
const FormItem = Form.Item;
import {queryUser, getUser, addUser, updateUser, deleteUser} from '../../api';
import QueryForm from './userQuery';
import EditForm from './userEdit';
import ViewModal from './userView';
import {formatTime} from '../../utils/FormatUtils.js';
const RangePicker = DatePicker.RangePicker;

export default class User extends React.Component {
	// 定义状态属性
	state = {
		queryData: {}, // 查询表单数据
		loading: false, // 是否加载中
		dataSource: [], // 列表数据源
		pagination: { // 分页信息
			defaultPageSize: 20,
			total: 0,
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共 ${total} 条`,
			onShowSizeChange: (current, pageSize) => {}
		},
		selectedRowKeys: [], // Check here to configure the default column
		isFormVisible: false // 是否显示form
	}

	start = () => {
		this.setState({loading: true});
		// ajax request after empty completing
		setTimeout(() => {
			this.setState({
				selectedRowKeys: [],
				loading: false,
			});
		}, 1000);
	}
	onSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({selectedRowKeys});
	}

	// 页面加载
	componentDidMount() {
		// 初始查询
		this.fetchData(0, 10);
	}

	// 关联查询表单
	saveFormRef2 = (instance) => {
		this.queryForm = instance;
	}

	// 点击查询按钮
	handleSearch = (values) => {
		console.log(values);
	}

	// 查询
	fetchData(offset, pageSize, sortField, sortOrder) {
		this.setState({loading: true});

		// 组织查询数据
		// let pageParms = this.state.queryData;
		// offset, pageSize, sortField, sortOrder

		queryUser().then(res => {
			// Each record in table should have a unique `key` prop,or set `rowKey` to an unique primary key.
			res.data.map((item, index) => {
				return item.key = item.id;
			});

			this.state.pagination.total = res.data.length;
			this.setState({
				loading: false,
				dataSource: res.data
			});
			this.setState(this.state.pagination);
		});
	}

	// 分页、排序、筛选变化时触发
	handleTableChange(pagination, filters, sorter) {
		this.setState({
			pagination: pagination
		});
		//      this.fetchData(pagination.current,pagination.pageSize);
		this.fetchData(pagination.current, pagination.pageSize, sorter.field, sorter.order == "ascend" ? true : false);
	}

	// 关联子组件
	saveFormRef = (form) => {
		this.form = form;
	}

	// 弹出用户编辑页面
	toUpdateUser(user) {
		this.form.resetFields();
		let isAdd = user.id ? false : true;
		user.password = "";
		debugger
		this.form.setFieldsValue(user);
		this.setState({
			visible: true,
			isAdd: isAdd,
			user
		});
	}

	// 子组件，确定
	handleOk = (e) => {
		console.log(e);
		this.setState({
			loading: true
		});
		let filedsValue = this.form.getFieldsValue();
		addUser({
			id: this.state.edtingUserData.id,
			...filedsValue
		}).then(res => {
			let list = [];
			if (res.code === '000') {
				this.setState({
					visible: false,
					loading: false
				});
				this.fetchData(0, 10);
				message.success('保存用户信息成功！');
			} else {
				this.setState({
					loading: false
				});
				message.error(res.msg);
			}
		});
	}

	// 子组件，取消
	handleCancel = (e) => {
		this.setState({
			visible: false,
		});
	}

	// 删除用户
	deleteUser(user) {
		this.setState({
			loading: true
		});
		deleteUser(user.id).then(res => {
			let list = [];
			if (res.code === '000') {
				message.success('删除成功！');
				this.setState({
					loading: false
				});
				this.fetchData(0, 10);
			} else {
				message.error(res.msg);
			}
		});
	}

	// 切换用户状态
	changeUserState(user) {
		let parmaObj = {
			id: user.id,
			status: (user.status === "y" ? "n" : "y")
		};
		updateUser(parmaObj).then(res => {
			let list = [];
			if (res.code === '000') {
				message.success('修改状态成功！');
				this.setState({
					visible: false,
					loading: false,

				});
				this.fetchData(0, 10);

			} else {
				message.error(res.msg);
			}
		});
	}

	render() {
		let that = this;

		const columns = [{
			title: '编号',
			dataIndex: 'id',
			render: text => <a><span style={{marginRight: 25}}>{text}</span></a>,
			sorter: true,
			width: 80
		}, {
			title: '用户名',
			dataIndex: 'userName',
			sorter: true,
			width: 200
		}, {
			title: '姓名',
			dataIndex: 'userRealname',
			sorter: true,
			width: 320
		}, {
			title: '注册时间',
			dataIndex: 'createTime',
			render: text => formatTime(new Date(text)),
			sorter: true,
			width: 400
		}, {
			title: '状态',
			dataIndex: 'userState',
			sorter: true,
			width: 200,
			filters: [{ // 筛选项
				text: '启用',
				value: 'valid',
			}, {
				text: '禁用',
				value: 'invalid',
			}],
			filterMultiple: false // 是否可多选
		}, {
			title: '分配角色',
			key: 'oper',
			width: 300,
			render(record) {
				let transfer = <Button type="primary" onClick={function () {that.toUpdateUser(record)}}>分配</Button>;
				return <div> {transfer} </div>
			}
		}];

		const {data, selectedRowKeys} = this.state;

		// 单个Col的列宽设定（24 栅格）
		const formItemLayout = {
			labelCol: {span: 8}, // label列宽
			wrapperCol: {span: 16} // 控件列宽
		};

		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const hasSelected = selectedRowKeys.length > 0;

		return (
			<div>
				{/* 查询区 */}
				<QueryForm onSubmit={this.handleSearch} ref={this.saveFormRef2} />

				{/* 编辑窗 */}
				<EditForm visible={this.state.visible} ref={this.saveFormRef} isAdd={this.state.isAdd} handleCancel={this.handleCancel}
					handleCreate={this.handleOk.bind(this)} />

				<ViewModal visible={this.state.visible} dataSource={this.state.dataSource} />

				{/* 数据列表 */}
				<div>
					<div style={{marginLeft: 8, marginTop: 20, marginBottom: 8}}>
						<Button type="primary" icon="file-excel" onClick={this.toUpdateUser.bind(this, {})}>导出</Button>
						<Button type="primary" style={{marginLeft: 8}} icon="bars" onClick={this.toUpdateUser.bind(this, {})} disabled={!hasSelected}>查看</Button>
						<Button type="primary" style={{marginLeft: 8}} icon="plus" onClick={this.toUpdateUser.bind(this, {})}>新增</Button>
						<Button type="primary" style={{marginLeft: 8}} icon="edit" onClick={this.toUpdateUser.bind(this, {})} disabled={!hasSelected}>编辑</Button>
						<Popconfirm placement="topRight" title="确认要删除吗？" onConfirm={this.toUpdateUser.bind(this, {})} okText="确认" cancelText="取消">
							<Button type="primary" style={{marginLeft: 8}} icon="delete" disabled={!hasSelected}>删除</Button>
						</Popconfirm>
						<Button type="primary" style={{marginLeft: 8}} icon="lock" onClick={this.toUpdateUser.bind(this, {})} disabled={!hasSelected}>停用</Button>
						<span style={{marginLeft: 8}}>
							{hasSelected ? `已选中 ${selectedRowKeys.length} 条记录` : ''}
						</span>
					</div>
					<Table rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} bordered={true}
						loading={this.state.loading} pagination={this.state.pagination} onChange={this.handleTableChange.bind(this)} />
				</div>
			</div >
		)
	}
}
