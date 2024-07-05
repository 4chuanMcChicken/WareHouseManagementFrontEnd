import React, { useEffect, useState, useRef } from "react";
import { Button, DatePicker, Form, InputNumber, Select, Card } from "antd";
import type { FormProps } from "antd";
import { CompanyInfo, WareHouseInfo, Product } from "@/api/interface/common";
import "./index.less";
import moment from "moment";
import { getAllCompanyInfo, getAllWareHouseInfo, getProductInfo, smartOutBound } from "@/api/modules/common";
// import { message } from "antd";
import ConfirmModal from "@/components/ConfirmModal";

type FieldType = {
	productId: { label: any; key: any; value: any };
	quantity: number;
	companyId: string;
	wareHouseId: string;
	outBoundType: { label: any; key: any; value: any };
	happenTime: number;
};

const SmartOutBound: React.FC = () => {
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);
	const [wareHouseInfo, setWareHouseInfo] = useState<WareHouseInfo[]>([]);
	const [productInfo, setProductInfo] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [form] = Form.useForm();
	let ModalRef: any = useRef();

	interface ModalInfo {
		title: string;
		successMessage: string;
		text: string;
		onConfirm: () => Promise<void>;
	}

	const companyFormRef = useRef<any>(null);

	const [modalInfo, setModalInfo] = useState<ModalInfo>({
		title: "",
		successMessage: "",
		text: "",
		onConfirm: async () => {
			return Promise.resolve();
		}
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getAllCompanyInfo();
				setCompanyInfo(result.data!.companyInfos);
				const wareHouseRes = await getAllWareHouseInfo();
				setWareHouseInfo(wareHouseRes.data!.wareHouseInfos);
				if (wareHouseRes.data!.wareHouseInfos.length > 0) {
					form.setFieldsValue({
						wareHouseId: wareHouseRes.data!.wareHouseInfos[0]._id
					});
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const handleCompanyChange = async (value: string, option: any) => {
		try {
			console.log(value);
			const productRes = await getProductInfo(1, 9999, option.key);
			setProductInfo(productRes.data!.datalist);
		} catch (error) {
			console.error("Error fetching product info:", error);
		}
	};

	const getOutBoundText = (value: any) => {
		const readableTime = moment(value.happenTime)
			.set({ hour: 12, minute: 0, second: 0, millisecond: 0 })
			.format("YYYY年MM月DD日 HH:mm:ss");

		let text = `
		货物名称: ${value.productId.label}

		单位: ${value.outBoundType.label}

		数量: ${value.quantity}

		出库时间: ${readableTime}
		`;
		return text;
	};

	const onFinish: FormProps<FieldType>["onFinish"] = async values => {
		try {
			const happenTime = moment(values.happenTime).set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).valueOf();
			const productId = values.productId.value;
			const quantity = values.quantity;
			const outBoundType = values.outBoundType.value;

			const modalText = getOutBoundText(values);
			if (ModalRef.current) {
				setModalInfo({
					title: "确认出库? ",
					text: modalText,
					successMessage: "出库成功",
					onConfirm: () => confirmOutBound({ quantity, productId, happenTime, outBoundType })
				});
				ModalRef.current.showModal();
			}
			setLoading(true);

			// message.success("出库成功！");
		} finally {
			setLoading(false);
			form.resetFields();
			if (wareHouseInfo.length > 0) {
				form.setFieldsValue({
					wareHouseId: wareHouseInfo[0]._id
				});
			}
		}
	};

	const confirmOutBound = async (outBoundDetail: any) => {
		const { quantity, productId, happenTime, outBoundType } = outBoundDetail;
		await smartOutBound(productId, quantity, outBoundType, happenTime);
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = errorInfo => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div>
			<Card title="智能出库">
				<Form
					form={form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 14 }}
					layout="horizontal"
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					ref={companyFormRef}
				>
					<Form.Item label="仓库" name="wareHouseId" rules={[{ required: true, message: "请选择仓库" }]}>
						<Select disabled>
							{wareHouseInfo.map(wareHouse => (
								<Select.Option key={wareHouse.name} value={wareHouse._id}>
									{wareHouse.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="公司" name="companyId" rules={[{ required: true, message: "请选择公司" }]}>
						<Select onChange={handleCompanyChange} labelInValue>
							{companyInfo.map(company => (
								<Select.Option key={company.name} value={company._id}>
									{company.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item<FieldType> label="货物名称" name="productId" rules={[{ required: true, message: "请选择货物名称" }]}>
						<Select labelInValue>
							{productInfo.map(product => (
								<Select.Option key={product._id} value={product._id}>
									{product.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item<FieldType>
						label="出库单位"
						name="outBoundType"
						rules={[{ required: true, message: "请选择出库单位" }]}
						initialValue={{ value: "pallet", label: "板" }}
					>
						<Select style={{ width: "100px" }} labelInValue>
							<Select.Option key="pallet" value="pallet">
								板
							</Select.Option>
							<Select.Option key="case" value="case">
								箱
							</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item<FieldType> label="数量" name="quantity" rules={[{ required: true, message: "请输入入库板数" }]}>
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item label="出库时间" name="happenTime" rules={[{ required: true, message: "请选择出库时间" }]}>
						<DatePicker />
					</Form.Item>
					<Form.Item wrapperCol={{ offset: 3, span: 16 }}>
						<Button type="primary" htmlType="submit" loading={loading}>
							出库
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

export default SmartOutBound;
