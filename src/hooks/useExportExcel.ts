import { useRef } from "react";
import * as XLSX from "xlsx";

const useExportExcel = (filename: string) => {
	const tableRef = useRef<HTMLTableElement>(null);

	const exportToExcel = () => {
		if (!tableRef.current) return;

		const ws = XLSX.utils.table_to_sheet(tableRef.current);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
		XLSX.writeFile(wb, `${filename}.xlsx`);
	};

	return { tableRef, exportToExcel };
};

export default useExportExcel;
