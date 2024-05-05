// 公司信息相关

export interface CompanyInfo {
	name: string;
	contactNumber: string;
}

export interface AllCompanyInfo {
	companyInfos: CompanyInfo[];
}
