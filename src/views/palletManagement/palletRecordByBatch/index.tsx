import React, { useEffect, useRef, useState } from "react";
import { Button, message, Input, Card, DatePicker, Table, Tag } from "antd";
import type { InputRef, TablePaginationConfig } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { getPalletsByBatch } from "@/api/modules/common";
import { PalletByBatch } from "@/api/interface/common";
import OutBoundCnnfirmModal from "./outBoundConfirmModal";
import moment from "moment";
import "./index.less";

const { RangePicker } = DatePicker;
const { Column } = Table;

const PalletRecordByBatch: React.FC = () => {
	const companyNameRef = useRef<InputRef>(null);
	const dateRangeRef = useRef<RangePickerProps["value"]>(null);

	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [selectedRow, setSelectedRow] = useState<PalletByBatch[]>([]);

	const [palletBatchInfo, setPalletBatchInfo] = useState<PalletByBatch[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [total, setTotal] = useState(0);
	const [maxQuantity, setMaxQuantity] = useState<number>(0);

	let ModalRef: any = useRef();

	useEffect(() => {
		fetchData();
	}, []);

	const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: PalletByBatch[]) => {
		const stringRowKeys = newSelectedRowKeys.map(key => key.toString());
		setSelectedRowKeys(stringRowKeys);
		setMaxQuantity(selectedRows[0].inStock);
		setSelectedRow(selectedRows);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange
	};

	const fetchData = async () => {
		try {
			const result = await getPalletsByBatch(currentPage, pageSize);
			setPalletBatchInfo(result.data?.datalist || []);
			setTotal(result.data?.total || 0);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearch = async () => {
		const companyName = companyNameRef.current?.input?.value || undefined;
		const dateRange = dateRangeRef.current;

		const dateFrom = dateRange?.[0]?.valueOf() || undefined;
		const dateTo = dateRange?.[1]?.valueOf() || undefined;

		try {
			const result = await getPalletsByBatch(currentPage, pageSize, companyName, dateFrom, dateTo);
			setPalletBatchInfo(result.data?.datalist || []);
			setTotal(result.data?.total || 0);
		} catch (error) {
			message.error("获取内容失败");
		}
	};
	const hasSelected = selectedRowKeys.length > 0;

	const handleTimeChange: RangePickerProps["onChange"] = dates => {
		dateRangeRef.current = dates;
	};

	const handleTableChange = async (pagination: TablePaginationConfig) => {
		setCurrentPage(pagination.current || 1);
		setPageSize(pagination.pageSize || 10);
		const result = await getPalletsByBatch(pagination.current || 1, pagination.pageSize || 10);
		setPalletBatchInfo(result.data?.datalist || []);
	};

	const confirmOutBound = () => {
		if (selectedRow[0].inStock == 0) {
			message.error("当前批次无可出库的板");
			return;
		}

		if (selectedRowKeys.length > 1) {
			message.error("一次只能选中一批");
			return;
		} else {
			ModalRef.current.showModal();
		}
	};

	// useEffect(() => {
	// 	if (ModalRef.current && selectedRowKeys) {

	// 	}
	// }, [selectedRowKeys]);

	const onUpdateSuccessHandler = async () => {
		await fetchData(); // 调用异步函数
		setSelectedRowKeys([]);
	};

	return (
		<div className="pallet-record-by-batch">
			<div className="search-container">
				<div className="search-bar">
					<div className="search-bar-left">
						<div className="input-container">
							<span>公司名称:</span>
							<Input ref={companyNameRef} placeholder="请输入公司名称" />
						</div>
						<div className="input-container-product">
							<span>入库时间:</span>
							<RangePicker onChange={handleTimeChange} />
						</div>
					</div>
					<Button type="primary" onClick={handleSearch} style={{ float: "right" }}>
						搜索
					</Button>
				</div>
			</div>

			<Card title="整批库存管理">
				<div className="button-container">
					<Button type="primary" onClick={confirmOutBound} disabled={!hasSelected} style={{ marginRight: "30px" }}>
						出库
					</Button>
					{/* <Button type="primary" onClick={confirmCancleOutBound} disabled={!hasSelected}>
						撤销出库
					</Button> */}
				</div>
				<Table
					dataSource={palletBatchInfo}
					rowKey="inBoundRecordId"
					pagination={{
						current: currentPage,
						pageSize: pageSize,
						total: total,
						showSizeChanger: true,
						pageSizeOptions: ["10", "20", "50", "100"]
					}}
					onChange={handleTableChange}
					rowSelection={rowSelection}
				>
					<Column title="货物名" dataIndex="productName" key="name" />
					<Column title="公司名" dataIndex="companyName" key="companyName" />
					<Column
						title="入库时间"
						dataIndex="happenTime"
						key="happenTime"
						render={(dayIn: string) => moment(parseInt(dayIn)).format("YYYY-MM-DD")}
					/>
					<Column title="箱数 / 板" dataIndex="caseAmount" key="caseAmount" />
					<Column title="备注" dataIndex="comment" key="comment" />
					<Column title="订单号" dataIndex="orderNumber" key="orderNumber" />
					<Column
						title="库存中 / 总数 (板)"
						dataIndex="stockStatic"
						key="stockStatic"
						render={(text: string, record: any) => (
							<Tag color={record.inStock === 0 ? "red" : "green"}>
								{record.inStock} &nbsp;/&nbsp; {record.total}
							</Tag>
						)}
					/>
				</Table>
			</Card>
			<OutBoundCnnfirmModal
				boundRecordId={selectedRowKeys[0]}
				onRef={ModalRef}
				maxQuantity={maxQuantity}
				onUpdateSuccess={onUpdateSuccessHandler}
			></OutBoundCnnfirmModal>
		</div>
	);
};

export default PalletRecordByBatch;
