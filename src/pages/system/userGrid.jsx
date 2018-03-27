import React from 'react';
import {Table, Modal, Form, Button, message, Popconfirm, Select, Input, DatePicker, Switch, Row, Col, Message} from 'antd';

import ViewForm from './userView';
import AddForm from './userAdd';
import EditForm from './userEdit';

import {queryUser, deleteUser} from '../../api';
import {eventProxy, formatTime, And, Or, Oper, Order} from '../../utils';

export default class UserGrid extends React.Component {
	// 定义状态属性
	state = {
		// 外部数据
		queryData: {}, // 查询表单数据

		// 组件数据
		loading: false, // 是否加载中
		dataSource: [], // 列表数据源
		selectedRowKeys: [], // 已选中记录
		pagination: { // 分页信息
			defaultPageSize: 1,
			total: 0,
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共 ${total} 条`,
			onShowSizeChange: (current, pageSize) => {}
		},
		filters: {}, // 过滤信息
		sorter: {}, // 排序信息

		// 子组件相关
		isViewShow: false,
		isAddShow: false,
		isEditShow: false,
		viewKeys: [],
		editKeys: []
	}

	// 页面加载
	componentDidMount() {
		// 监听事件（查询）
		eventProxy.on('queryEvent', (values) => {
			console.log("queryEvent:" + JSON.stringify(values));
			// 设置状态，保存查询条件
			this.state.queryData = values;
			this.setState(this.state.queryData);
			// 触发查询方法
			this.doQuery();
		});
		// 监听事件（刷新）
		eventProxy.on('reloadEvent', () => {
			console.log("reloadEvent");
			// 设置状态，清空选中记录
			this.setState({selectedRowKeys: []});
			// 触发查询方法
			this.doQuery();
		});
	}

	// 查询
	doQuery = () => {
		console.log("doQuery, queryData=" + JSON.stringify(this.state.queryData));
		console.log("doQuery, pagination=" + JSON.stringify(this.state.pagination));
		console.log("doQuery, filters=" + JSON.stringify(this.state.filters));
		console.log("doQuery, sorter=" + JSON.stringify(this.state.sorter));

		this.setState({loading: true});

		// 组织查询数据
		let and = new And("userName", this.state.queryData.username, Oper.like);
		and.add("userState", this.state.queryData.state);

		let pageSize = this.state.pagination.pageSize || this.state.pagination.defaultPageSize;
		let current = this.state.pagination.current || 1;

		let query = {
			query: and,
			start: pageSize * (current - 1),
			limit: pageSize,
			sortBy: "id",
			sortDir: "asc"
		}
		console.log("doQuery, query=" + JSON.stringify(query));

		// 查询
		queryUser(query).then(res => {
			// 设置每一条数据的key
			// Each record in table should have a unique `key` prop,or set `rowKey` to an unique primary key.
			res.data.rows.map((item, index) => {
				return item.key = item.id;
			});

			this.setState({
				loading: false,
				dataSource: res.data.rows
			});

			console.log("doQuery, total=" + res.data.total);
			this.state.pagination.total = res.data.total;
			this.setState(this.state.pagination);
		});
	}

	// 分页、排序、筛选变化时触发
	doTableChange = (pagination, filters, sorter) => {
		this.state.pagination = pagination;
		this.state.filters = filters;
		this.state.sorter = {
			columnKey: sorter.columnKey,
			field: sorter.field,
			order: sorter.order
		};
		this.setState({
			pagination,
			filters,
			sorter
		});
		eventProxy.trigger('reloadEvent');
	}

	// 导出
	exportExcel = () => {
		console.log("exportExcel");
	}

	// 删除
	doDelete = () => {
		console.log("doDelete, keys=" + this.state.selectedRowKeys);

		deleteUser(this.state.selectedRowKeys[0]).then(res => {
			eventProxy.trigger('reloadEvent');
			Message.info("删除用户成功");
		});
	}

	// ------扩展按钮：切换用户状态------
	switchState = (userId) => {
		console.log("switchState, userId=" + userId);
	}

	// ------扩展按钮：分配角色------
	assignRole = (userId) => {
		console.log("assignRole, userId=" + userId);
	}

	// ------子组件：查看------
	linkViewForm = (obj) => this.viewForm = obj;
	showViewForm = () => {
		this.setState({
			viewKeys: this.state.selectedRowKeys,
			isViewShow: true
		});
	}
	closeViewForm = () => {
		this.setState({
			viewKeys: [],
			isViewShow: false
		});
	}

	// ------子组件：新增------
	linkAddForm = (obj) => this.addForm = obj;
	showAddForm = () => {
		this.setState({
			isAddShow: true
		});
	}
	closeAddForm = () => {
		this.setState({
			isAddShow: false
		});
	}

	// ------子组件：编辑------
	linkEditForm = (obj) => this.editForm = obj;
	showEditForm = () => {
		this.setState({
			editKeys: this.state.selectedRowKeys,
			isEditShow: true
		});
	}
	closeEditForm = () => {
		this.setState({
			editKeys: [],
			isEditShow: false
		});
	}

	// render
	render() {
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
			render: record => {
				return <div> <Button type="primary" onClick={() => {this.assignRole(record.key)}}>分配</Button> </div>
			}
		}];

		// 单个Col的列宽设定（24 栅格）
		const formItemLayout = {
			labelCol: {span: 8}, // label列宽
			wrapperCol: {span: 16} // 控件列宽
		};

		// 选中记录变化
		const {selectedRowKeys} = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: (selectedRowKeys) => {
				console.log('selectedRowKeys changed:', selectedRowKeys);
				this.setState({selectedRowKeys});
			}
		};
		// 是否选中记录
		const hasSelected = selectedRowKeys.length > 0;

		return (
			<div>
				{/* 查看、新增、编辑 */}
				<ViewForm ref={this.linkViewForm} visible={this.state.isViewShow} onClose={this.closeViewForm} dataKeys={this.state.viewKeys} />
				<AddForm ref={this.linkAddForm} visible={this.state.isAddShow} onClose={this.closeAddForm} />
				<EditForm ref={this.linkEditForm} visible={this.state.isEditShow} onClose={this.closeEditForm} dataKeys={this.state.editKeys} />

				{/* 数据列表 */}
				<div>
					<div style={{marginLeft: 8, marginTop: 20, marginBottom: 8}}>
						<Button type="primary" icon="file-excel" onClick={this.exportExcel}>导出</Button>
						<Button type="primary" style={{marginLeft: 8}} icon="bars" onClick={this.showViewForm} disabled={!hasSelected}>查看</Button>
						<Button type="primary" style={{marginLeft: 8}} icon="plus" onClick={this.showAddForm}>新增</Button>
						<Button type="primary" style={{marginLeft: 8}} icon="edit" onClick={this.showEditForm} disabled={!hasSelected}>编辑</Button>
						<Popconfirm placement="topRight" title="确认要删除吗？" onConfirm={this.doDelete} okText="确认" cancelText="取消">
							<Button type="primary" style={{marginLeft: 8}} icon="delete" disabled={!hasSelected}>删除</Button>
						</Popconfirm>
						<Button type="primary" style={{marginLeft: 8}} icon="lock" onClick={this.exportExcel} disabled={!hasSelected}>停用</Button>
						<span style={{marginLeft: 8}}>
							{hasSelected ? `已选中 ${selectedRowKeys.length} 条记录` : ''}
						</span>
					</div>
					<Table rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} bordered={true}
						loading={this.state.loading} pagination={this.state.pagination} onChange={this.doTableChange} />
				</div>
			</div >
		)
	}
}
