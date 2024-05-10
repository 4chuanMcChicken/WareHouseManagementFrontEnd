import React, { useEffect, useState, useRef } from "react";
import { Space, Table } from "antd";
import { getAllCompanyInfo } from "@/api/modules/common";
import { CompanyInfo } from "@/api/interface/common";
import ChildTest from "@/views/companyManagement/companyInfo/childTest";
import { Button } from "antd";
const { Column } = Table;

const companyInfo: React.FC = () => {
	const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);

	let ChildRef: any = useRef();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getAllCompanyInfo();
				setCompanyInfo(result.data?.companyInfos || []);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData(); // 调用异步函数
	}, []);

	const resClick = () => {
		console.log("click!");
	};

	const clickHandle = () => {
		ChildRef.current.func();
		ChildRef.current.setName("New Name");
	};

	return (
		<div>
			<Table dataSource={companyInfo} rowKey="contactNumber">
				<Column title="公司名" dataIndex="name" key="companyName" />
				<Column title="联系方式" dataIndex="contactNumber" key="contactNumber" />
				<Column
					title="Action"
					key="action"
					render={() => (
						<Space size="middle">
							<a>Delete</a>
						</Space>
					)}
				/>
			</Table>
			<Button onClick={clickHandle} style={{ margin: "20px" }}>
				外面的
			</Button>

			<ChildTest onRef={ChildRef} showName={"Joey"} callBackClick={resClick}></ChildTest>
		</div>
	);
};

export default companyInfo;
