import React, { useEffect, useState, useRef } from "react";
import { Card, Table, Tag, Button, Input, message, Select, DatePicker } from "antd";
import { BoundRecordInfo } from "@/api/interface/common";
import { getBoundRecordsInfo, revokeBoundRecord } from "@/api/modules/common";
import moment from "moment";
import type { InputRef } from "antd";
import "./index.less";
import type { RangePickerProps } from "antd/es/date-picker";
const { Column } = Table;
const { RangePicker } = DatePicker;

const BoundRecord: React.FC = () => {
	const [boundRecordInfo, setBoundRecordInfo] = useState<BoundRecordInfo[]>([]);
	const [searchType, setSearchType] = useState("all");
	const [password, setPassword] = useState("");
	const companyNameRef = useRef<InputRef>(null);
	const dateRangeRef = useRef<RangePickerProps["value"]>(null);

	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [selectedRows, setSelectedRows] = useState<BoundRecordInfo[]>([]);
	const fetchData = async () => {
		try {
			const result = await getBoundRecordsInfo(searchType, companyNameRef.current?.input?.value || undefined);
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

	const handleSearch = async () => {
		try {
			const dateRange = dateRangeRef.current;

			const dateFrom = dateRange?.[0]?.valueOf() || undefined;
			const dateTo = dateRange?.[1]?.valueOf() || undefined;
			const result = await getBoundRecordsInfo(searchType, companyNameRef.current?.input?.value || undefined, dateFrom, dateTo);
			setBoundRecordInfo(result.data?.boundRecords || []);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
		// You can add your search logic here
	};

	const handleTimeChange: RangePickerProps["onChange"] = dates => {
		dateRangeRef.current = dates;
	};

	const handleOutBoundTypeChange = (option: any) => {
		if (option.value === "all") {
			setSearchType("all");
		} else if (option.value === "outBound") {
			setSearchType("outBound");
		} else if (option.value === "inBound") {
			setSearchType("inBound");
		}
	};

	return (
		<div id="bound-record">
			<div className="search-container">
				<div className="search-bar">
					<div className="search-bar-left">
						<div className="input-container">
							<span>公司名称:</span>
							<Input ref={companyNameRef} placeholder="请输入公司名称" />
						</div>
						<div className="input-container">
							<span>记录类型:</span>
							<Select
								labelInValue
								onChange={handleOutBoundTypeChange}
								className="select-container"
								defaultValue={{ key: "all", label: "全部" }}
							>
								<Select.Option key="all" value="all">
									全部
								</Select.Option>
								<Select.Option key="inBound" value="inBound">
									入库
								</Select.Option>
								<Select.Option key="outBound" value="outBound">
									出库
								</Select.Option>
							</Select>
						</div>
						<div className="input-container">
							<span>入库时间:</span>
							<RangePicker onChange={handleTimeChange} />
						</div>
					</div>
					<Button type="primary" onClick={handleSearch} style={{ float: "right" }}>
						搜索
					</Button>
				</div>
			</div>
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
