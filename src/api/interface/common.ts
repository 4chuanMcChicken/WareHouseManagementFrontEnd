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
	productName: string;
	quantity: number;
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
	productId: string;
	quantity: number;
	companyId: string;
	wareHouseId: string;
	happenTime: number;
	caseAmount?: number;
	orderNumber?: string;
	comment?: string;
}

export interface Pallet {
	_id?: string;
	productId: string;
	productName: string;
	dayIn: number;
	companyName: string;
	// wareHouseId: string;
	wareHouseName?: string;
	status: string;
	inBoundRecordId: string;
	comment?: string;
	orderNumber?: string;
	outBoundRecordId?: string;
	ifCheckout: boolean;
	dayOut?: number;
}

export interface Pallets {
	pallets: Pallet[];
}

export interface MonthlyBill {
	_id: string;
	companyName: string;
	amount: number;
	createTime: number;
	billedPallets: string[];
	billedMonth: string;
	billedMonthTimestamp: string;
	unitPrice: number;
	ifPaid: boolean;
}

export interface MonthlyBillDetail {
	totalAmount: number;
	companyName: string;
	createTime: number;
	details: DetailContent[];
	caseAmount: number;
	palletAmount: number;
}

export interface DetailContent {
	_id: string;
	productId: string;
	dayIn?: number;
	quantity: number;
	price: number;
	amount: number;
	happenTime?: number;
	type: string;
}

export interface MonthlyBills {
	monthlyBills: MonthlyBill[];
}

export interface Product {
	_id: string;
	name: string;
	companyId: string;
	description?: string;
}

export interface Products {
	productInfos: Product[];
}
