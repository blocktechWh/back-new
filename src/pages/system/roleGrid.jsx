import React from 'react';
import {Table, Button, Popconfirm, message} from 'antd';

import AddForm from './roleAdd';
import EditForm from './roleEdit';
import ExtendForm from './roleLinkMenu';

import Api from '../../api';
import {eventProxy, formatTime, And, Or, Oper, Order} from '../../utils';

export default class extends React.Component {
	// 页面即将加载
	componentWillMount() {
		// 监听查询事件
		eventProxy.on('queryEvent', (values) => {
			console.log("queryEvent");
			this.queryData = values;
			this.doQuery();
		});

		// 监听刷新事件
		eventProxy.on('reloadEvent', () => {
			console.log("reloadEvent");
			this.doQuery();
		});

		// 对象信息
		this.objId = 'Role'; // 注意首字母大写
		this.objName = '角色';

		// 关联方法
		this.queryFunc = Api[`query${this.objId}`];
		this.deleteFunc = Api[`delete${this.objId}`];
		this.exportFunc = Api[`export${this.objId}`];

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
		isAddShow: false,
		isEditShow: false,
		editKeys: [],

		// 扩展子组件相关
		isExtendShow: false,
		extendKey: '',
	}

	// 查询
	doQuery = () => {
		//	console.log("doQuery, queryData=" + JSON.stringify(this.queryData));
		//	console.log("doQuery, pagination=" + JSON.stringify(this.state.pagination));
		//	console.log("doQuery, filters=" + JSON.stringify(this.filters));
		//	console.log("doQuery, sorter=" + JSON.stringify(this.sorter));

		this.setState({loading: true});

		// 查询条件
		let and = new And("menuCode", this.queryData.code, Oper.like);
		and.add("menuName", this.queryData.name, Oper.like);

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
			query.order = new Order(this.sorter.field, this.sorter.order);
		}
		//	console.log("doQuery, query=" + JSON.stringify(query));

		// 查询
		this.queryFunc(query).then(res => {
			if (200 === res.status) {
				// 设置每一条数据的key
				// Each record in table should have a unique `key` prop,or set `rowKey` to an unique primary key.
				res.data.rows.map((item, index) => {
					return item.key = item.id;
				});

				let pagination = this.state.pagination;
				pagination.total = res.data.total;
				this.setState({
					selectedRowKeys: [],
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
		console.log(this.exportFunc);
	}

	// 删除
	doDelete = () => {
		console.log("doDelete, keys=" + this.state.selectedRowKeys);

		this.deleteFunc(this.state.selectedRowKeys[0]).then(res => {
			if (200 === res.status) {
				eventProxy.trigger('reloadEvent');
				message.info(`删除${this.objName}成功`);
			} else {
				message.error(res.msg);
			}
		});
	}

	// ------子组件：新增------
	linkAddForm = (obj) => this.addForm = obj;
	showAddForm = () => {this.addForm.resetFields(); this.setState({isAddShow: true});}
	closeAddForm = () => this.setState({isAddShow: false});

	// ------子组件：编辑------
	linkEditForm = (obj) => this.editForm = obj;
	showEditForm = () => {this.editForm.resetFields(); this.setState({editKeys: this.state.selectedRowKeys, isEditShow: true});}
	closeEditForm = () => this.setState({editKeys: [], isEditShow: false});

	// ------扩展子组件：分配权限------
	linkExtendForm = (obj) => this.extendForm = obj;
	showExtendForm = (roleId) => this.setState({extendKey: roleId, isExtendShow: true});
	closeExtendForm = () => this.setState({extendKey: '', isExtendShow: false});

	// render
	render() {
		const columns = [{
			title: '编号',
			dataIndex: 'id',
			align: 'center',
			sorter: true,
			width: 80
		}, {
			title: '角色名称',
			dataIndex: 'roleName',
			sorter: true,
			width: 200
		}, {
			title: '角色描述',
			dataIndex: 'roleDesc',
			width: 320
		}, {
			title: '分配权限',
			key: 'oper',
			width: 300,
			render: record => {
				return <div> <Button type="primary" onClick={() => {this.showExtendForm(record.key)}}>分配</Button> </div>
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

		return (
			<div>
				{/* 新增、编辑 */}
				<AddForm ref={this.linkAddForm} visible={this.state.isAddShow} onClose={this.closeAddForm} />
				<EditForm ref={this.linkEditForm} visible={this.state.isEditShow} onClose={this.closeEditForm} dataKeys={this.state.editKeys} />

				{/* 分配权限 */}
				<ExtendForm ref={this.linkExtendForm} visible={this.state.isExtendShow} onClose={this.closeExtendForm} dataKeys={this.state.extendKey} />

				{/* 数据列表 */}
				<div>
					<div style={{marginLeft: 8, marginTop: 20, marginBottom: 8}}>
						<Button type="primary" icon="file-excel" onClick={this.exportExcel}>导出</Button>
						<Button type="primary" style={{marginLeft: 8}} icon="plus" onClick={this.showAddForm}>新增</Button>
						<Button type="primary" style={{marginLeft: 8}} icon="edit" onClick={this.showEditForm} disabled={!hasSelected}>编辑</Button>
						<Popconfirm placement="topRight" title="确认要删除吗？" onConfirm={this.doDelete} okText="确认" cancelText="取消">
							<Button type="primary" style={{marginLeft: 8}} icon="delete" disabled={!hasSelected}>删除</Button>
						</Popconfirm>
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
