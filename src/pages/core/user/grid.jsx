import React from 'react';
import {Table, Button, Popconfirm, message} from 'antd';

import ViewForm from './view';
import AddForm from './add';
import EditForm from './edit';
import ExtendForm from './linkRole';

import Api from '../../../api';
import {eventProxy, formatTime, Query} from '../../../utils';

export default class extends React.Component {
	// 页面即将加载
	componentWillMount() {
		// 监听查询事件
		eventProxy.on('queryEvent', (values) => {
			console.log("queryEvent");
			this.queryData = values;
			this.selectedRowKeys = [];
			this.doQuery();
		});

		// 监听刷新事件
		eventProxy.on('reloadEvent', () => {
			console.log("reloadEvent");
			this.selectedRowKeys = [];
			this.doQuery();
		});

		// 定义内部属性
		this.queryData = {}; // 查询表单数据
		this.filters = {}; // 过滤信息
		// 排序信息
		this.sorter = {
			columnKey: '',
			field: '',
			order: '',
		};
	}

	// 页面卸载
	componentWillUnmount() {
		// 移除事件监听。否则再次加载后，会多次触发事件
		eventProxy.off('queryEvent');
		eventProxy.off('reloadEvent');
	}

	// 定义状态属性
	state = {
		loading: false, // 是否加载中
		dataSource: [], // 列表数据源
		selectedRowKeys: [],// 已选中记录
		pagination: { // 分页信息
			defaultPageSize: 20,
			total: 0,
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共 ${total} 条`,
		},

		// 子组件相关
		isViewShow: false,
		isAddShow: false,
		isEditShow: false,
		viewKeys: [],
		editKeys: [],

		// 扩展子组件相关
		isExtendShow: false,
		extendKey: '',
	}

	// 查询
	doQuery = () => {
		console.log("doQuery, queryData=" + JSON.stringify(this.queryData));
		console.log("doQuery, pagination=" + JSON.stringify(this.state.pagination));
		console.log("doQuery, filters=" + JSON.stringify(this.filters));
		console.log("doQuery, sorter=" + JSON.stringify(this.sorter));

		this.setState({loading: true});

		// 查询条件
		let and = new Query.And("userName", this.queryData.username, Query.Oper.like);
		and.add("userState", this.queryData.state);
		and.add("createTime", this.queryData.regDate[0], Query.Oper.after);
		and.add("createTime", this.queryData.regDate[1], Query.Oper.before);
		// 分页信息
		let pageSize = this.state.pagination.pageSize || this.state.pagination.defaultPageSize;
		let current = this.state.pagination.current || 1;
		let query = {
			query: and,
			start: pageSize * (current - 1),
			limit: pageSize,
		}
		// 排序条件
		if (this.sorter.field) {
			query.order = new Query.Order(this.sorter.field, this.sorter.order);
		}
		console.log("doQuery, query=" + JSON.stringify(query));

		// 查询
		Api.queryUser(query).then(res => {
			if (200 === res.status) {
				let pagination = this.state.pagination;
				pagination.total = res.data.total;
				this.setState({
					dataSource: res.data.rows,
					pagination,
				});
			} else {
				message.error(res.msg);
			}

			this.setState({loading: false});
		});
	}

	// 分页、排序、筛选变化时触发
	doTableChange = (pagination, filters, sorter) => {
		this.filters = filters;

		this.sorter.columnKey = sorter.columnKey;
		this.sorter.field = sorter.field;
		this.sorter.order = sorter.order;

		this.setState({pagination});
		eventProxy.trigger('reloadEvent');
	}

	// 导出
	exportExcel = () => {
		console.log("exportExcel");
	}

	// 删除
	doDelete = () => {
		console.log("doDelete, keys=" + this.state.selectedRowKeys);

		Api.deleteUser(this.state.selectedRowKeys[0]).then(res => {
			eventProxy.trigger('reloadEvent');
			message.info("删除用户成功");
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
	showViewForm = () => {this.setState({viewKeys: this.state.selectedRowKeys, isViewShow: true});}
	closeViewForm = () => {this.setState({viewKeys: [], isViewShow: false});}

	// ------子组件：新增------
	linkAddForm = (obj) => this.addForm = obj;
	showAddForm = () => {this.setState({isAddShow: true});}
	closeAddForm = () => {this.setState({isAddShow: false});}

	// ------子组件：编辑------
	linkEditForm = (obj) => this.editForm = obj;
	showEditForm = () => {this.setState({editKeys: this.state.selectedRowKeys, isEditShow: true});}
	closeEditForm = () => {this.setState({editKeys: [], isEditShow: false});}

	// ------扩展子组件：分配角色------
	linkExtendForm = (obj) => this.extendForm = obj;
	showExtendForm = (userId) => this.setState({extendKey: userId, isExtendShow: true});
	closeExtendForm = () => this.setState({extendKey: '', isExtendShow: false});

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
				return <div> <Button type="primary" onClick={() => {this.showExtendForm(record.id)}}>分配</Button> </div>
			}
		}];

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

		// 表头功能栏
		const header = () => {
			return (
				<div>
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
			)
		}

		return (
			<div>
				{/* 查看、新增、编辑 */}
				<ViewForm ref={this.linkViewForm} visible={this.state.isViewShow} onClose={this.closeViewForm} dataKeys={this.state.viewKeys} />
				<AddForm ref={this.linkAddForm} visible={this.state.isAddShow} onClose={this.closeAddForm} />
				<EditForm ref={this.linkEditForm} visible={this.state.isEditShow} onClose={this.closeEditForm} dataKeys={this.state.editKeys} />

				{/* 分配角色 */}
				<ExtendForm ref={this.linkExtendForm} visible={this.state.isExtendShow} onClose={this.closeExtendForm} dataKeys={this.state.extendKey} />

				{/* 数据列表 */}
				<Table title={header} rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} rowKey={record => record.id}
					bordered={true} loading={this.state.loading} pagination={this.state.pagination} onChange={this.doTableChange} />
			</div >
		)
	}
}
