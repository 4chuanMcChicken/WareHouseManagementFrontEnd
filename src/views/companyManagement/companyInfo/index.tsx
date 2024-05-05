import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import { getAllCompanyInfo } from "@/api/modules/common";
import { CompanyInfo } from "@/api/interface/common";

const { Column } = Table;

// const data: DataType[] = [
// 	{
// 		key: "1",
// 		firstName: "John",
// 		lastName: "Brown",
// 		age: 32,
// 		address: "New York No. 1 Lake Park",
// 		tags: ["nice", "developer"]
// 	},
// 	{
// 		key: "2",
// 		firstName: "Jim",
// 		lastName: "Green",
// 		age: 42,
// 		address: "London No. 1 Lake Park",
// 		tags: ["loser"]
// 	},
// 	{
// 		key: "3",
// 		firstName: "Joe",
// 		lastName: "Black",
// 		age: 32,
// 		address: "Sydney No. 1 Lake Park",
// 		tags: ["cool", "teacher"]
// 	}
// ];

const companyInfo: React.FC = () => {
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getAllCompanyInfo();
				setCompanyInfo(result.data?.companyInfos || []);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData(); // 调用异步函数
	}, []);

	return (
		<div>
			<Table dataSource={companyInfo} rowKey="contactNumber">
				<Column title="公司名" dataIndex="name" key="companyName" />
				<Column title="联系方式" dataIndex="contactNumber" key="contactNumber" />
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
};

export default companyInfo;
