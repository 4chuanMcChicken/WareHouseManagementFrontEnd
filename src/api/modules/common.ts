import {
	AllCompanyInfo,
	CompanyInfo,
	InBoundRecord,
	AllWareHouseInfo,
	allBoundRecordInfo,
	Pallets,
	MonthlyBills,
	MonthlyBillDetail,
	Product
} from "@/api/interface/common";
import { ResPage } from "@/api/interface/index";
import http from "@/api";

// * 获取所有公司信息
export const getAllCompanyInfo = () => {
	return http.get<AllCompanyInfo>(`/common/allCompanyInfo`);
};

// * 获取所有仓库信息
export const getAllWareHouseInfo = () => {
	return http.get<AllWareHouseInfo>(`/common/allWareHouseInfo`);
};

// * 添加公司信息
export const addCompanyInfo = (company: CompanyInfo) => {
	return http.post(`/common/addCompany`, company);
};

// * 添加入库记录
export const addInBoundRecord = (inBoundRecord: InBoundRecord) => {
	return http.post(`/common/addInBoundRecord`, inBoundRecord);
};

// * 添加出库记录
export const addOutBoundRecord = (pallets: string[]) => {
	return http.post(`/common/addOutBoundRecord`, { pallets });
};

// * 获得出入库记录
export const getBoundRecordsInfo = (type: string) => {
	return http.get<allBoundRecordInfo>(`/common/getBoundRecords`, { type });
};

// * 获得出入库记录
export const getPallets = (productName?: string, companyId?: string) => {
	return http.get<Pallets>(`/common/getPallets`, { productName, companyId });
};

// * 获得月度账单记录
export const getMonthlyBill = (companyId?: string, ifPaid?: boolean) => {
	return http.get<MonthlyBills>(`/common/getMonthlyBill`, { companyId, ifPaid });
};

// * 获得某张月度账单详情
export const getMonthlyBillDetail = (billId: string) => {
	return http.get<MonthlyBillDetail>(`/common/getMonthlyBillDetail`, { billId });
};

export const confirmMonthlyBillPaid = (billId: string) => {
	return http.post(`/common/confirmMonthlyBillPaid`, { billId });
};

// * 撤销出库
export const revokeOutBound = (pallets: string[]) => {
	return http.post(`/common/revokeOutBound`, { pallets });
};

// * 添加货物
export const addProduct = (name: string, companyId: String, description: string) => {
	return http.post(`/common/addProduct`, { name, companyId, description });
};

// * 查询货物
export const getProductInfo = (page: number, limit: number, companyName?: string, wareHouseName?: string) => {
	return http.get<ResPage<Product>>(`/common/getProductInfo`, { page, limit, companyName, wareHouseName });
};

// * 智能出库
export const smartOutBound = (productId: string, quantity: number, type: string, happenTime: string) => {
	return http.post(`/common/smartOutBound`, { productId, quantity, type, happenTime });
};

// * 智能出库
export const revokeBoundRecord = (boundRecordId: string, password: string) => {
	return http.post(`/common/revokeBoundRecord`, { boundRecordId, password });
};

// // * 添加公司信息
// export const deleteCompany = (id: string) => {
// 	return http.post(`/common/deleteCompany`, { id });
// };
