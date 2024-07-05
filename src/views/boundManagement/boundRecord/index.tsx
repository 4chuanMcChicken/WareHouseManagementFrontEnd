import React, { useEffect, useState } from "react";
import { Card, Table, Tag } from "antd";
import { BoundRecordInfo } from "@/api/interface/common";
import { getBoundRecordsInfo } from "@/api/modules/common";
import moment from "moment";
const { Column } = Table;

const BoundRecord: React.FC = () => {
	const [boundRecordInfo, setBoundRecordInfo] = useState<BoundRecordInfo[]>([]);
	const [searchType] = useState("all");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getBoundRecordsInfo(searchType);
				setBoundRecordInfo(result.data?.boundRecords || []);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData(); // 调用异步函数
	}, []);
	return (
		<div>
			<Card title="出入库记录">
				<Table dataSource={boundRecordInfo} rowKey="_id">
					<Column
						title="发生时间"
						dataIndex="happenTime"
						key="happenTime"
						render={happenTime => moment(parseInt(happenTime)).format("YYYY-MM-DD HH:mm:ss")}
					/>
					<Column
						title="类型"
						dataIndex="type"
						key="type"
						render={type => {
							let color = type === "inBound" ? "green" : "blue";
							let text = type === "inBound" ? "入库" : "出库";
							return <Tag color={color}>{text}</Tag>;
						}}
					/>{" "}
					<Column title="公司" dataIndex="companyName" key="companyName" />
					<Column title="产品名称" dataIndex="productName" key="productName" />
					<Column title="数量" dataIndex="quantity" key="quantity" />
					<Column
						title="单位"
						dataIndex="outBoundType"
						key="outBoundType"
						render={outBoundType => (outBoundType ? (outBoundType === "case" ? "箱" : "板") : "板")}
					/>
				</Table>
			</Card>
		</div>
	);
};

export default BoundRecord;
