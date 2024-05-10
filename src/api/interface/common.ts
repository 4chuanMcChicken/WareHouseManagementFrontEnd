// 公司信息相关

export interface CompanyInfo {
	_id?: string;
	name: string;
	contactNumber: string;
}

export interface BoundRecordInfo {
	_id?: string;
	happenTime: string;
	type: string;
	companyId: string;
}

export interface WareHouseInfo {
	_id?: string;
	name: string;
}
export interface AllWareHouseInfo {
	wareHouseInfos: WareHouseInfo[];
}
export interface AllCompanyInfo {
	companyInfos: CompanyInfo[];
}

export interface InBoundRecord {
	productName: string;
	quantity: number;
	companyId: string;
	wareHouseId: string;
	happenTime: string;
	caseAmount?: number;
	orderNumber?: string;
	comment?: string;
}

export interface BoundRecordInfo {
	happenTime: string;
	type: string;
	companyId: string;
}
