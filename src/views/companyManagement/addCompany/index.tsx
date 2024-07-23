import React, { useState } from "react";
import type { FormProps } from "antd";
import { InputNumber, Card } from "antd";
import { Button, Form, Input } from "antd";
import { addCompanyInfo } from "@/api/modules/common";
import { message } from "antd";

type FieldType = {
	companyName: string;
	contactNumber: string;
	price: number;
	discountPercentage: number;
};

const addCompany: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);

	const onFinish: FormProps<FieldType>["onFinish"] = async values => {
		try {
			setLoading(true);
			await addCompanyInfo({
				name: values.companyName,
				contactNumber: values.contactNumber,
				price: values.price,
				discountPercentage: values.discountPercentage
			});
			message.success("添加成功！！");
		} finally {
			setLoading(false);
		}
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = errorInfo => {
		console.log("Failed:", errorInfo);
	};
	return (
		<>
			<Card title="新增公司">
				<Form
					name="basic"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					style={{ maxWidth: 600 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item<FieldType> label="公司名称" name="companyName" rules={[{ required: true, message: "请输入公司名称!" }]}>
						<Input />
					</Form.Item>

					<Form.Item<FieldType> label="联系方式" name="contactNumber">
						<Input />
					</Form.Item>

					<Form.Item<FieldType> label="单价 ($/day)" name="price" rules={[{ required: true, message: "请输入单价!" }]}>
						<InputNumber min={1} />
					</Form.Item>

					<Form.Item<FieldType> label="折扣比例 ( 0.8 = 80% )" name="discountPercentage">
						<InputNumber max={1} />
					</Form.Item>

					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit" loading={loading}>
							提交
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</>
	);
};

export default addCompany;
