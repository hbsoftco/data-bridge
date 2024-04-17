export function convertBigIntToString(records: any) {
  for (const key in records) {
    if (typeof records[key] === 'bigint') {
      records[key] = records[key].toString();
    }
  }
  return records;
}
