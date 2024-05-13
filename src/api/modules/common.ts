import { AllCompanyInfo, CompanyInfo, InBoundRecord, AllWareHouseInfo, allBoundRecordInfo } from "@/api/interface/common";
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

// * 获得出入库记录
export const getBoundRecordsInfo = (type: string) => {
	return http.get<allBoundRecordInfo>(`/common/getBoundRecords`, { type });
};

// // * 添加公司信息
// export const deleteCompany = (id: string) => {
// 	return http.post(`/common/deleteCompany`, { id });
// };
