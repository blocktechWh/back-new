import React from 'react';
import {Table, Button, message} from 'antd';

import Api from '../../../api';
import {eventProxy, Query} from '../../../utils';
import {menuList} from '../../../menuFunc';

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
		this.objId = 'Menu'; // 注意首字母大写
		this.objName = '菜单';

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
		pagination: { // 分页信息
			defaultPageSize: 20,
			total: 0,
			showSizeChanger: true,
			showQuickJumper: true,
			showTotal: total => `共 ${total} 条`,
		},

		// 子列表相关
		expandedRowKey: '', // 子列表展开对象，必须限制每次只能展开一个
		subDataSource: [], // 列表数据源
	}

	// 查询
	doQuery = () => {
		//	console.log("doQuery, queryData=" + JSON.stringify(this.queryData));
		//	console.log("doQuery, pagination=" + JSON.stringify(this.state.pagination));
		//	console.log("doQuery, filters=" + JSON.stringify(this.filters));
		//	console.log("doQuery, sorter=" + JSON.stringify(this.sorter));

		this.setState({loading: true});

		// 查询条件
		let and = new Query.And("menuCode", this.queryData.code, Query.Oper.like);
		and.add("menuName", this.queryData.name, Query.Oper.like);

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

	// 同步
	doSync = () => {
		Api.syncMenu(menuList).then(res => {
			if (200 === res.status) {
				message.info('同步完成');
				this.doQuery();
			} else {
				message.error(res.msg);
			}
		});
	}

	// 子列表展开
	doTableExpand = (expanded, record) => {
		if (expanded) { // 展开
			Api.getMenuFunc(record.key).then(res => {
				if (200 === res.status) {
					res.data.map((item, index) => {
						return item.key = item.id;
					});

					this.setState({
						expandedRowKey: record.key,
						subDataSource: res.data,
					});
				} else {
					message.error(res.msg);
				}
			});
		} else { // 关闭
			this.setState({
				expandedRowKey: '',
				subDataSource: [],
			});
		}
	}

	// render
	render() {
		// 菜单功能子表格
		const menuFuncRender = () => {
			const columns = [{
				title: '功能编号',
				dataIndex: 'funcCode',
			}, {
				title: '功能名称',
				dataIndex: 'requestName',
			}, {
				title: '请求方法',
				dataIndex: 'requestMethod',
			}, {
				title: '请求路径',
				dataIndex: 'requestPattern',
			}];

			// 表头功能栏
			const header = () => {
				return '功能列表';
			}

			return (
				<Table title={header} size='small' columns={columns} dataSource={this.state.subDataSource} pagination={false} bordered={true} />
			);
		};

		const columns = [{
			title: '菜单编号',
			dataIndex: 'menuCode',
			sorter: true,
			width: 200
		}, {
			title: '菜单名称',
			dataIndex: 'menuName',
			sorter: true,
			width: 320
		}];


		// 表头功能栏
		const header = () => {
			return (
				<Button type="primary" icon="sync" onClick={this.doSync}>同步</Button>
			)
		}

		return (
			<Table title={header} columns={columns} dataSource={this.state.dataSource}
				bordered={true} loading={this.state.loading}
				pagination={this.state.pagination} onChange={this.doTableChange}
				expandedRowRender={menuFuncRender} expandRowByClick={false}
				onExpand={this.doTableExpand} expandedRowKeys={[this.state.expandedRowKey]} />
		)
	}
}
