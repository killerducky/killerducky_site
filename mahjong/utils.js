// helper: parse attr or fallback
const parseAttr = (input, attrName, fallback) => {
    const v = input.getAttribute(attrName);
    if (v === null || v === "") return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

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
export function calcMovingAverage(data, windowSize, lambdaAvg) {
    const filtered = data.filter((v) => v !== null);
    if (filtered.length == 0) {
        return Array(data.length).fill(null);
    }
    const averaged = lambdaAvg(filtered, windowSize);
    const finalResult = [];
    let i = 0;
    for (const value of data) {
        if (value === null) {
            finalResult.push(null);
        } else {
            finalResult.push(averaged[i]);
            i++;
        }
    }
    return finalResult;
}
export function plotlyTooltipSetup() {
    document.querySelectorAll(".modebar-btn").forEach((btn) => {
        let innerText = btn.getAttribute("data-title");
        btn.addEventListener("mouseenter", (e) => {
            const tooltip = document.createElement("div");
            tooltip.className = "custom-tooltip";
            tooltip.innerText = innerText;
            document.body.appendChild(tooltip);

            // Position above mouse
            const rect = e.currentTarget.getBoundingClientRect();
            tooltip.style.position = "absolute";
            tooltip.style.left = window.scrollX + rect.left + rect.width / 2 + "px";
            tooltip.style.top = window.scrollY + rect.top - 30 + "px";
            tooltip.style.transform = "translateX(-50%)";

            btn.addEventListener("mouseleave", () => tooltip.remove(), { once: true });
        });
        btn.removeAttribute("data-title");
        btn.removeAttribute("rel");
    });
}
export function handleSteppers(chartContainerEl) {
    chartContainerEl.querySelectorAll(".number-stepper").forEach((container) => {
        const input = container.querySelector('input[type="number"]');
        const btnUp = container.querySelector(".step-up");
        const btnDown = container.querySelector(".step-down");

        if (!input) return;

        // get step/min/max dynamically in case they change
        const getStep = () => parseAttr(input, "step", 1);
        const getMin = () => parseAttr(input, "min", -Infinity);
        const getMax = () => parseAttr(input, "max", Infinity);

        const clamp = (v) => Math.min(getMax(), Math.max(getMin(), v));

        const changeValue = (delta) => {
            // Allow empty input: treat as 0 or min if defined
            let val = input.value === "" ? (Number.isFinite(getMin()) && getMin() > -Infinity ? getMin() : 0) : Number(input.value);

            if (!Number.isFinite(val)) val = 0;

            const step = getStep();
            // If step is 0 or NaN, default to 1
            const effectiveStep = typeof step === "number" && step !== 0 && Number.isFinite(step) ? step : 1;

            // add delta * step
            let newVal = val + delta * effectiveStep;

            // Align to step grid relative to min if min is finite (helps with non-integer steps)
            const min = getMin();
            if (Number.isFinite(min) && effectiveStep !== 0) {
                // make sure (newVal - min) is a multiple of step (within floating tolerance)
                const raw = Math.round((newVal - min) / effectiveStep) * effectiveStep + min;
                newVal = raw;
            }

            newVal = clamp(newVal);

            // If step or min cause decimal imprecision, format to reasonable decimal places
            const decimals = (effectiveStep.toString().split(".")[1] || "").length;
            input.value = Number.isFinite(decimals) && decimals > 0 ? newVal.toFixed(decimals) : String(Math.round(newVal));
            input.dispatchEvent(new Event("change", { bubbles: true })); // let other listeners know value changed
        };

        // button handlers
        btnUp && btnUp.addEventListener("click", () => changeValue(+1));
        btnDown && btnDown.addEventListener("click", () => changeValue(-1));
    });
}
