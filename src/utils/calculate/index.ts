
export function isValidJson(jsonString: string) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
}


export function sortByDollar(data: [string, string][]) {
    interface Result {
        [key: string]: number;
    }
    const result: Result = data.reduce((acc: Result, item) => {
        const [price, size] = item
        const numSignificant = parseFloat(price) >= 1 ? 0 : 3
        let dollar = convertDollar(price, numSignificant)
        if (!acc[dollar]) {
            acc[dollar] = parseFloat(size)
        }
        else {
            acc[dollar] += parseFloat(size)
        }
        return acc;
    }, {});
    return result
}

export function convertDollar(numberStr: string, numSignificant: number) {
    if (numberStr[0] === "0") {
        let i = 0;
        while (numberStr[i] === '0' || numberStr[i] === '.') {
            ++i;
        }
        return numberStr.substring(0, i + numSignificant);
    }
    else {
        return numberStr.substring(0, numberStr.indexOf("."));
    }
}

export function calculateTotalPriceAndSize(data: [string, string][]) {
    if (!data) {
        return {
            totalPrice: NaN,
            totalSize: NaN
        }
    }
    let sumPrice = 0
    let sumSize = 0
    data.forEach(item => {
        const [price, size] = item
        sumPrice += parseFloat(price)
        sumSize += parseFloat(size)
    })
    return {
        totalPrice: sumPrice,
        totalSize: sumSize
    }
}

export function formatFractionDigits(value: number, minDigit = 2, maxDigit = 2) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: minDigit,
        maximumFractionDigits: maxDigit
    }).format(value);

}

// #region Task 1: Finding the Sum from 1 to X
// Method 1: using loop add 1 to x
export function sumUsingReduce(x: number): number {
    let total = 0
    if (x > 0) {
        while (x) {
            total += x
            --x;
        }
        return total
    }
    return NaN
}

// Method 2: using gauss formula which sum of arithmetic series
export function sumUsingGauss(x: number): number {
    if (x > 0) {
        return (x * (x + 1)) / 2
    }
    return NaN
}

// Method 3: using recurvive method until x decrease to 1
export function sumUsingRecursive(x: number): number {
    if (x > 0) {
        if (x === 1) {
            return 1
        }
        return x + sumUsingRecursive(x - 1)
    }
    return NaN
}
//#endregion