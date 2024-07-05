import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 出入库信息管理
const boundRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "出入库管理"
		},
		children: [
			{
				path: "/boundManagement/addInBound",
				element: lazyLoad(React.lazy(() => import("@/views/boundManagement/addInBound/index"))),
				meta: {
					requiresAuth: true,
					title: "添加入库",
					key: "addInBound"
				}
			},
			{
				path: "/boundManagement/smartOutBound",
				element: lazyLoad(React.lazy(() => import("@/views/boundManagement/smartOutBound/index"))),
				meta: {
					requiresAuth: true,
					title: "智能出库",
					key: "smartOutBound"
				}
			},
			{
				path: "/boundManagement/boundRecord",
				element: lazyLoad(React.lazy(() => import("@/views/boundManagement/boundRecord/index"))),
				meta: {
					requiresAuth: true,
					title: "出入库记录",
					key: "boundRecord"
				}
			}
		]
	}
];

export default boundRouter;
