import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// 公司信息模块
const productRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "货物管理"
		},
		children: [
			{
				path: "/productManagement/productInfo",
				element: lazyLoad(React.lazy(() => import("@/views/productManagement/productInfo/index"))),
				meta: {
					requiresAuth: true,
					title: "货物信息",
					key: "productInfo"
				}
			},
			{
				path: "/productManagement/addProduct",
				element: lazyLoad(React.lazy(() => import("@/views/productManagement/addProduct/index"))),
				meta: {
					requiresAuth: true,
					title: "添加货物",
					key: "addProduct"
				}
			}
		]
	}
];

export default productRouter;
