import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Tag, message, Input, DatePicker } from "antd";
import type { TableColumnsType } from "antd";
import type { InputRef } from "antd";
import { MonthlyBill } from "@/api/interface/common";
import { getMonthlyBill } from "@/api/modules/common";
import moment from "moment";
import ConfrimModal from "@/components/ConfirmModal";
import "./index.less";

interface DataType extends MonthlyBill {
	key: React.Key;
}

interface ModalInfo {
	title: string;
	successMessage: string;
	onConfirm: () => Promise<void>;
}
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
	}
];

const App: React.FC = () => {
	const { RangePicker } = DatePicker;

	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [selectedRows, setSelectedRows] = useState<MonthlyBill[]>([]);
	const [modalInfo, setModalInfo] = useState<ModalInfo>({
		title: "",
		successMessage: "",
		onConfirm: () => Promise.resolve() // Return a resolved Promise
	});
	let ModalRef: any = useRef();
	const companyNameRef = useRef<InputRef>(null);
	const timeRef = useRef<any>(null);
	const [monthlyBills, setMonthlyBills] = useState<DataType[] | undefined>([]);

	useEffect(() => {
		fetchData();
	}, []);

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

	const confirmOutBound = () => {
		for (let i = 0; i < selectedRows.length; i++) {
			if (selectedRows[i].ifPaid === true) {
				message.error("此账单已支付");
				return; // 退出整个函数
			}
		}
		if (ModalRef.current) {
			setModalInfo({
				title: "确认出库? ",
				successMessage: "出库成功",
				onConfirm: handleConfirmed
			});
			ModalRef.current.showModal();
		}
	};

	const handleConfirmed = async () => {
		console.log(selectedRowKeys);
		await fetchData();
	};

	// const handleSearch = async () => {
	// 	try {
	// 		const companyName = companyNameRef.current?.input?.value || undefined;
	// 		const productName = productNameRef.current?.input?.value || undefined;
	// 		const company = companyInfo.find(company => company.name === companyName);
	// 		const companyId = company ? company._id : null;
	// 		if (!companyId) {
	// 			message.error("未找到匹配的公司名称");
	// 			return;
	// 		}
	// 		console.log(productName);

	// 		const result = await getPallets(productName, companyId);
	// 		const dataWithKeys =
	// 			result.data?.pallets.map((pallet: Pallet, index: number) => ({
	// 				...pallet,
	// 				key: pallet._id ?? index // Assuming `id` exists in Pallet, otherwise use index as fallback
	// 			})) || [];
	// 		setPallets(dataWithKeys);
	// 	} catch (error) {
	// 		console.error("Error fetching data:", error);
	// 	}
	// 	// You can add your search logic here
	// };

	const hasSelected = selectedRowKeys.length > 0;

	return (
		<>
			<div className="search-container">
				<div className="search-bar">
					<div className="search-bar-left">
						<div className="input-container">
							<span>公司名称:</span>
							<Input ref={companyNameRef} placeholder="请输入公司名称" />
						</div>
						<div className="input-container-product">
							<RangePicker ref={timeRef} />
						</div>
					</div>
					<Button type="primary" style={{ float: "right" }}>
						搜索
					</Button>
				</div>
			</div>
			<div className="table-container">
				<div className="button-container">
					<Button type="primary" onClick={confirmOutBound} disabled={!hasSelected} style={{ marginRight: "10px" }}>
						确认支付
					</Button>
				</div>
				<Table rowSelection={rowSelection} columns={columns} dataSource={monthlyBills} />
				<ConfrimModal
					onRef={ModalRef}
					title={modalInfo!.title}
					onConfirm={modalInfo!.onConfirm}
					successMessage={modalInfo!.successMessage}
				></ConfrimModal>
			</div>
		</>
	);
};

export default App;
