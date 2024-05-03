import React from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";

type FieldType = {
	username?: string;
	password?: string;
	remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = values => {
	console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = errorInfo => {
	console.log("Failed:", errorInfo);
};

const addCompany: React.FC = () => (
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
		<Form.Item<FieldType>
			label="Company Name"
			name="companyName"
			rules={[{ required: true, message: "Please input your companyName!" }]}
		>
			<Input />
		</Form.Item>

		<Form.Item<FieldType>
			label="Contact Number"
			name="contactNumber"
			rules={[{ required: true, message: "Please input your contactNumber!" }]}
		>
			<Input />
		</Form.Item>

		<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
			<Button type="primary" htmlType="submit">
				Submit
			</Button>
		</Form.Item>
	</Form>
);

export default addCompany;
