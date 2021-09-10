export const getData = (key, defaultValue=null) => {
	if (!localStorage) return;

	try {
		let finalValue;
		const value = localStorage.getItem(key);
		
		if (!value) {
			finalValue = defaultValue;
		}
		else {
			finalValue = JSON.parse();
		}
		return finalValue;
	} catch (err) {
		console.error(`Error getting item ${key} from localStorage`, err);
	}
};

export const storeData = (key, item) => {
	if (!localStorage) return;

	try {
		return localStorage.setItem(key, JSON.stringify(item));
	} catch (err) {
		console.error(`Error storing item ${key} to localStorage`, err);
	}
};