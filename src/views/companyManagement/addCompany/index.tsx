import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { addCompanyInfo } from "@/api/modules/common";
import { message } from "antd";

type FieldType = {
	companyName?: string;
	contactNumber?: string;
};

const addCompany: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);

	const onFinish: FormProps<FieldType>["onFinish"] = async values => {
		try {
			setLoading(true);
			await addCompanyInfo({ name: values.companyName || "", contactNumber: values.contactNumber || "" });
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

				<Form.Item<FieldType> label="联系方式" name="contactNumber" rules={[{ required: true, message: "请输入联系方式!" }]}>
					<Input />
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit" loading={loading}>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default addCompany;
