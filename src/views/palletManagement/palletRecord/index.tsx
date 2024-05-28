import React, { useState, useEffect } from "react";
import { Button, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { Pallet } from "@/api/interface/common";
import { getPallets } from "@/api/modules/common";
import moment from "moment";

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
		dataIndex: "wareHouseId",
		key: "wareHouseId"
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
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [loading, setLoading] = useState(false);

	const [pallets, setPallets] = useState<DataType[] | undefined>();

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

	const start = () => {
		setLoading(true);
		// ajax request after empty completing
		setTimeout(() => {
			setSelectedRowKeys([]);
			setLoading(false);
		}, 1000);
	};

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange
	};
	const hasSelected = selectedRowKeys.length > 0;

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
					Reload
				</Button>
				<span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}</span>
			</div>
			<Table rowSelection={rowSelection} columns={columns} dataSource={pallets} />
		</div>
	);
};

export default App;
