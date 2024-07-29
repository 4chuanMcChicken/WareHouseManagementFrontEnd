import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Input, message } from "antd";
import { BoundRecordInfo } from "@/api/interface/common";
import { getBoundRecordsInfo, revokeBoundRecord } from "@/api/modules/common";
import moment from "moment";
import "./index.less";
const { Column } = Table;

const BoundRecord: React.FC = () => {
	const [boundRecordInfo, setBoundRecordInfo] = useState<BoundRecordInfo[]>([]);
	const [searchType] = useState("all");
	const [password, setPassword] = useState("");

	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [selectedRows, setSelectedRows] = useState<BoundRecordInfo[]>([]);
	const fetchData = async () => {
		try {
			const result = await getBoundRecordsInfo(searchType);
			setBoundRecordInfo(result.data?.boundRecords || []);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	useEffect(() => {
		fetchData(); // 调用异步函数
	}, []);
	let hasSelected = selectedRowKeys.length > 0;

	const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRow: BoundRecordInfo[]) => {
		const stringRowKeys = newSelectedRowKeys.map(key => key.toString());
		setSelectedRowKeys(stringRowKeys);
		setSelectedRows(selectedRow);
		console.log(selectedRows);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange
	};

	const confirmRevoke = async () => {
		if (selectedRowKeys.length > 1) {
			message.error("每次撤销只能选择一次记录");
			return;
		}
		await revokeBoundRecord(selectedRowKeys[0], password);
		message.success("撤销成功");
		setPassword("");
		fetchData();
	};

	const handlePasswordChange = (e: any) => {
		setPassword(e.target.value);
	};

	const handlePaste = (e: any) => {
		e.preventDefault();
		message.warning("粘贴功能已禁用，请手动输入密码");
	};

	return (
		<div>
			<Card title="出入库记录">
				<div className="revoke-input">
					<Input
						placeholder="请输入撤销6位密码"
						className="input"
						value={password}
						onChange={handlePasswordChange}
						onPaste={handlePaste}
					/>
					<Button type="primary" onClick={confirmRevoke} disabled={!hasSelected} className="button">
						确定撤销
					</Button>
				</div>
				<Table dataSource={boundRecordInfo} rowSelection={rowSelection} rowKey="_id">
					<Column
						title="发生时间"
						dataIndex="happenTime"
						key="happenTime"
						render={happenTime => moment(parseInt(happenTime)).format("YYYY-MM-DD")}
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
					<Column title="备注" dataIndex="comment" key="comment" />
				</Table>
			</Card>
		</div>
	);
};

export default BoundRecord;
