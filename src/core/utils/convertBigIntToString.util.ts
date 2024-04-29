export function convertBigIntToString(records: any) {
  const recursivelyConvertBigIntToString = (obj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'bigint') {
        obj[key] = obj[key].toString();
      } else if (typeof obj[key] === 'object') {
        recursivelyConvertBigIntToString(obj[key]); // Recursively call for sub-objects
      }
    }
  };

  recursivelyConvertBigIntToString(records);
  return records;
}
