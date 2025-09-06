export function min(A) {
    let min = A.reduce((min, val) => {
        // console.log(min, val)
        if (val == null) return min;
        if (Number.isNaN(val)) return min;
        return Math.min(min, val);
    }, Infinity);
    return min;
}
export function max(A) {
    let max = A.reduce((max, val) => {
        if (val == null) return max;
        if (Number.isNaN(val)) return max;
        return Math.max(max, val);
    }, -Infinity);
    return max;
}
export function exponential_moving_average(data, half_life) {
    const alpha = 1 - Math.pow(0.5, 1 / half_life);
    const initialSMA = data.slice(0, half_life).reduce((sum, val) => sum + val, 0) / Math.min(half_life, data.length);
    const ema = [initialSMA];
    for (let i = 1; i < data.length; i++) {
        ema.push(alpha * data[i] + (1 - alpha) * ema[i - 1]);
    }
    return ema;
}

export function slidingWindowAverage(data, halfLife) {
    const n = data.length;
    const initialSMA = data.slice(0, halfLife).reduce((sum, val) => sum + val, 0) / Math.min(halfLife, n);

    // Fill the first halfLife values with initial SMA
    const result = Array(Math.min(halfLife, n)).fill(initialSMA);

    for (let i = 0; i <= n - halfLife; i++) {
        const window = data.slice(i, i + halfLife);
        const avg = window.reduce((sum, val) => sum + val, 0) / halfLife;
        result.push(avg);
    }

    return result;
}
