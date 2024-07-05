import React, { useEffect, useState, useRef } from "react";
import { Table, TablePaginationConfig, Input, Button, Card } from "antd";
import { getProductInfo } from "@/api/modules/common";
import { Product } from "@/api/interface/common";
import type { InputRef } from "antd";
import "./index.less";

const { Column } = Table;

const ProductInfo: React.FC = () => {
	const [productInfo, setProductInfo] = useState<Product[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [total, setTotal] = useState(0);

	const companyNameRef = useRef<InputRef>(null);

	const fetchData = async (page: number, limit: number) => {
		try {
			const result = await getProductInfo(page, limit);
			setProductInfo(result.data?.datalist || []);
			setTotal(result.data?.total || 0);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData(currentPage, pageSize);
	}, [currentPage, pageSize]);

	const handleTableChange = (pagination: TablePaginationConfig) => {
		setCurrentPage(pagination.current || 1);
		setPageSize(pagination.pageSize || 10);
	};

	const handleSearch = async () => {
		try {
			const companyName = companyNameRef.current?.input?.value || undefined;

			const result = await getProductInfo(currentPage, pageSize, companyName);
			setProductInfo(result.data?.datalist || []);
			setTotal(result.data?.total || 0);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
		// You can add your search logic here
	};

	return (
		<div>
			<div className="search-container">
				<div className="search-bar">
					<div className="search-bar-left">
						<div className="input-container">
							<span>货物名称:</span>
							<Input ref={companyNameRef} placeholder="请输入货物名称" />
						</div>
					</div>
					<Button type="primary" onClick={handleSearch} style={{ float: "right" }}>
						搜索
					</Button>
				</div>
			</div>

			<Card title="货物管理" style={{ marginBottom: "40px" }}>
				<Table
					dataSource={productInfo}
					rowKey="name"
					pagination={{
						current: currentPage,
						pageSize: pageSize,
						total: total,
						showSizeChanger: true,
						pageSizeOptions: ["10", "20", "50", "100"]
					}}
					onChange={handleTableChange}
				>
					<Column title="公司名" dataIndex="companyName" key="companyName" />
					<Column title="货物名" dataIndex="name" key="name" />
					<Column title="描述" dataIndex="description" key="description" />
				</Table>
			</Card>
		</div>
	);
};

export default ProductInfo;
