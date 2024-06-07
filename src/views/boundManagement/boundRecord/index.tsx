import React, { useEffect, useState } from "react";
import { Table } from "antd";
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
			<Table dataSource={boundRecordInfo} rowKey="_id">
				<Column
					title="发生时间"
					dataIndex="happenTime"
					key="happenTime"
					render={happenTime => moment(parseInt(happenTime)).format("YYYY-MM-DD HH:mm:ss")}
				/>
				<Column title="类型" dataIndex="type" key="type" render={type => (type === "inBound" ? "入库" : "出库")} />
				<Column title="公司" dataIndex="companyName" key="companyName" />
				<Column title="产品名称" dataIndex="productName" key="productName" />
				<Column title="板数" dataIndex="quantity" key="quantity" />
			</Table>
		</div>
	);
};

export default BoundRecord;
