import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";
import { BoundRecordInfo } from "@/api/interface/common";
import { getBoundRecordInfo } from "@/api/modules/common";
const { Column } = Table;

const BoundRecord: React.FC = () => {
	const [boundRecordInfo, setBoundRecordInfo] = useState<BoundRecordInfo[]>();
	const [searchType] = useState("all");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getBoundRecordInfo(searchType);
				setBoundRecordInfo(result.data || []);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData(); // 调用异步函数
	}, []);
	return (
		<div>
			<Table dataSource={boundRecordInfo} rowKey="contactNumber">
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

export default BoundRecord;
