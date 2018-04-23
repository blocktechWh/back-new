import React from 'react';
import {Table, Pagination, Button, message} from 'antd';

import Api from '../../../api';
import {eventProxy, formatTime, Query} from '../../../utils';

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

		// 定义内部属性
		this.queryData = {}; // 查询表单数据
		this.defaultPageSize = 20; // 默认分页记录数
		this.pagination = { // 分页信息
			current: 1,
			pageSize: this.defaultPageSize,
		};
		this.filters = {}; // 过滤信息
		this.sorter = { // 排序信息
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
		selectedRowKeys: [], // 已选中记录
		total: 0, // 总记录数
	}

	// 查询
	doQuery = () => {
		this.setState({loading: true});

		// 分页信息
		let query = {
			current: this.pagination.current,
			pageSize: this.pagination.pageSize,
		}

		// 查询条件
		let and = new Query.And("userName", this.queryData.name, Query.Oper.like);
		query.query = and;

		// 排序条件
		if (this.sorter.field) {
			query.order = new Query.Order(this.sorter.field, this.sorter.order);
		}

		console.log('doQuery', JSON.stringify(query));

		// 查询
		Api.queryOnlineHis(query).then(res => {
			if (200 === res.status) {
				this.setState({
					dataSource: res.data.rows,
					total: res.data.total,
					selectedRowKeys: [],
				});
			} else {
				message.error(res.msg);
			}

			this.setState({loading: false});
		});
	}

	// 分页事件
	doPaginationChange = (page, pageSize) => {
		this.doTableChange({
			current: page,
			pageSize: pageSize,
		})
	}

	// 排序、筛选变化时触发
	doTableChange = (pagination, filters = this.filters, sorter = this.sorter) => {
		if (Object.keys(pagination).length) {
			this.pagination = pagination;
		}

		this.filters = filters;
		this.sorter.columnKey = sorter.columnKey;
		this.sorter.field = sorter.field;
		this.sorter.order = sorter.order;
		eventProxy.trigger('reloadEvent');
	}

	// 导出
	exportExcel = () => {
		console.log("exportExcel");
	}

	// render
	render() {
		const columns = [{
			title: '序号',
			render: (text, record, index) => index + 1,
			width: 80
		}, {
			title: '用户名',
			dataIndex: 'userName',
			sorter: true,
			width: 160
		}, {
			title: '用户名称',
			dataIndex: 'userRealname',
			sorter: true,
			width: 160
		}, {
			title: 'token',
			dataIndex: 'token',
			width: 400
		}, {
			title: '登录ip',
			dataIndex: 'loginIp',
			width: 160
		}, {
			title: '登录时间',
			dataIndex: 'loginTime',
			render: text => formatTime(new Date(text)),
			sorter: true,
			width: 400
		}, {
			title: '最后访问时间',
			dataIndex: 'lastReqTime',
			render: text => formatTime(new Date(text)),
			sorter: true,
			width: 400
		}, {
			title: '登出方式',
			dataIndex: 'logoutType',
			render: text => text,
			width: 160
		}, {
			title: '登出时间',
			dataIndex: 'logoutTime',
			render: text => formatTime(new Date(text)),
			sorter: true,
			width: 400
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
					<span style={{marginLeft: 8}}>
						{hasSelected ? `已选中 ${selectedRowKeys.length} 条记录` : ''}
					</span>
				</div>
			)
		}

		// 表尾分页
		const footer = () => {
			return (
				<Pagination defaultPageSize={this.defaultPageSize} showSizeChanger={true} showQuickJumper={true} showTotal={total => `共 ${total} 条`}
					total={this.state.total} onChange={this.doPaginationChange} onShowSizeChange={this.doPaginationChange} />
			)
		}

		return (
			<div>
				{/* 数据列表 */}
				<Table title={header} rowSelection={rowSelection} columns={columns} dataSource={this.state.dataSource} rowKey={record => record.id}
					bordered={true} loading={this.state.loading} onChange={this.doTableChange} pagination={false} footer={footer} />
			</div >
		)
	}
}
