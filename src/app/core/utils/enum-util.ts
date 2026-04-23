export function getEnumOptions<T>(enumObj: any): T[] {
    return Object.values(enumObj).filter(
        (value) => typeof value === 'number'
    ) as T[];
}

export function mapStringToEnum<T>(enumObject: any, enumValue:any): T {
    if (typeof enumValue === 'string' && isNaN(Number(enumValue))) {
        return enumObject[enumValue] as T;
    }
    return enumValue as T;
}