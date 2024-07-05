import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Space, Card } from "antd";
import { getAllCompanyInfo, addProduct } from "@/api/modules/common";
import { CompanyInfo } from "@/api/interface/common";

const AddProduct: React.FC = () => {
	const { Option } = Select;

	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 }
	};

	const tailLayout = {
		wrapperCol: { offset: 8, span: 16 }
	};

	const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getAllCompanyInfo();
				setCompanyInfo(result.data?.companyInfos || []);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		const selectedCompany = companyInfo.find(company => company.name === values.companyName);
		if (selectedCompany?._id) {
			await addProduct(values.name, selectedCompany._id, values.description);
		}
		form.resetFields();
	};

	return (
		<Card title="新增货物">
			<Form {...layout} form={form} name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600 }}>
				<Form.Item name="companyName" label="公司名称" rules={[{ required: true }]}>
					<Select placeholder="选择公司" allowClear>
						{companyInfo.map(company => (
							<Option key={company._id} value={company.name}>
								{company.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name="name" label="货物名称" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name="description" label="货物描述">
					<Input />
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Space>
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default AddProduct;
