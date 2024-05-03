import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 超级表格模块
const proTableRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "公司管理"
		},
		children: [
			{
				path: "/companyManagement/companyInfo",
				element: lazyLoad(React.lazy(() => import("@/views/companyManagement/companyInfo/index"))),
				meta: {
					requiresAuth: true,
					title: "公司信息",
					key: "companyInfo"
				}
			},
			{
				path: "/companyManagement/addCompany",
				element: lazyLoad(React.lazy(() => import("@/views/companyManagement/addCompany/index"))),
				meta: {
					requiresAuth: true,
					title: "添加公司",
					key: "addCompany"
				}
			}
		]
	}
];

export default proTableRouter;
