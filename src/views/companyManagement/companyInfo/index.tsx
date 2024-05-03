import React from "react";
import { Space, Table } from "antd";

const { Column } = Table;

interface DataType {
	key: React.Key;
	firstName: string;
	lastName: string;
	age: number;
	address: string;
	tags: string[];
}

const data: DataType[] = [
	{
		key: "1",
		firstName: "John",
		lastName: "Brown",
		age: 32,
		address: "New York No. 1 Lake Park",
		tags: ["nice", "developer"]
	},
	{
		key: "2",
		firstName: "Jim",
		lastName: "Green",
		age: 42,
		address: "London No. 1 Lake Park",
		tags: ["loser"]
	},
	{
		key: "3",
		firstName: "Joe",
		lastName: "Black",
		age: 32,
		address: "Sydney No. 1 Lake Park",
		tags: ["cool", "teacher"]
	}
];

const companyInfo: React.FC = () => (
	<div>
		<Table dataSource={data}>
			<Column title="firstName" dataIndex="firstName" key="firstName" />
			<Column title="Age" dataIndex="age" key="age" />
			<Column title="Address" dataIndex="address" key="address" />
			<Column
				title="Action"
				key="action"
				render={() => (
					<Space size="middle">
						<a>Delete</a>
					</Space>
				)}
			/>
		</Table>
	</div>
);

export default companyInfo;
