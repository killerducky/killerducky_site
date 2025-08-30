const EXPECTED_SCORE_DISPLAY_FLOOR = -30;
const NUM_PLAYERS = 4; // only 4 supported for now
const RANK_LINES = ["M1", "M2", "M3", "S1", "S2", "S3"];
const s0 = "https://5-data.amae-koromo.com/api/v2/pl4/";
// # 12 = 4p Hanchan Jade room, 9 = 4p Hanchan Gold room
// # 11 = 4p Tonpuusen Jade room, 8 = 4p Tonpuusent Gold room
const mode = "16,15,12,11,9,8";
const Color = { 16: "r", 15: "r", 12: "g", 11: "g", 9: "y", 8: "y" };
const start_level = 10301;
// if (NUM_PLAYERS == 4) {
// } else if (NUM_PLAYERS == 3) {
// const s0 = 'https://5-data.amae-koromo.com/api/v2/pl3/'
// const mode = '26,24,22,25,23,21'
// const Color = {26: 'r', 25: 'r', 24: 'g', 23: 'g', 22: 'y', 21: 'y'}
// const start_level = 20301
// }
const modeId2RoomTypeFull = {
    16: "Throne S",
    15: "Throne E",
    12: "Jade S",
    11: "Jade E",
    9: "Gold S",
    8: "Gold E",
};
const modeId2RoomColor = { 16: "T", 15: "T", 12: "J", 11: "J", 9: "G", 8: "G" }; // Gold or Jade
const modeId2RoomLength = { 16: "S", 15: "E", 12: "S", 11: "E", 9: "S", 8: "E" }; // Hanchan or Tonpuusen
const last_place_penalty = {
    S: { E1: -80, E2: -100, E3: -120, M1: -165, M2: -180, M3: -195, S1: -210, S2: -225, S3: -240 },
    E: { E1: -40, E2: -50, E3: -60, M1: -80, M2: -90, M3: -100, S1: -110, S2: -120, S3: -130 },
};

const d = ["?", "E", "M", "S", "?", "C"];
const C1_LEVEL = 10701; // TODO just make forward/reverse maps instead of all this math?
const level_dan = (level) => `${d[(Math.floor(level / 100) % 100) - 2]}${level % 100}`;
const level_pt_base = (level) => {
    const level_pt_base = {
        301: 600, // E1
        302: 700,
        303: 1000,
        401: 1400,
        402: 1600,
        403: 1800,
        501: 2000,
        502: 3000,
        503: 4500, // S3
    };
    return level_pt_base[level % 1000] || 5000; // 5000 for C1 and above -- which doesn't really matter
};
// the math of level_dan function is neat, but I think this is easier to understand:
const level2rank = {
    10301: level_dan(10301), // "E1"
    10302: level_dan(10302), // "E2"
    10303: level_dan(10303), // "E3"
    10401: level_dan(10401), // "M1"
    10402: level_dan(10402), // "M2"
    10403: level_dan(10403), // "M3"
    10501: level_dan(10501), // "S1"
    10502: level_dan(10502), // "S2"
    10503: level_dan(10503), // "S3"
    10701: level_dan(10701), // "C1"
};
const rank2level = {};
for (const [level, rank] of Object.entries(level2rank)) {
    rank2level[rank] = parseInt(level); // convert level back to number if needed
}
let level_pt_sum_base = {};
let sum = level_pt_base(10301);
for (let level of [10301, 10302, 10303, 10401, 10402, 10403, 10501, 10502, 10503]) {
    level_pt_sum_base[level] = sum;
    sum += level_pt_base(level);
}

function min(A) {
    let min = A.reduce((min, val) => {
        // console.log(min, val)
        if (val == null) return min;
        if (Number.isNaN(val)) return min;
        return Math.min(min, val);
    }, Infinity);
    return min;
}
function max(A) {
    let max = A.reduce((max, val) => {
        if (val == null) return max;
        if (Number.isNaN(val)) return max;
        return Math.max(max, val);
    }, -Infinity);
    return max;
}

function exponential_moving_average(data, half_life) {
    const alpha = 1 - Math.pow(0.5, 1 / half_life);
    const initialSMA = data.slice(0, half_life).reduce((sum, val) => sum + val, 0) / Math.min(half_life, data.length);
    const ema = [initialSMA];
    for (let i = 1; i < data.length; i++) {
        ema.push(alpha * data[i] + (1 - alpha) * ema[i - 1]);
    }
    return ema;
}

