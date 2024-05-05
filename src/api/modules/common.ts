import { AllCompanyInfo, CompanyInfo } from "@/api/interface/common";
import http from "@/api";

// * 获取所有公司信息
export const getAllCompanyInfo = () => {
	return http.get<AllCompanyInfo>(`/common/allCompanyInfo`);
};

// * 添加公司信息
export const addCompanyInfo = (company: CompanyInfo) => {
	return http.post(`/common/addCompany`, company);
};

// // * 添加公司信息
// export const deleteCompany = (id: string) => {
// 	return http.post(`/common/deleteCompany`, { id });
// };
