import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Spin } from "antd";
import { findAllBreadcrumb, getOpenKeys, handleRouter, searchRoute } from "@/utils/util";
import { setMenuList } from "@/redux/modules/menu/action";
import { setBreadcrumbList } from "@/redux/modules/breadcrumb/action";
import { setAuthRouter } from "@/redux/modules/auth/action";
import { connect } from "react-redux";
import type { MenuProps } from "antd";
import * as Icons from "@ant-design/icons";
import Logo from "./components/Logo";
import "./index.less";

const menuArray = [
	{
		icon: "HomeOutlined",
		title: "首页",
		path: "/home/index"
	},
	{
		icon: "ShopOutlined",
		title: "公司管理",
		path: "/companyManagement",
		children: [
			{
				icon: "ShopOutlined",
				path: "/companyManagement/companyInfo",
				title: "公司信息"
			},
			{
				icon: "ShopOutlined",
				path: "/companyManagement/addCompany",
				title: "添加公司"
			}
		]
	},
	{
		icon: "AreaChartOutlined",
		title: "出入库管理",
		path: "/boundManagement",
		children: [
			{
				icon: "AreaChartOutlined",
				path: "/boundManagement/addInBound",
				title: "添加入库"
			},
			{
				icon: "AreaChartOutlined",
				path: "/boundManagement/boundRecord",
				title: "出入库记录"
			}
		]
	},
	{
		icon: "UnorderedListOutlined",
		title: "库存管理",
		children: [
			{
				icon: "UnorderedListOutlined",
				path: "/palletManagement/palletRecord",
				title: "库存记录"
			}
		]
	},
	{
		icon: "MoneyCollectFilled",
		title: "账单管理",
		children: [
			{
				icon: "MoneyCollectFilled",
				path: "/billManagement/monthlyBill",
				title: "月度账单"
			}
		]
	},
	// {
	// 	icon: "AreaChartOutlined",
	// 	title: "数据大屏",
	// 	path: "/dataScreen/index"
	// },
	// {
	// 	icon: "TableOutlined",
	// 	title: "超级表格",
	// 	path: "/proTable",
	// 	children: [
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/proTable/useHooks",
	// 			title: "使用 Hooks"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/proTable/useComponent",
	// 			title: "使用 Component"
	// 		}
	// 	]
	// },
	// {
	// 	icon: "FundOutlined",
	// 	title: "Dashboard",
	// 	path: "/dashboard",
	// 	children: [
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/dashboard/dataVisualize",
	// 			title: "数据可视化"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/dashboard/embedded",
	// 			title: "内嵌页面"
	// 		}
	// 	]
	// },
	// {
	// 	icon: "FileTextOutlined",
	// 	title: "表单 Form",
	// 	path: "/form",
	// 	children: [
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/form/basicForm",
	// 			title: "基础 Form"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/form/validateForm",
	// 			title: "校验 Form"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/form/dynamicForm",
	// 			title: "动态 Form"
	// 		}
	// 	]
	// },
	{
		icon: "PieChartOutlined",
		title: "Echarts",
		path: "/echarts",
		children: [
			{
				icon: "AppstoreOutlined",
				path: "/echarts/waterChart",
				title: "水型图"
			},
			{
				icon: "AppstoreOutlined",
				path: "/echarts/columnChart",
				title: "柱状图"
			},
			{
				icon: "AppstoreOutlined",
				path: "/echarts/lineChart",
				title: "折线图"
			},
			{
				icon: "AppstoreOutlined",
				path: "/echarts/pieChart",
				title: "饼图"
			},
			{
				icon: "AppstoreOutlined",
				path: "/echarts/radarChart",
				title: "雷达图"
			},
			{
				icon: "AppstoreOutlined",
				path: "/echarts/nestedChart",
				title: "嵌套环形图"
			}
		]
	}
	// {
	// 	icon: "ShoppingOutlined",
	// 	title: "常用组件",
	// 	path: "/assembly",
	// 	children: [
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/assembly/guide",
	// 			title: "引导页"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/assembly/svgIcon",
	// 			title: "Svg 图标"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/assembly/selectIcon",
	// 			title: "Icon 选择"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/assembly/batchImport",
	// 			title: "批量导入数据"
	// 		}
	// 	]
	// },
	// {
	// 	icon: "ProfileOutlined",
	// 	title: "菜单嵌套",
	// 	path: "/menu",
	// 	children: [
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/menu/menu1",
	// 			title: "菜单1"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/menu/menu2",
	// 			title: "菜单2",
	// 			children: [
	// 				{
	// 					icon: "AppstoreOutlined",
	// 					path: "/menu/menu2/menu21",
	// 					title: "菜单2-1"
	// 				},
	// 				{
	// 					icon: "AppstoreOutlined",
	// 					path: "/menu/menu2/menu22",
	// 					title: "菜单2-2",
	// 					children: [
	// 						{
	// 							icon: "AppstoreOutlined",
	// 							path: "/menu/menu2/menu22/menu221",
	// 							title: "菜单2-2-1"
	// 						},
	// 						{
	// 							icon: "AppstoreOutlined",
	// 							path: "/menu/menu2/menu22/menu222",
	// 							title: "菜单2-2-2"
	// 						}
	// 					]
	// 				},
	// 				{
	// 					icon: "AppstoreOutlined",
	// 					path: "/menu/menu2/menu23",
	// 					title: "菜单2-3"
	// 				}
	// 			]
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/menu/menu3",
	// 			title: "菜单3"
	// 		}
	// 	]
	// }
	// {
	// 	icon: "ExclamationCircleOutlined",
	// 	title: "错误页面",
	// 	path: "/error",
	// 	children: [
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/404",
	// 			title: "404页面"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/403",
	// 			title: "403页面"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/500",
	// 			title: "500页面"
	// 		}
	// 	]
	// },
	// {
	// 	icon: "PaperClipOutlined",
	// 	title: "外部链接",
	// 	path: "/link",
	// 	children: [
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/link/gitee",
	// 			title: "Gitee 仓库",
	// 			isLink: "https://gitee.com/laramie/Hooks-Admin"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/link/github",
	// 			title: "GitHub 仓库",
	// 			isLink: "https://github.com/HalseySpicy/Hooks-Admin"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/link/juejin",
	// 			title: "掘金文档",
	// 			isLink: "https://juejin.cn/user/3263814531551816/posts"
	// 		},
	// 		{
	// 			icon: "AppstoreOutlined",
	// 			path: "/link/myBlog",
	// 			title: "个人博客",
	// 			isLink: "http://www.spicyboy.cn"
	// 		}
	// 	]
	// }
];

