import React, { useEffect, useState, useRef } from "react";
import { Button, DatePicker, Form, Input, InputNumber, Select, Card } from "antd";
import type { FormProps } from "antd";
import { CompanyInfo, InBoundRecord, WareHouseInfo, Product } from "@/api/interface/common";
import "./index.less";
import moment from "moment";
import { getAllCompanyInfo, addInBoundRecord, getAllWareHouseInfo, getProductInfo } from "@/api/modules/common";
// import { message } from "antd";
import ConfirmModal from "@/components/ConfirmModal";

type FieldType = {
	productName: { label: any; key: any; value: any };
	quantity: number;
	companyId: { label: any; key: any; value: any };
	wareHouseId: { label: any; key: any; value: any };
	caseAmount?: number;
	happenTime: number;
	comment?: string;
	orderNumber?: string;
};

interface ModalInfo {
	title: string;
	successMessage: string;
	text: string;
	onConfirm: () => Promise<void>;
}

const AddInBound: React.FC = () => {
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);
	const [wareHouseInfo, setWareHouseInfo] = useState<WareHouseInfo[]>([]);
	const [productInfo, setProductInfo] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [form] = Form.useForm();
	let ModalRef: any = useRef();

	const [modalInfo, setModalInfo] = useState<ModalInfo>({
		title: "",
		successMessage: "",
		text: "",
		onConfirm: async () => {
			return Promise.resolve();
		}
	});

	const companyFormRef = useRef<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getAllCompanyInfo();
				setCompanyInfo(result.data!.companyInfos);
				const wareHouseRes = await getAllWareHouseInfo();
				setWareHouseInfo(wareHouseRes.data!.wareHouseInfos);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const handleCompanyChange = async (value: string, option: any) => {
		try {
			const productRes = await getProductInfo(1, 9999, option.key);
			setProductInfo(productRes.data!.datalist); // 假设 datalist 是返回的产品数组
		} catch (error) {
			console.error("Error fetching product info:", error);
		}
	};

	const onFinish: FormProps<FieldType>["onFinish"] = async values => {
		try {
			// const companyId = companyFormRef.current.getFieldValue("companyId");
			// const wareHouseId = companyFormRef.current.getFieldValue("wareHouseId");
			const happenTime = moment(values.happenTime).startOf("day").add(12, "hours").valueOf();

			if (values.caseAmount === null) {
				values.caseAmount = undefined;
			}
			const inBoundRecord: InBoundRecord = {
				productId: values.productName.value,
				companyId: values.companyId.value,
				wareHouseId: values.wareHouseId.value,
				happenTime,
				quantity: values.quantity,
				caseAmount: values.caseAmount,
				comment: values.comment,
				orderNumber: values.orderNumber
			};

			const modalText = getInBoundText(values);

			if (ModalRef.current) {
				setModalInfo({
					title: "请确认入库信息 ",
					text: modalText,
					successMessage: "入库成功",
					onConfirm: () => confirmInBound(inBoundRecord)
				});
				ModalRef.current.showModal();
			}
			setLoading(true);
			// await addInBoundRecord(inBoundRecord);
		} finally {
			setLoading(false);
			form.resetFields();
		}
	};

	const confirmInBound = async (inBoundRecord: any) => {
		await addInBoundRecord(inBoundRecord);
	};

	const getInBoundText = (value: any) => {
		const readableTime = moment(value.happenTime)
			.set({ hour: 12, minute: 0, second: 0, millisecond: 0 })
			.format("YYYY年MM月DD日 HH:mm:ss");

		let text = `
		公司名称: ${value.companyId.label}

		货物名称: ${value.productName.label}

		仓库名称:  ${value.wareHouseId.label}

		板数: ${value.quantity}

		入库时间: ${readableTime}
		`;

		if (value.caseAmount) {
			text += `
		箱数: ${value.caseAmount}`;
		}
		return text;
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = errorInfo => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div>
			<Card title="入库">
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 14 }}
					layout="horizontal"
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					ref={companyFormRef}
				>
					<Form.Item label="公司" name="companyId" rules={[{ required: true, message: "请选择公司" }]}>
						<Select onChange={handleCompanyChange} labelInValue>
							{companyInfo.map(company => (
								<Select.Option key={company.name} value={company._id}>
									{company.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item<FieldType> label="货物名称" name="productName" rules={[{ required: true, message: "请选择货物名称" }]}>
						<Select labelInValue>
							{productInfo.map(product => (
								<Select.Option key={product._id} value={product._id}>
									{product.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item<FieldType> label="板数" name="quantity" rules={[{ required: true, message: "请输入入库板数" }]}>
						<InputNumber min={1} />
					</Form.Item>

					<Form.Item label="仓库" name="wareHouseId" rules={[{ required: true, message: "请选择仓库" }]}>
						<Select labelInValue>
							{wareHouseInfo.map(wareHouse => (
								<Select.Option key={wareHouse._id} value={wareHouse._id}>
									{wareHouse.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="入库时间" name="happenTime" rules={[{ required: true, message: "请选择入库时间" }]}>
						<DatePicker />
					</Form.Item>
					<Form.Item label="箱数(每板)" name="caseAmount">
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item<FieldType> label="备注" name="comment">
						<Input />
					</Form.Item>
					<Form.Item<FieldType> label="单号" name="orderNumber">
						<Input />
					</Form.Item>
					<Form.Item wrapperCol={{ offset: 3, span: 16 }}>
						<Button type="primary" htmlType="submit" loading={loading}>
							入库
						</Button>
					</Form.Item>
				</Form>
			</Card>
			<ConfirmModal
				onRef={ModalRef}
				title={modalInfo!.title}
				onConfirm={modalInfo!.onConfirm}
				successMessage={modalInfo!.successMessage}
				modalText={modalInfo!.text}
			></ConfirmModal>
		</div>
	);
};

export default AddInBound;
