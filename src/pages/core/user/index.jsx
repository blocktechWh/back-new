import React from 'react';
import {Breadcrumb} from 'antd';
import QueryForm from './query';
import DataGrid from './grid';

export default class extends React.Component {
	componentWillMount() {
		console.log(this.props.functions)
		console.log(this.props.title)
	}

	render() {
		const breadcrumb = () => {
			const titles = this.props.title.map((title, index) => {
				return (<Breadcrumb.Item key={index}>{title}</Breadcrumb.Item>)
			});

			return (<Breadcrumb>{titles}</Breadcrumb>);
		}

		return (
			<div>
				{breadcrumb()}

				{/* 查询区 */}
				<QueryForm />

				{/* 表格区 */}
				<DataGrid />
			</div >
		)
	}
}
