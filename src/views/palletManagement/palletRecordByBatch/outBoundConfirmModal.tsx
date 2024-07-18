import React, { useState, useImperativeHandle } from "react";
import { Modal, Form, Input, InputNumber, message, DatePicker } from "antd";
import { addOutBoundByBoundRecordId } from "@/api/modules/common";
import moment from "moment";

interface IMyProps {
	onRef: any;
	boundRecordId: string;
	maxQuantity: number;
	onUpdateSuccess: () => void;
}

const ComfirmOutBoundModal: React.FC<IMyProps> = (props: IMyProps) => {
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();

	useImperativeHandle(props.onRef, () => {
		// 需要将暴露的接口返回出去
		return {
			showModal: handleShowModal
		};
	});

	const handleShowModal = () => {
		setOpen(true);
	};

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			setConfirmLoading(true);
			const happenTime = moment(values.happenTime).startOf("day").add(12, "hours").valueOf();
			if (values.quantity > props.maxQuantity) {
				message.error("出库数量不可大于库存量");
				return;
			}
			await addOutBoundByBoundRecordId(props.boundRecordId, values.quantity, happenTime);
			message.success("出库成功");
			props.onUpdateSuccess();
		} catch (err) {
			console.log(err);
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
					<Form.Item label="出库板数" name="quantity" rules={[{ required: true, message: "请输入板数!" }]}>
						<InputNumber min={1} />
					</Form.Item>

					<Form.Item label="单位" name="unit">
						<Input disabled placeholder="板" />
					</Form.Item>
					<Form.Item label="出库时间" name="happenTime" rules={[{ required: true, message: "请选择入库时间" }]}>
						<DatePicker />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default ComfirmOutBoundModal;
