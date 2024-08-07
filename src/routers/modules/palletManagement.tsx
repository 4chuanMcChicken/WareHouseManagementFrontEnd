import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 库存记录信息管理
const palletRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "库存记录"
		},
		children: [
			{
				path: "/palletManagement/palletRecordByBatch",
				element: lazyLoad(React.lazy(() => import("@/views/palletManagement/palletRecordByBatch/index"))),
				meta: {
					requiresAuth: true,
					title: "整批库存记录",
					key: "palletRecordByBatch"
				}
			},
			{
				path: "/palletManagement/palletRecord",
				element: lazyLoad(React.lazy(() => import("@/views/palletManagement/palletRecord/index"))),
				meta: {
					requiresAuth: true,
					title: "单板库存记录",
					key: "palletRecord"
				}
			}
		]
	}
];

export default palletRouter;
