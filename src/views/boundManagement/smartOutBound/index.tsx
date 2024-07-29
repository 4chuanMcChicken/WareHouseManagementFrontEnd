import React, { useEffect, useState, useRef } from "react";
import { Button, DatePicker, Form, InputNumber, Select, Card, Input } from "antd";
import type { FormProps } from "antd";
import { CompanyInfo, Product, OutBoundProductDetail, WareHouseInfo } from "@/api/interface/common";
import "./index.less";
import moment from "moment";
import { getAllCompanyInfo, getProductInfo, smartOutBound, getPalletInfoByProduct } from "@/api/modules/common";
// import { message } from "antd";
import ConfirmModal from "@/components/ConfirmModal";

type FieldType = {
	productId: { label: any; key: any; value: any };
	quantity: number;
	companyId: string;
	wareHouseId: { label: any; key: any; value: any };
	outBoundType: { label: any; key: any; value: any };
	happenTime: number;
	targetPalletCaseQuantity: number;
	comment: string;
};

const SmartOutBound: React.FC = () => {
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);
	const [wareHouseInfo, setWareHouseInfo] = useState<WareHouseInfo[] | undefined>([]);
	const [wareHouseCaseInfo, setWareHouseCaseInfo] = useState<OutBoundProductDetail[]>([]);
	const [productInfo, setProductInfo] = useState<Product[]>([]);
	const [targetPalletCaseQuantity, setTargetPalletCaseQuantity] = useState<number[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [targetCaseDisabled, setTargetCaseDisabled] = useState<boolean>(false);
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
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const handleCompanyChange = async (value: string, option: any) => {
		try {
			const productRes = await getProductInfo(1, 9999, option.key);
			setProductInfo(productRes.data!.datalist);
		} catch (error) {
			console.error("Error fetching product info:", error);
		}
	};

	const handleProductChange = async (option: any) => {
		try {
			const productInfoRet = (await getPalletInfoByProduct(option.key)).data || [];
			setWareHouseCaseInfo(productInfoRet);
			const allwareHouse = productInfoRet.map(item => item.wareHouseId).filter(wareHouseId => wareHouseId !== undefined);
			setWareHouseInfo(allwareHouse);
		} catch (error) {
			console.error("Error fetching product info:", error);
		} finally {
			form.resetFields(["wareHouseId"]);
			form.resetFields(["targetPalletCaseQuantity"]);
		}
	};

	const handleWareHouseChange = (option: any) => {
		try {
			const selectedWareHouse = wareHouseCaseInfo.find(info => info.wareHouseId?._id === option.key);

			if (selectedWareHouse) {
				const sortedCaseAmounts = selectedWareHouse.caseAmounts ? [...selectedWareHouse.caseAmounts] : [];
				sortedCaseAmounts.sort((a, b) => (a === null ? -1 : b === null ? 1 : 0));
				setTargetPalletCaseQuantity(sortedCaseAmounts);
			} else {
				setTargetPalletCaseQuantity([]);
			}
		} catch (error) {
			console.error("Error fetching product info:", error);
		} finally {
			form.resetFields(["targetPalletCaseQuantity"]);
		}
	};

	const handleOutBoundTypeChange = (option: any) => {
		if (option.value === "case") {
			setTargetCaseDisabled(true);
		} else if (option.value === "pallet") {
			setTargetCaseDisabled(false);
		}
		form.resetFields(["targetPalletCaseQuantity"]);
	};
	const getOutBoundText = (value: any) => {
		const readableTime = moment(value.happenTime)
			.set({ hour: 12, minute: 0, second: 0, millisecond: 0 })
			.format("YYYY年MM月DD日 HH:mm:ss");

		let text = `
		货物名称: ${value.productId.label}

		仓库名称:  ${value.wareHouseId.label}

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
			const targetPalletCaseQuantity = values.targetPalletCaseQuantity;
			const wareHouseId = values.wareHouseId.key;
			const comment = values.comment;

			const modalText = getOutBoundText(values);
			if (ModalRef.current) {
				setModalInfo({
					title: "确认出库? ",
					text: modalText,
					successMessage: "出库成功",
					onConfirm: () =>
						confirmOutBound({ quantity, productId, happenTime, outBoundType, targetPalletCaseQuantity, wareHouseId, comment })
				});
				ModalRef.current.showModal();
			}
			setLoading(true);

			// message.success("出库成功！");
		} finally {
			setTargetCaseDisabled(false);
			setLoading(false);
			form.resetFields();
		}
	};

	const confirmOutBound = async (outBoundDetail: any) => {
		const { quantity, productId, happenTime, outBoundType, targetPalletCaseQuantity, wareHouseId, comment } = outBoundDetail;
		await smartOutBound(productId, quantity, outBoundType, happenTime, targetPalletCaseQuantity, wareHouseId, comment);
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
						<Select onChange={handleProductChange} labelInValue>
							{productInfo.map(product => (
								<Select.Option key={product._id} value={product._id}>
									{product.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="仓库" name="wareHouseId" rules={[{ required: true, message: "请选择仓库" }]}>
						<Select onChange={handleWareHouseChange} labelInValue>
							{wareHouseInfo!.map(wareHouse => (
								<Select.Option key={wareHouse._id} value={wareHouse.name}>
									{wareHouse.name}
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
						<Select labelInValue onChange={handleOutBoundTypeChange}>
							<Select.Option key="pallet" value="pallet">
								板
							</Select.Option>
							<Select.Option key="case" value="case">
								箱
							</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="目标版总箱数"
						name="targetPalletCaseQuantity"
						rules={[{ required: !targetCaseDisabled, message: "请选择目标板总箱数" }]}
					>
						<Select style={{ width: "100px" }} disabled={targetCaseDisabled}>
							{targetPalletCaseQuantity.map((amount, index) => (
								<Select.Option key={index} value={amount !== null ? amount : -1}>
									{amount !== null ? amount.toString() : "默认"}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item<FieldType> label="数量" name="quantity" rules={[{ required: true, message: "请输入入库板数" }]}>
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item label="出库时间" name="happenTime" rules={[{ required: true, message: "请选择出库时间" }]}>
						<DatePicker />
					</Form.Item>
					<Form.Item<FieldType> label="备注" name="comment">
						<Input />
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
