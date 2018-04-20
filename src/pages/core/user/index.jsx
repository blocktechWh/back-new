import React from 'react';
import QueryForm from './query';
import DataGrid from './grid';

export default class extends React.Component {
	componentWillMount() {
		console.log(this.props.functions)
		console.log(this.props.title)
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
