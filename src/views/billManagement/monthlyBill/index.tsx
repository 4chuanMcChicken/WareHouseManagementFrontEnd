import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Tag, message, Input, DatePicker, Space, Descriptions, Card } from "antd";
import type { TableColumnsType } from "antd";
import type { InputRef } from "antd";
import { MonthlyBill, MonthlyBillDetail, DetailContent } from "@/api/interface/common";
import { getMonthlyBill, getMonthlyBillDetail, confirmMonthlyBillPaid } from "@/api/modules/common";
import moment from "moment";
import ConfirmModal from "@/components/ConfirmModal";
import useExportExcel from "@/hooks/useExportExcel"; // 导入自定义 hook
import "./index.less";

interface DataType extends MonthlyBill {
	key: React.Key;
}

interface DetailDataType extends DetailContent {
	key: React.Key;
}

interface ModalInfo {
	title: string;
	successMessage: string;
	onConfirm: () => Promise<void>;
}

const App: React.FC = () => {
	const detailColumns: TableColumnsType<DetailDataType> = [
		{
			title: "描述",
			dataIndex: "productName",
			key: "description",
			render: (productName, record) => {
				if (record.type === "case") {
					return `Case out service fee: ${productName}`;
				} else {
					return `Storage : ${productName}`;
				}
			}
		},
		{
			title: "时间 (周期)",
			dataIndex: "dayIn",
			render: (dayIn, record) => {
				if (record.type === "case") {
					return `on ${moment(record.happenTime).format("YYYY-MM-DD")}`;
				} else {
					const nowDate = moment();
					const dayInDate = moment(dayIn);
					const currentDate = moment(nowDate).subtract(1, "months").date(dayInDate.date());
					const nextMonthDate = moment(nowDate).date(dayInDate.date());
					return `${currentDate.format("YYYY-MM-DD")} to ${nextMonthDate.format("YYYY-MM-DD")}`;
				}
			}
		},
		{
			title: "数量",
			dataIndex: "quantity"
		},
		{
			title: "单价 ($)",
			dataIndex: "price"
		},
		{
			title: "账单类型",
			dataIndex: "type",
			render: type => {
				if (type === "case") {
					return "箱";
				} else {
					return "板";
				}
			}
		},
		{
			title: "总金额 ($)",
			dataIndex: "amount"
		}
	];

	const columns: TableColumnsType<DataType> = [
		{
			title: "公司名称",
			dataIndex: "companyName",
			key: "companyName"
		},
		{
			title: "金额",
			dataIndex: "amount",
			key: "amount"
		},
		{
			title: "生成时间",
			dataIndex: "createTime",
			key: "createTime",
			render: (createTime: string) => moment(parseInt(createTime)).format("YYYY-MM-DD HH:mm:ss")
		},
		{
			title: "账单周期",
			dataIndex: "billedMonth",
			key: "billedMonth"
		},
		{
			title: "收费单价（ /月 ）",
			dataIndex: "unitPrice",
			key: "unitPrice"
		},
		{
			title: "是否支付",
			dataIndex: "ifPaid",
			key: "ifPaid",
			render: (ifPaid: boolean) => {
				let color = ifPaid === false ? "red" : "green";
				let text = ifPaid === false ? "未支付" : "已支付";
				return <Tag color={color}>{text}</Tag>;
			}
		},
		{
			title: "操作",
			key: "action",
			render: (_: any, record: DataType) => (
				<Space size="middle">
					<a onClick={() => checkDetail(record)}>查看详情</a>
				</Space>
			)
		}
	];

	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [selectedRows, setSelectedRows] = useState<MonthlyBill[]>([]);
	const [modalInfo, setModalInfo] = useState<ModalInfo>({
		title: "",
		successMessage: "",
		onConfirm: () => Promise.resolve() // Return a resolved Promise
	});
	let ModalRef: any = useRef();
	const companyNameRef = useRef<InputRef>(null);

	const [monthlyBills, setMonthlyBills] = useState<DataType[] | undefined>([]);
	const [monthlyBillDetail, setMonthlyBillDetail] = useState<MonthlyBillDetail | undefined>(undefined);
	const [detailContent, setDetailContent] = useState<DetailDataType[] | undefined>([]);
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const { tableRef, exportToExcel } = useExportExcel("MonthlyBillDetails");
	const [selectedTimestamp, setSelectedTimestamp] = useState<number | undefined>();

	useEffect(() => {
		fetchData();
	}, []);

	const handleTimeChange = (date: moment.Moment | null) => {
		if (date) {
			const timestamp = date.valueOf();
			setSelectedTimestamp(timestamp);
		} else {
			setSelectedTimestamp(undefined);
		}
	};

	const checkDetail = async (record: DataType) => {
		try {
			const billId = record._id;
			const res = await getMonthlyBillDetail(billId);
			setMonthlyBillDetail(res.data);
			setShowDetail(true);
			const dataWithKeys =
				res.data?.details.map((detailContent: DetailContent, index: number) => ({
					...detailContent,
					key: index
				})) || [];
			setDetailContent(dataWithKeys);
		} catch (e) {
			console.log(e);
		}
	};
	const fetchData = async () => {
		try {
			const resultBills = await getMonthlyBill();
			const dataWithKeys =
				resultBills.data?.monthlyBills.map((monthlyBill: MonthlyBill, index: number) => ({
					...monthlyBill,
					key: monthlyBill._id ?? index
				})) || [];
			setMonthlyBills(dataWithKeys);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: MonthlyBill[]) => {
		const stringRowKeys = newSelectedRowKeys.map(key => key.toString());
		setSelectedRowKeys(stringRowKeys);
		setSelectedRows(selectedRows);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange
	};

	const handleReturn = () => {
		setShowDetail(false);
	};

	const confirmBillPaid = () => {
		for (let i = 0; i < selectedRows.length; i++) {
			if (selectedRows[i].ifPaid === true) {
				message.error("此账单已支付");
				return; // 退出整个函数
			}
		}
		if (ModalRef.current) {
			setModalInfo({
				title: "确认此账单已支付? ",
				successMessage: "确认成功",
				onConfirm: handleConfirmed
			});
			ModalRef.current.showModal();
		}
	};

	const handleConfirmed = async () => {
		await confirmMonthlyBillPaid(selectedRowKeys[0]);
		setSelectedRowKeys([]);
		await fetchData();
	};

	const handleSearch = async () => {
		try {
			const companyName = companyNameRef.current?.input?.value || undefined;
			const resultBills = await getMonthlyBill(companyName, selectedTimestamp);
			const dataWithKeys =
				resultBills.data?.monthlyBills.map((monthlyBill: MonthlyBill, index: number) => ({
					...monthlyBill,
					key: monthlyBill._id ?? index
				})) || [];
			setMonthlyBills(dataWithKeys);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
		// You can add your search logic here
	};

	const hasSelected = selectedRowKeys.length > 0;
	return (
		<>
			<div className="monthly-bill">
				{showDetail ? (
					<>
						<Card title="账单明细" style={{ marginBottom: "40px" }}>
							<Button type="primary" onClick={handleReturn} style={{ minHeight: "36px", textAlign: "center", float: "right" }}>
								返回
							</Button>
							<Button type="primary" onClick={exportToExcel} style={{ minHeight: "36px", textAlign: "center" }}>
								导出Excel
							</Button>
						</Card>
						<Card title="数据总览" style={{ marginBottom: "20px" }}>
							<Descriptions bordered>
								<Descriptions.Item label="公司名称">{monthlyBillDetail?.companyName || "N/A"}</Descriptions.Item>
								<Descriptions.Item label="账单时间">
									{monthlyBillDetail?.createTime
										? new Date(parseInt(monthlyBillDetail.createTime.toString())).toLocaleDateString("zh-CN", {
												year: "numeric",
												month: "2-digit",
												day: "2-digit"
										  })
										: "N/A"}
								</Descriptions.Item>
								<Descriptions.Item label="总金额($)">{monthlyBillDetail?.totalAmount || "N/A"}</Descriptions.Item>
								<Descriptions.Item label="板储存费($)">{monthlyBillDetail?.palletAmount || "N/A"}</Descriptions.Item>
								<Descriptions.Item label="出箱服务费($)">{monthlyBillDetail?.caseAmount || "N/A"}</Descriptions.Item>
								<Descriptions.Item>{""}</Descriptions.Item>
							</Descriptions>
						</Card>
						<Card title="具体细则">
							<div ref={tableRef}>
								<Table rowKey="_id" columns={detailColumns} dataSource={detailContent} pagination={false} />
							</div>
						</Card>
					</>
				) : (
					<div className="search-container">
						<div className="search-bar">
							<div className="search-bar-left">
								<div className="input-container">
									<span>公司名称:</span>
									<Input ref={companyNameRef} placeholder="请输入公司名称" />
								</div>
								<div className="input-container-product">
									<span>账单月份:</span>
									<DatePicker onChange={handleTimeChange} picker="month" />
								</div>
							</div>
							<Button type="primary" style={{ float: "right" }} onClick={handleSearch}>
								搜索
							</Button>
						</div>
						<Card title="月度账单">
							<div className="table-container">
								<div className="button-container">
									<Button type="primary" onClick={confirmBillPaid} disabled={!hasSelected} style={{ marginRight: "10px" }}>
										确认支付
									</Button>
								</div>

								<Table rowSelection={rowSelection} columns={columns} dataSource={monthlyBills} />

								<ConfirmModal
									onRef={ModalRef}
									title={modalInfo?.title}
									onConfirm={modalInfo?.onConfirm}
									successMessage={modalInfo?.successMessage}
								/>
							</div>
						</Card>
					</div>
				)}
			</div>
		</>
	);
};

export default App;
