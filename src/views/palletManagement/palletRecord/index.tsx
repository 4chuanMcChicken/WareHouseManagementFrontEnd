import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Tag, message, Input } from "antd";
import type { TableColumnsType } from "antd";
import type { InputRef } from "antd";
import { Pallet } from "@/api/interface/common";
import { getPallets, addOutBoundRecord, getAllCompanyInfo } from "@/api/modules/common";
import { CompanyInfo } from "@/api/interface/common";
import moment from "moment";
import ConfrimModal from "@/components/ConfirmModal";

interface DataType extends Pallet {
	key: React.Key;
}

interface ModalInfo {
	title: string;
	successMessage: string;
	onConfirm: () => Promise<void>;
}
const columns: TableColumnsType<DataType> = [
	{
		title: "产品名称",
		dataIndex: "productName",
		key: "productName"
	},
	{
		title: "公司名称",
		dataIndex: "companyName",
		key: "companyName"
	},
	{
		title: "仓库名称",
		dataIndex: "wareHouseName",
		key: "wareHouseName"
	},
	{
		title: "备注",
		dataIndex: "comment",
		key: "comment"
	},
	{
		title: "订单号",
		dataIndex: "orderNumber",
		key: "orderNumber"
	},
	// {
	// 	title: "入库 ID",
	// 	dataIndex: "inBoundRecordId",
	// 	key: "inBoundRecordId"
	// },
	// {
	// 	title: "出库 ID",
	// 	dataIndex: "outBoundRecordId",
	// 	key: "outBoundRecordId"
	// },
	{
		title: "入库时间",
		dataIndex: "dayIn",
		key: "dayIn",
		sorter: {
			compare: (a, b) => a.dayIn - b.dayIn
		},
		render: (dayIn: string) => moment(parseInt(dayIn)).format("YYYY-MM-DD HH:mm:ss")
	},
	{
		title: "出库时间",
		dataIndex: "dayOut",
		key: "dayOut",
		render: (dayOut: string) => {
			if (dayOut) {
				return moment(parseInt(dayOut)).format("YYYY-MM-DD HH:mm:ss");
			} else {
				return null;
			}
		}
	},
	{
		title: "库存状态",
		dataIndex: "status",
		key: "status",
		render: (status: string) => {
			let color = status === "inStock" ? "red" : "green";
			let text = status === "inStock" ? "未出库" : "已出库";
			return <Tag color={color}>{text}</Tag>;
		}
	},
	{
		title: "是否结算",
		dataIndex: "ifCheckout",
		key: "ifCheckout",
		render: (ifCheckout: boolean) => {
			let color = ifCheckout ? "green" : "red";
			let text = ifCheckout ? "已结算" : "未结算";
			return (
				<Tag color={color} key={ifCheckout ? "checked" : "unchecked"}>
					{text}
				</Tag>
			);
		}
	}
];

const App: React.FC = () => {
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [selectedRows, setSelectedRows] = useState<Pallet[]>([]);
	const [pallets, setPallets] = useState<DataType[] | undefined>();
	const [modalInfo, setModalInfo] = useState<ModalInfo>({
		title: "",
		successMessage: "",
		onConfirm: () => Promise.resolve() // Return a resolved Promise
	});
	let ModalRef: any = useRef();
	const companyNameRef = useRef<InputRef>(null);
	const productNameRef = useRef<InputRef>(null);
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const resultComp = await getAllCompanyInfo();
			setCompanyInfo(resultComp.data!.companyInfos);
			const result = await getPallets();
			const dataWithKeys =
				result.data?.pallets.map((pallet: Pallet, index: number) => ({
					...pallet,
					key: pallet._id ?? index // Assuming `id` exists in Pallet, otherwise use index as fallback
				})) || [];
			setPallets(dataWithKeys);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: Pallet[]) => {
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
			if (selectedRows[i].status === "outStock") {
				message.error("当前选中中有已出库项");
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

	const confirmCancleOutBound = () => {
		for (let i = 0; i < selectedRows.length; i++) {
			if (selectedRows[i].ifCheckout === true || selectedRows[i].status === "inStock") {
				message.error("当前选择不能取消出库");
				return; // 退出整个函数
			}
		}
		if (ModalRef.current) {
			setModalInfo({
				title: "确认取消出库? ",
				successMessage: "取消出库成功",
				onConfirm: handleConfirmed
			});
			ModalRef.current.showModal();
		}
	};

	const handleConfirmed = async () => {
		console.log(selectedRowKeys);
		await addOutBoundRecord(selectedRowKeys);
		await fetchData();
	};

	const handleSearch = async () => {
		try {
			console.log(companyInfo);
			const companyName = companyNameRef.current?.input?.value || undefined;
			const productName = productNameRef.current?.input?.value || undefined;
			const company = companyInfo.find(company => company.name === companyName);
			const companyId = company ? company._id : null;
			if (!companyId) {
				message.error("未找到匹配的公司名称");
				return;
			}
			console.log(productName);

			const result = await getPallets(productName, companyId);
			const dataWithKeys =
				result.data?.pallets.map((pallet: Pallet, index: number) => ({
					...pallet,
					key: pallet._id ?? index // Assuming `id` exists in Pallet, otherwise use index as fallback
				})) || [];
			setPallets(dataWithKeys);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
		// You can add your search logic here
	};

	const hasSelected = selectedRowKeys.length > 0;

	return (
		<div>
			<div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<div style={{ display: "flex", marginRight: "16px" }}>
					<Button type="primary" onClick={confirmOutBound} disabled={!hasSelected} style={{ marginRight: "10px" }}>
						出库
					</Button>
					<Button type="primary" onClick={confirmCancleOutBound} disabled={!hasSelected}>
						撤销出库
					</Button>
				</div>
				<div style={{ display: "flex", alignItems: "center" }}>
					<div style={{ marginRight: "16px" }}>
						<span>公司名称:</span>
						<Input ref={companyNameRef} placeholder="请输入公司名称" style={{ marginRight: "16px" }} />
					</div>
					<div style={{ marginRight: "24px" }}>
						<span>产品名称:</span>
						<Input ref={productNameRef} placeholder="请输入产品名称" style={{ marginRight: "16px" }} />
					</div>
					<Button type="primary" onClick={handleSearch}>
						搜索
					</Button>
				</div>
			</div>
			<Table rowSelection={rowSelection} columns={columns} dataSource={pallets} />
			<ConfrimModal
				onRef={ModalRef}
				title={modalInfo!.title}
				onConfirm={modalInfo!.onConfirm}
				successMessage={modalInfo!.successMessage}
			></ConfrimModal>
		</div>
	);
};

export default App;
