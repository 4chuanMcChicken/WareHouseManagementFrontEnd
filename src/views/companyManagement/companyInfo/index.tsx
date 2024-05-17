import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Space, Table } from "antd";
import { getAllCompanyInfo } from "@/api/modules/common";
import { CompanyInfo } from "@/api/interface/common";
const { Column } = Table;
import EditCompany from "./EditCompanyModal";

const companyInfo: React.FC = () => {
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);

	const [selectedCompany, setSelectedCompany] = useState<CompanyInfo | undefined>();

	let ModalRef: any = useRef();

	const fetchData = async () => {
		try {
			const result = await getAllCompanyInfo();
			setCompanyInfo(result.data?.companyInfos || []);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData(); // 调用异步函数
	}, []);

	useEffect(() => {
		if (ModalRef.current && selectedCompany) {
			ModalRef.current.showModal();
		}
	}, [selectedCompany]);

	const handleEditClick = (record: CompanyInfo) => {
		setSelectedCompany(undefined); // 先清空选中的公司
		setTimeout(() => setSelectedCompany(record), 0); // 再设置为选中的公司
	};

	const onUpdateSuccessHandler = async () => {
		fetchData(); // 调用异步函数
	};

	return (
		<div>
			<Table dataSource={companyInfo} rowKey="name">
				<Column title="公司名" dataIndex="name" key="companyName" />
				<Column title="联系方式" dataIndex="contactNumber" key="contactNumber" />
				<Column title="单价 ($/day)" dataIndex="price" key="price" />
				<Column
					title="操作"
					key="action"
					render={(text, record: CompanyInfo) => (
						<Space size="middle">
							<a onClick={() => handleEditClick(record)}>编辑</a>
						</Space>
					)}
				/>
			</Table>
			<EditCompany onRef={ModalRef} selectedInfo={selectedCompany} onUpdateSuccess={onUpdateSuccessHandler}></EditCompany>
		</div>
	);
};

export default companyInfo;
