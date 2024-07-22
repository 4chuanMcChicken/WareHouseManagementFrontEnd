import React, { useEffect, useState, useRef } from "react";
import { Card } from "antd";
import * as echarts from "echarts";
import { allPalletQuantityStat } from "@/api/modules/common";
import "./index.less";

const AllPalletQuantityChart = () => {
	const [option, setOption] = useState({});
	const echartRef = useRef(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await allPalletQuantityStat();
				const data = response.data || [];
				const totalPallets = data.reduce((acc, item) => acc + item.totalPallets, 0);

				const companyNames = data.map(item => item.companyName);
				const palletCounts = data.map(item => item.totalPallets);
				const colors = ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"]; // 自定义颜色

				const newOption = {
					title: {
						text: `当前库存总量: ${totalPallets} (板) `,
						left: "center"
					},
					tooltip: {
						trigger: "axis"
					},
					xAxis: {
						type: "category",
						data: companyNames
					},
					yAxis: {
						type: "value"
					},
					series: [
						{
							data: palletCounts,
							type: "bar",
							itemStyle: {
								color: params => colors[params.dataIndex % colors.length]
							},
							label: {
								show: true,
								position: "top"
							}
						}
					]
				};

				setOption(newOption);
			} catch (error) {
				console.error("Error fetching data: ", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (echartRef.current) {
			const chart = echarts.init(echartRef.current);
			chart.setOption(option);
			return () => {
				chart.dispose();
			};
		}
	}, [option]);

	return (
		<Card title="当前库存统计">
			<div ref={echartRef} className="echart-container" style={{ width: "100%", height: "400px" }}></div>
		</Card>
	);
};

export default AllPalletQuantityChart;