const LayoutMenu = (props: any) => {
	const { pathname } = useLocation();
	const { isCollapse, setBreadcrumbList, setAuthRouter, setMenuList: setMenuListAction } = props;
	const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);

	// 刷新页面菜单保持高亮
	useEffect(() => {
		setSelectedKeys([pathname]);
		isCollapse ? null : setOpenKeys(getOpenKeys(pathname));
	}, [pathname, isCollapse]);

	// 设置当前展开的 subMenu
	const onOpenChange = (openKeys: string[]) => {
		if (openKeys.length === 0 || openKeys.length === 1) return setOpenKeys(openKeys);
		const latestOpenKey = openKeys[openKeys.length - 1];
		if (latestOpenKey.includes(openKeys[0])) return setOpenKeys(openKeys);
		setOpenKeys([latestOpenKey]);
	};

	// 定义 menu 类型
	type MenuItem = Required<MenuProps>["items"][number];
	const getItem = (
		label: React.ReactNode,
		key?: React.Key | null,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: "group"
	): MenuItem => {
		return {
			key,
			icon,
			children,
			label,
			type
		} as MenuItem;
	};

	// 动态渲染 Icon 图标
	const customIcons: { [key: string]: any } = Icons;
	const addIcon = (name: string) => {
		return React.createElement(customIcons[name]);
	};

	// 处理后台返回菜单 key 值为 antd 菜单需要的 key 值
	const deepLoopFloat = (menuList: Menu.MenuOptions[], newArr: MenuItem[] = []) => {
		menuList.forEach((item: Menu.MenuOptions) => {
			// 下面判断代码解释 *** !item?.children?.length   ==>   (!item.children || item.children.length === 0)
			if (!item?.children?.length) return newArr.push(getItem(item.title, item.path, addIcon(item.icon!)));
			newArr.push(getItem(item.title, item.path, addIcon(item.icon!), deepLoopFloat(item.children)));
		});
		return newArr;
	};

	// 获取菜单列表并处理成 antd menu 需要的格式
	const [menuList, setMenuList] = useState<MenuItem[]>([]);
	const [loading, setLoading] = useState(false);
	const getMenuData = async () => {
		setLoading(true);
		try {
			const data = menuArray;
			if (!data) return;
			setMenuList(deepLoopFloat(data));
			// 存储处理过后的所有面包屑导航栏到 redux 中
			setBreadcrumbList(findAllBreadcrumb(data));
			// 把路由菜单处理成一维数组，存储到 redux 中，做菜单权限判断
			const dynamicRouter = handleRouter(data);
			setAuthRouter(dynamicRouter);
			setMenuListAction(data);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		getMenuData();
	}, []);

	// 点击当前菜单跳转页面
	const navigate = useNavigate();
	const clickMenu: MenuProps["onClick"] = ({ key }: { key: string }) => {
		const route = searchRoute(key, props.menuList);
		if (route.isLink) window.open(route.isLink, "_blank");
		navigate(key);
	};

	return (
		<div className="menu">
			<Spin spinning={loading} tip="Loading...">
				<Logo></Logo>
				<Menu
					theme="dark"
					mode="inline"
					triggerSubMenuAction="click"
					openKeys={openKeys}
					selectedKeys={selectedKeys}
					items={menuList}
					onClick={clickMenu}
					onOpenChange={onOpenChange}
				></Menu>
			</Spin>
		</div>
	);
};

const mapStateToProps = (state: any) => state.menu;
const mapDispatchToProps = { setMenuList, setBreadcrumbList, setAuthRouter };
export default connect(mapStateToProps, mapDispatchToProps)(LayoutMenu);
