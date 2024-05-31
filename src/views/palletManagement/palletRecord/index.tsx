import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Tag, message } from "antd";
import type { TableColumnsType } from "antd";
import { Pallet } from "@/api/interface/common";
import { getPallets, addOutBoundRecord } from "@/api/modules/common";
import moment from "moment";
import ConfrimModal from "@/components/ConfirmModal";

interface DataType extends Pallet {
	key: React.Key;
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
	{
		title: "入库 ID",
		dataIndex: "inBoundRecordId",
		key: "inBoundRecordId"
	},
	{
		title: "出库 ID",
		dataIndex: "outBoundRecordId",
		key: "outBoundRecordId"
	},
	{
		title: "入库时间",
		dataIndex: "dayIn",
		key: "dayIn",
		render: (dayIn: string) => moment(parseInt(dayIn)).format("YYYY-MM-DD HH:mm:ss")
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
	let ModalRef: any = useRef();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const result = await getPallets();
			console.log(result);
			const dataWithKeys =
				result.data?.pallets.map((pallet: Pallet, index: number) => ({
					...pallet,
					key: pallet._id ?? index // Assuming `id` exists in Pallet, otherwise use index as fallback
				})) || [];
			setPallets(dataWithKeys);
			console.log(pallets);
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

	const comfirmOutBound = () => {
		for (let i = 0; i < selectedRows.length; i++) {
			if (selectedRows[i].status === "outStock") {
				message.error("当前选中中有已出库项");
				return; // 退出整个函数
			}
		}
		if (ModalRef.current) {
			ModalRef.current.showModal();
		}
	};

	const handleConfirmed = async () => {
		console.log(selectedRowKeys);
		await addOutBoundRecord(selectedRowKeys);
		await fetchData();
	};

	const hasSelected = selectedRowKeys.length > 0;

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Button type="primary" onClick={comfirmOutBound} disabled={!hasSelected}>
					出库
				</Button>
				<span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}</span>
			</div>
			<Table rowSelection={rowSelection} columns={columns} dataSource={pallets} />
			<ConfrimModal onRef={ModalRef} title="确认出库？" onConfirm={handleConfirmed} successMessage="出库成功"></ConfrimModal>
		</div>
	);
};

export default App;
