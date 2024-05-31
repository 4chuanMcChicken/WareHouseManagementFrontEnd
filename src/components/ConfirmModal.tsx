import { Modal, message } from "antd";
import React, { useState, useImperativeHandle, useEffect } from "react";

interface ConfirmModalProps {
	onRef: any;
	title: string;
	onConfirm: () => Promise<void>;
	successMessage: string;
	modalText?: string;
}

const ConfirmModal = (props: ConfirmModalProps) => {
	const [title, setTitle] = useState("");
	const [modalText, setModalText] = useState<string | undefined>("");
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	const handleShowModal = () => {
		setOpen(true);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	useEffect(() => {
		setTitle(props.title);
		setModalText(props.modalText);
	}, [props]);

	const handleOk = async () => {
		try {
			setConfirmLoading(true);
			await props.onConfirm();
			message.success(props.successMessage);
		} catch (err) {
			console.log(err);
		} finally {
			setOpen(false);
			setConfirmLoading(false);
		}
	};

	useImperativeHandle(props.onRef, () => {
		// 需要将暴露的接口返回出去
		return {
			showModal: handleShowModal
		};
	});
	return (
		<>
			<Modal
				forceRender
				title={title}
				visible={open}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				destroyOnClose={true}
			>
				<p>{modalText}</p>
			</Modal>
		</>
	);
};

export default ConfirmModal;
