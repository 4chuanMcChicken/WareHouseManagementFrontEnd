import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 账单管理
const boundRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "账单管理"
		},
		children: [
			{
				path: "/billManagement/monthlyBill",
				element: lazyLoad(React.lazy(() => import("@/views/billManagement/monthlyBill/index"))),
				meta: {
					requiresAuth: true,
					title: "月度账单",
					key: "monthlyBill"
				}
			}
		]
	}
];

export default boundRouter;
