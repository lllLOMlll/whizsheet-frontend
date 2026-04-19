export function getEnumOptions<T>(enumObj: any): T[] {
    return Object.values(enumObj).filter(
        (value) => typeof value === 'number'
    ) as T[];
}