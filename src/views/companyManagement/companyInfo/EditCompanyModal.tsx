import React, { useState, useImperativeHandle, useEffect } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import { CompanyInfo } from "@/api/interface/common";
import { addCompanyInfo } from "@/api/modules/common";

interface IMyProps {
	onRef: any;
	selectedInfo?: CompanyInfo;
	onUpdateSuccess: () => {};
}

const EditCompany: React.FC<IMyProps> = (props: IMyProps) => {
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();

	type FieldType = {
		companyName: string;
		contactNumber: string;
		price: number;
	};

	useImperativeHandle(props.onRef, () => {
		// 需要将暴露的接口返回出去
		return {
			showModal: handleShowModal
		};
	});

	const handleShowModal = () => {
		setOpen(true);
	};

	useEffect(() => {
		form.setFieldsValue({
			name: props.selectedInfo?.name,
			contactNumber: props.selectedInfo?.contactNumber,
			price: props.selectedInfo?.price
		});
	}, [props]);

	const handleOk = async () => {
		try {
			setConfirmLoading(true);

			form.validateFields().then(values => {
				addCompanyInfo({
					_id: props.selectedInfo!._id,
					name: values.name,
					contactNumber: values.contactNumber,
					price: values.price,
					discountPercentage: values.discountPercentage
				});
				message.success("修改成功！！");
				props.onUpdateSuccess();
			});
		} finally {
			setOpen(false);
			setConfirmLoading(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setOpen(false);
	};

	return (
		<>
			<Modal
				forceRender
				title="Title"
				visible={open}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				destroyOnClose={true}
			>
				<Form name="editCompanyForm" style={{ maxWidth: 600 }} autoComplete="off" layout="vertical" form={form} preserve={false}>
					<Form.Item<FieldType> label="公司名称" name="name" rules={[{ required: true, message: "请输入公司名称!" }]}>
						<Input />
					</Form.Item>

					<Form.Item<FieldType> label="联系方式" name="contactNumber" rules={[{ required: true, message: "请输入联系方式!" }]}>
						<Input />
					</Form.Item>

					<Form.Item<FieldType> label="单价 ($/day)" name="price" rules={[{ required: true, message: "请输入单价!" }]}>
						<InputNumber min={1} />
					</Form.Item>

					<Form.Item<FieldType> label="折扣比例 ( 0-1, 0.8 = 80% )" name="discountPercentage">
						<InputNumber max={1} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default EditCompany;
