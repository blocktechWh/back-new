import React from 'react';
import QueryForm from './userQuery';
import DataGrid from './userGrid';
import {eventProxy} from '../../utils';

export default class User extends React.Component {
	// 页面加载
	componentDidMount() {
		// 初始查询
		this.doSearch();
	}

	// 关联子组件
	linkForm = (obj) => this.queryForm = obj;
	linkGrid = (obj) => this.dataGrid = obj;

	// 查询，使用观察者模式通知表格
	doSearch = () => {
		this.queryForm.validateFields((err, values) => {
			if (!err) {
				eventProxy.trigger('queryEvent', values);
			}
		});
	}

	render() {
		return (
			<div>
				{/* 查询区 */}
				<QueryForm ref={this.linkForm} onSubmit={this.doSearch} />

				{/* 表格区 */}
				<DataGrid ref={this.linkGrid} />
			</div >
		)
	}
}