function slidingWindowAverage(data, halfLife) {
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

function calcMovingAverage(data, windowSize, lambdaAvg) {
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

async function loadPlayerData(pname, pidx) {
    let res, data;
    res = await fetch(`/player/${pname}/${pidx}`);
    if (!res.ok) {
        return null;
    }
    data = await res.json();
    // let latest_timestamp = data.info.latest_timestamp * 1000;
    // let now = new Date();
    // console.log(latest_timestamp, now.getTime(), now - latest_timestamp, (now-latest_timestamp)/1000/60/60)
    // console.log(new Date(latest_timestamp).toString())
    // console.log(now.toString())
    data.games.reverse(); // TODO Where should this really be done?
    return data;
}

function storePlayerList() {
    // For now just grab out of UI elements. We could also hold the Player class list in a globalish thing
    let pnameEls = document.querySelectorAll(".pname");
    let pidxEls = document.querySelectorAll(".pidx");
    let players = [];
    pnameEls.forEach((pnameEl, index) => {
        players.push([pnameEl.value, Number(pidxEls[index].value)]);
    });
    localStorage.setItem("players", JSON.stringify(players));
}

function last_place_normalize(game_type, rank_game_was_played_at, rank_to_normalize_to) {
    // Add this amount to the points iff we were 4th to normalize it to normalize_to_rank
    return last_place_penalty[game_type][rank_to_normalize_to] - last_place_penalty[game_type][rank_game_was_played_at];
}

class Player {
    constructor(chartContainerEl, pname, pidx, normRank) {
        this.chartContainerEl = chartContainerEl;
        this.pname = pname;
        this.pidx = pidx;
        this.normRank = normRank;
        // this.uuid = uuid
        this.generateBtn = this.chartContainerEl.querySelector(".generate");
        this.pnameBtn = this.chartContainerEl.querySelector(".pname");
        this.pnameBtn.value = this.pname;
        this.pidxBtn = this.chartContainerEl.querySelector(".pidx");
        this.pidxBtn.value = this.pidx;
        this.normRankBtn = this.chartContainerEl.querySelector(".norm-rank");
        this.normRankBtn.value = this.normRank;
        this.xminEl = this.chartContainerEl.querySelector(".xmin");
        this.ESChart = this.chartContainerEl.querySelector(".ESChart");
        this.RankPointChart = this.chartContainerEl.querySelector(".RankPointChart");
        this.actualXmaxValue;
        this.xminEl.addEventListener("change", () => this.relayout());
        this.generateBtn.addEventListener("click", async () => {
            document.documentElement.style.cursor = "wait";
            this.generateBtn.disabled = true;
            this.pname = this.pnameBtn.value;
            this.pidx = this.pidxBtn.value;
            this.normRank = this.normRankBtn.value;
            await this.generate();
            document.documentElement.style.cursor = "default";
            this.generateBtn.disabled = false;
        });
    }
    relayout() {
        let xMin = Math.max(0, this.actualXmaxValue - this.xminEl.value);
        let ySlice = this.ESChart.data.map((trace) => trace.y.slice(xMin, this.actualXmaxValue)).flat();
        let yMin = min(ySlice);
        let yMax = max(ySlice);
        Plotly.relayout(this.ESChart, {
            "xaxis.range": [xMin, this.actualXmaxValue],
            "yaxis.range": [
                Math.min(((0 - this.normalizeToRankLine) * 15.0) / 4.0 - 2, Math.max(EXPECTED_SCORE_DISPLAY_FLOOR, yMin)),
                Math.max(yMax, ((5 - this.normalizeToRankLine) * 15.0) / 4.0 + 2),
            ],
            // 'yaxis.range': null,
            // 'yaxis.autorange': true  // TODO this isn't working...
        });
        Plotly.relayout(this.RankPointChart, {
            "xaxis.range": [xMin, this.actualXmaxValue],
        });
    }

    async generate() {
        let games;
        if (this.pname.trim() == "" || isNaN(this.pidx) || this.pidx < 0) {
            alert(`Please enter a valid player name and idx`);
            return;
        }
        let data = await loadPlayerData(this.pname, this.pidx);
        if (!data) {
            alert(`Failed to load data for Name:${this.pname} idx:${this.pidx}\nData from https://amae-koromo.sapk.ch\nGold room and up only.`);
            return;
        }
        this.uuid = data.info.id;
        games = data.games;
        storePlayerList();

        for (let game of games) {
            game.player = game.players.find((p) => p.accountId == this.uuid);
            const players_sorted = [...game.players].sort((a, b) => a.gradingScore - b.gradingScore);
            players_sorted.forEach((player, index) => {
                player.placement = players_sorted.length - index;
            });
        }

        let normLevel;
        if (this.normRank == "auto") {
            normLevel = games[games.length - 1].player.level;
        } else {
            normLevel = rank2level[this.normRank];
        }
        this.normalizeToRankLine = RANK_LINES.indexOf(level2rank[normLevel]);
        if (this.normalizeToRankLine == -1) {
            if (normLevel >= rank2level["C1"]) {
                this.normalizeToRankLine = RANK_LINES.indexOf("S3");
                normLevel = rank2level["S3"];
            } else {
                this.normalizeToRankLine = 0; // default to M1 if not found
                normLevel = rank2level["M1"];
            }
        }
        this.normRank = level2rank[normLevel];
        // console.log(this.pname)
        // console.log(games)
        // console.log(games[games.length-1])

        let prevGame = null;
        for (let game of games) {
            game.player.gradingScoreNorm = game.player.gradingScore;
            if (game.player.placement == 4) {
                game.player.gradingScoreNorm += last_place_normalize(modeId2RoomLength[game["modeId"]], level_dan(game.player["level"]), this.normRank);
            }
            if (!prevGame || prevGame.player.level != game.player.level) {
                game.player.rankPoints = level_pt_sum_base[game.player.level] + game.player.gradingScore;
                // console.log(game.player.rankPoints)
            } else {
                game.player.rankPoints = prevGame.player.rankPoints + game.player.gradingScore;
            }
            prevGame = game;
            // console.log(game.player)
        }
        games = games.filter((game) => game.player.level < rank2level["C1"]);
        const x = games.map((_, i) => i + 1); // x-axis: game numbers
        this.actualXmaxValue = x.length;
        const windowSizes = [100, 400];

        let traces = [];

        // for (let [lambdaStr, lambdaFunc] of [["EMA", exponential_moving_average], ["Sliding", slidingWindowAverage]]) {
        for (let [lambdaStr, lambdaFunc] of [["EMA", exponential_moving_average]]) {
            for (const [key, value] of Object.entries(modeId2RoomTypeFull)) {
                let numMatch = games.filter((game) => game.modeId == key).length;
                let attr = games.map((game) => (game.modeId == key ? game.player.gradingScoreNorm : null));
                // let gameDur = games.map((game) => (game.endTime - game.startTime) / 60);
                if (numMatch / games.length < 0.05) {
                    continue;
                }
                for (let windowSize of windowSizes) {
                    let ema = calcMovingAverage(attr, windowSize, lambdaFunc);
                    traces.push({
                        x: x,
                        y: ema,
                        // y: gameDur,
                        mode: "lines",
                        name: `${value} ${lambdaStr} ${windowSize}`,
                        // visible: lambdaStr == "Sliding" ? false : true,
                        // visible: lambdaStr == "Sliding" ? "legendonly" : true,
                        visible: windowSize == 200 ? "legendonly" : true,
                    });
                }
            }
        }

        // const yValues = traces.flatMap(trace => trace.y); // combine all y values
        // const yMin = Math.min(...yValues);
        // const yMax = Math.max(...yValues);
        this.actualXmaxValue = x.length;

        let layout = {
            title: {
                text: `Expected Rank Point Change per Match for ${this.pname}[${this.pidx}] assuming ${this.normRank}`,
            },
            margin: { t: 50, b: 50, l: 60, r: 60 },
            xaxis: {
                title: { text: "Game #", standoff: 10 },
                linecolor: "black",
                mirror: true,
            },
            yaxis: {
                title: { text: "Expected Rank Point Change", standoff: 0 },
                linecolor: "black",
                mirror: true,
            },
            legend: {
                x: 0.5,
                y: -0.15,
                xanchor: "center",
                yanchor: "top",
                orientation: "h",
            },
            // hovermode: "x unified",
            shapes: [],
            annotations: [],
        };
        for (let line = 0; line < 6; line++) {
            layout.shapes.push({
                type: "line",
                x0: 0,
                x1: 1,
                y0: ((line - this.normalizeToRankLine) * 15.0) / 4.0,
                y1: ((line - this.normalizeToRankLine) * 15.0) / 4.0,
                xref: "paper",
                yref: "y",
                line: {
                    color: "blue",
                    width: 0.5,
                    dash: "solid",
                },
            });
            layout.annotations.push({
                x: 0,
                y: ((line - this.normalizeToRankLine) * 15.0) / 4.0 + 1,
                xref: "paper",
                yref: "y",
                text: RANK_LINES[line],
                showarrow: false,
                xanchor: screenLeft,
                font: {
                    color: "blue",
                    size: 12,
                },
            });
        }
        Plotly.newPlot(this.ESChart, traces, layout, { responsive: true });

        traces = [];
        traces.push({
            x: x,
            y: games.map((game) => game.player.rankPoints),
            text: games.map((game) => {
                let currPoints = game.player.rankPoints - level_pt_sum_base[game.player.level] + level_pt_base(game.player.level);
                return `${level2rank[game.player.level]} ${currPoints}`;
            }),
            mode: "lines",
            name: `rp`,
            hovertemplate: "%{text}<extra></extra>",
        });

        layout = {
            title: {
                text: `Rank Points Trend for ${this.pname}[${this.pidx}]`,
            },
            margin: { t: 50, b: 50, l: 60, r: 60 },
            xaxis: {
                title: { text: "Game #", standoff: 10 },
                linecolor: "black",
                mirror: true,
            },
            yaxis: {
                title: { text: "Rank Points", standoff: 10 },
                linecolor: "black",
                mirror: true,
            },
            legend: {
                x: 0.5,
                y: -0.1,
                xanchor: "center",
                yanchor: "top",
            },
            hovermode: "x",
            shapes: [],
            annotations: [],
        };
        prevGame = null;
        let prevChange = 0;
        for (let [index, game] of games.entries()) {
            // Demotion/promotion or last section
            if ((prevGame && prevGame.player.level != game.player.level) || index == games.length - 1) {
                // console.log("level=", game.player.level, level_dan(game.player.level))
                // draw vertical lines
                let x_coords = [prevChange, index == games.length - 1 ? index + 1 : index];
                for (let x of x_coords) {
                    layout.shapes.push({
                        type: "line",
                        x0: x,
                        x1: x,
                        y0: level_pt_sum_base[prevGame.player.level] - level_pt_base(prevGame.player.level),
                        y1: level_pt_sum_base[prevGame.player.level] + level_pt_base(prevGame.player.level),
                        xref: "x",
                        yref: "y",
                        line: {
                            color: "black",
                            width: 0.5,
                            dash: "solid",
                        },
                    });
                }
                layout.annotations.push({
                    x: prevChange,
                    y: level_pt_sum_base[prevGame.player.level] - level_pt_base(prevGame.player.level),
                    text: level_dan(prevGame.player.level),
                    showarrow: false,
                    xanchor: "left",
                    yanchor: "bottom",
                    font: { size: 10, color: "black" },
                });
                for (let y of [-1, 0, 1]) {
                    layout.shapes.push({
                        type: "line",
                        x0: x_coords[0],
                        x1: x_coords[1],
                        y0: level_pt_sum_base[prevGame.player.level] + y * level_pt_base(prevGame.player.level),
                        y1: level_pt_sum_base[prevGame.player.level] + y * level_pt_base(prevGame.player.level),
                        xref: "x",
                        yref: "y",
                        line: {
                            color: "black",
                            width: 0.5,
                            dash: "solid",
                        },
                    });
                }
                prevChange = index;
            }
            prevGame = game;
        }
        // manually annotate left y-axis
        for (let y of [-1, 0, 1]) {
            layout.annotations.push({
                x: 1.01,
                y: level_pt_sum_base[prevGame.player.level] + y * level_pt_base(prevGame.player.level),
                xref: "paper",
                yref: "y",
                xanchor: "left",
                text: ((y + 1) * level_pt_base(prevGame.player.level)).toString(),
                showarrow: false,
                font: { size: 12, color: "black" },
                align: "left",
            });
        }

        Plotly.newPlot(this.RankPointChart, traces, layout, {
            responsive: true,
        });
        this.relayout();
        tooltipSetup();
    }
}

async function tooltipSetup() {
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

async function main() {
    let players = JSON.parse(localStorage.getItem("players") || '[["",0]]');
    // console.log(JSON.stringify(players))
    let charts = [];
    for (let p of players) {
        let chart;
        if (charts.length == 0) {
            chart = document.querySelector(".chart-container");
        } else {
            chart = charts[0].cloneNode(true);
            document.body.appendChild(chart);
        }
        charts.push(chart);
        new Player(chart, p[0], p[1], "auto");
    }
}

main();
