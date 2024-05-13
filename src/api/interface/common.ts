// 公司信息相关

export interface CompanyInfo {
	_id?: string;
	name: string;
	contactNumber: string;
	price: number;
}

export interface BoundRecordInfo {
	_id?: string;
	happenTime: string;
	type: string;
	companyName: string;
}

export interface allBoundRecordInfo {
	boundRecords: BoundRecordInfo[];
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
	happenTime: number;
	caseAmount?: number;
	orderNumber?: string;
	comment?: string;
}
