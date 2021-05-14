export interface ItemSettings {
    category: string,
    name: string,
    quantity: number,
    units: 'choose' | 'kg' | 'gms' | 'lit' | 'ml' | 'dozen' | 'units',
    stockcount: number,
    price: number,
    notify: 'choose' | 'auto' | 'request'
    utilizationTime: number,
    utilizationQuantity: number,
    utilizationUnits: 'choose' | 'kg' | 'gms' | 'lit' | 'ml' | 'dozen' | 'units',
    description?: string,
    nextreqdate: string,
    totalstock: {
        amount: string,
        units: string,
        daysleft: string
    }
}