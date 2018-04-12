import React from 'react';
import QueryForm from './roleQuery';
import DataGrid from './roleGrid';

export default class extends React.Component {
	componentWillMount() {
		console.log(this.props.functions)
	}

	render() {
		return (
			<div>
				{/* 查询区 */}
				<QueryForm />

				{/* 表格区 */}
				<DataGrid />
			</div >
		)
	}
}
