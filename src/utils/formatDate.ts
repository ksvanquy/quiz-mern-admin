export function formatDate(input: string | number | Date) {
	try {
		const d = new Date(input);
		if (Number.isNaN(d.getTime())) return "";
		return d.toLocaleString();
	} catch {
		return "";
	}
}

