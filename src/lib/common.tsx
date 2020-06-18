
// helper functions
export const cloneObject = (obj: any) => {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

export const formatNumber = (number: number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);


// interfaces 

export interface Product { id: string; name: string; sold: number, unitPrice: number }
