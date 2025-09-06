// import fs from "fs/promises";

async function getJson(pname) {
    let res = await fetch(`/api/tenhou/nodocchi_listuser/${pname}`);
    if (!res.ok) {
        return null;
    }
    let data = await res.json();
    console.log(data);
    return data;
    // console.log(JSON.stringify(data, null, 2));
}

function cleanQuotes(s) {
    return s.replace(/^"=""(.*)?"""$/, "$1");
}

// Room codes:
// 4NEKA-
// 4 = 4 player
// N = ippan
// E = East only
// K = Kuitan (Open tanyao)
// A = Aka 5s
// - = no special rule?
let rooms = {
    N: "ippan",
    A: "joukyu",
    E: "tokujou",
};
let jsonPlayerlevel2Room = {
    0: "N",
    1: "A",
    2: "E",
    // 3: Not sure letter for houou
};
let keymap = {
    "1st player": "player1",
    "2nd player": "player2",
    "3rd player": "player3",
    "4th player": "player4",
};
let deltaPoints = {
    0: { 1: 30, 2: 15, 3: 0, 4: 0 },
    1: { 1: 60, 2: 15, 3: 0, 4: 0 },
    2: { 1: 75, 2: 30, 3: 0, 4: 0 },
    3: { 1: 90, 2: 45, 3: 0, 4: 0 },
};
let ladderInfo = {
    N: { base: 0, target: 20, last: 0 },
    "9k": { base: 0, target: 20, last: 0 },
    "8k": { base: 0, target: 20, last: 0 },
    "7k": { base: 0, target: 20, last: 0 },
    "6k": { base: 0, target: 40, last: 0 },
    "5k": { base: 0, target: 60, last: 0 },
    "4k": { base: 0, target: 80, last: 0 },
    "3k": { base: 0, target: 100, last: 0 },
    "2k": { base: 0, target: 100, last: -15 },
    "1k": { base: 0, target: 100, last: -30 },
    "1d": { base: 200, target: 400, last: -45 },
    "2d": { base: 400, target: 800, last: -60 },
    "3d": { base: 600, target: 1200, last: -75 },
    "4d": { base: 800, target: 1600, last: -90 },
    "5d": { base: 1000, target: 2000, last: -105 },
    "6d": { base: 1200, target: 2400, last: -120 },
    "7d": { base: 1400, target: 2800, last: -135 },
    "8d": { base: 1600, target: 3200, last: -150 },
    "9d": { base: 1800, target: 3600, last: -165 },
    "10d": { base: 2000, target: 4000, last: -180 },
};
let ladderOrder = Object.keys(ladderInfo);
let prevRank;
for (let [i, rank] of ladderOrder.entries()) {
    if (prevRank) {
        // 1d sumbase = e.g. 9000, sumbase + target-base = 9000 + (400-200) = 9200
        ladderInfo[rank].sumbase = ladderInfo[prevRank].sumbase + ladderInfo[prevRank].target - ladderInfo[prevRank].base;
    } else {
        ladderInfo[rank].sumbase = 0;
    }
    prevRank = rank;
}
function promoteRank(currRank) {
    let idx = ladderOrder.indexOf(currRank);
    if (idx != -1 && idx < ladderOrder.length - 1) {
        return ladderOrder[idx + 1];
    }
    console.log(`ERROR could not promote ${currRank}`);
    return currRank;
}
function demoteRank(currRank) {
    let idx = ladderOrder.indexOf(currRank);
    if (idx == -1) {
        console.log(`ERROR could not demote ${currRank}`);
    }
    if (ladderInfo[currRank].base == 0) {
        return currRank; // don't demote for these cases
    }
    return ladderOrder[idx - 1];
}

class Player {
    constructor(chartContainerEl, pname) {
        this.chartContainerEl = chartContainerEl;
        this.generateBtn = this.chartContainerEl.querySelector(".generate");
        this.pnameBtn = this.chartContainerEl.querySelector(".pname");
        this.pnameBtn.value = pname;
        this.RankPointChart = this.chartContainerEl.querySelector(".chart-tenhou-rank");
        this.lastN = this.chartContainerEl.querySelector(".lastN");
        this.lastN.addEventListener("change", () => this.relayout());
        this.generateBtn.addEventListener("click", async () => {
            document.documentElement.style.cursor = "wait";
            this.generateBtn.disabled = true;
            await this.generate();
            document.documentElement.style.cursor = "default";
            this.generateBtn.disabled = false;
        });
    }

    relayout() {
        let xMax = this.RankPointChart.data[0].x.length + 1;
        let xMin = Math.max(0, xMax - this.lastN.value);
        Plotly.relayout(this.RankPointChart, {
            "xaxis.range": [xMin, xMax],
        });
    }

    async generate() {
        let pname = this.pnameBtn.value;
        localStorage.setItem(`tenhou_players`, `["${pname}"]`);
        let crossCheck = false;
        let jsonData;
        // for now don't cache
        // jsonData = JSON.parse(localStorage.getItem(`tenhou_${pname}`)) || (await getJson(pname));
        jsonData = await getJson(pname);
        // localStorage.setItem(`tenhou_${pname}`, JSON.stringify(jsonData));
        console.log(jsonData);
        let csvData;
        let games;
        if (crossCheck) {
            // let csvData = await fs.readFile("tenhou_KillerD.csv", "utf-8");
            let csvData = await fetch("tmp/tenhou_KillerD.csv");
            csvData = await csvData.text();
            let lines = csvData.split("\n");
            let header = lines[0].split(",").map((h) => cleanQuotes(h));
            games = lines.slice(1).map((line) => {
                let cols = line.split(",").map((h) => cleanQuotes(h));
                let game = {};
                header.forEach((h, i) => {
                    game[h] = cols[i];
                });
                return game;
            });
            let rules = new Set(games.map((g) => g.Rule));
            console.log(rules);
            const ruleCounts = games.reduce((acc, game) => {
                const rule = game.Rule || "Unknown"; // fallback if Rule is missing
                acc[rule] = (acc[rule] || 0) + 1;
                return acc;
            }, {});
            console.log(ruleCounts);
            games.forEach((game) => {
                for (const [oldKey, newKey] of Object.entries(keymap)) {
                    if (oldKey in game) {
                        game[newKey] = game[oldKey];
                        delete game[oldKey];
                    }
                }
            });
            games = games.filter((g) => g.Lobby === "");
        }

        jsonData.list = jsonData.list.filter((g) => !("lobby" in g));

        let currRank = "N";
        let currRankPoints = 0;
        let currTotalRankPoints = 0;
        for (const [i, jsonGame] of jsonData.list.entries()) {
            let mismatch = false;
            let playerPlace;
            let game;
            if (crossCheck) {
                let game = games[i];
                for (let p = 1; p <= 4; p++) {
                    if (game[`player${p}`] != jsonGame[`player${p}`]) {
                        console.log("mismatch");
                        console.log(game[`player${p}`], jsonGame[`player${p}`]);
                        mismatch = true;
                        break;
                    }
                }
            }
            for (let p = 1; p <= 4; p++) {
                if (jsonGame[`player${p}`] == pname) {
                    playerPlace = p;
                }
            }
            // sctype?
            // how to know room ippan/joukyu etc?
            let typeStr = "";
            typeStr += `${jsonGame.playernum}`;
            typeStr += `${jsonPlayerlevel2Room[jsonGame.playerlevel]}`;
            typeStr += `${jsonGame.playlength == 1 ? "E" : "S"}`;
            typeStr += `${jsonGame.kuitanari ? "K" : "?"}`;
            typeStr += `${jsonGame.akaari ? "A" : "?"}`;
            typeStr += `-`;
            if (crossCheck) {
                // console.log(typeStr);
                if (typeStr != game.Rule) {
                    mismatch = true;
                    console.log("ERROR");
                    console.log(jsonGame);
                    console.log(typeStr);
                    console.log(game.Rule);
                    process.exit();
                }
                if (mismatch || !playerPlace) {
                    console.log("ERROR");
                    console.log(playerPlace);
                    console.log(game.player1);
                    console.log(jsonGame.player1);
                    console.log(game);
                    console.log(jsonGame);
                    break;
                }
            }
            if ("lobby" in jsonGame) {
                continue;
            }

            let rankPointChange = deltaPoints[jsonGame.playerlevel][playerPlace];
            if (playerPlace == 4) {
                rankPointChange = ladderInfo[currRank].last;
            }
            // East games are worth 2/3
            if (jsonGame.playlength == 1) {
                rankPointChange = (rankPointChange * 2) / 3;
            }
            currRankPoints += rankPointChange;
            if (currRankPoints > ladderInfo[currRank].target) {
                currRank = promoteRank(currRank);
                currRankPoints = ladderInfo[currRank].base;
            } else if (currRankPoints < 0) {
                currRank = demoteRank(currRank);
                currRankPoints = ladderInfo[currRank].base;
            }
            jsonGame.postRank = currRank;
            jsonGame.postRankPoints = currRankPoints;
            jsonGame.postSumRankPoints = currRankPoints + ladderInfo[currRank].sumbase - ladderInfo[currRank].base;
            // console.log(i, currRank, currRankPoints, currRankPoints + ladderInfo[currRank].sumbase);

            if (crossCheck) {
                // console.log(game);
                if (rankPointChange != game["Pt change"]) {
                    console.log(game);
                    console.log("ERROR rankPointChange mismatch");
                    console.log(playerPlace, rankPointChange, game["Pt change"]);
                    break;
                }
            }
        }
        let traces = [];
        const x = jsonData.list.map((_, i) => i + 1); // x-axis: game numbers
        traces.push({
            x: x,
            y: jsonData.list.map((game) => {
                return game.postSumRankPoints;
            }),
            text: jsonData.list.map((game) => {
                return `${game.postRank} ${game.postRankPoints}`;
            }),
            mode: "lines",
            hovertemplate: "%{text}<extra></extra>",
        });
        let layout = {
            title: {
                text: `Rank Points Trend for ${pname}`,
            },
            margin: { t: 50, b: 50, l: 60, r: 60 },
            xaxis: {
                title: { text: "Game #", standoff: 10 },
                // linecolor: "black",
                // mirror: true,
            },
            yaxis: {
                title: { text: "Rank Points", standoff: 10 },
                // linecolor: "black",
                // mirror: true,
            },

            hovermode: "x",
            shapes: [],
            annotations: [],
        };
        let prevGame;
        let prevChange = 0;
        for (let [index, game] of jsonData.list.entries()) {
            // Demotion/promotion or last section
            if ((prevGame && prevGame.postRank != game.postRank) || index == jsonData.list.length - 1) {
                // draw vertical lines
                let x_coords = [prevChange + 1, index + 1];
                let y_coords = [
                    ladderInfo[prevGame.postRank].sumbase,
                    ladderInfo[prevGame.postRank].sumbase + ladderInfo[prevGame.postRank].target - ladderInfo[prevGame.postRank].base,
                    ladderInfo[prevGame.postRank].sumbase - ladderInfo[prevGame.postRank].base,
                ];
                for (let x of x_coords) {
                    // console.log(index, x, prevGame, ladderInfo[prevGame.postRank].sumbase, prevChange);
                    layout.shapes.push({
                        type: "line",
                        x0: x,
                        x1: x,
                        y0: y_coords[1],
                        y1: y_coords[2],
                        xref: "x",
                        yref: "y",
                        line: {
                            color: "black",
                            width: 0.5,
                            dash: "solid",
                        },
                    });
                }
                for (let y of y_coords)
                    layout.shapes.push({
                        type: "line",
                        x0: x_coords[0],
                        x1: x_coords[1],
                        y0: y,
                        y1: y,
                        xref: "x",
                        yref: "y",
                        line: {
                            color: "black",
                            width: 0.5,
                            dash: "solid",
                        },
                    });
                layout.annotations.push({
                    x: prevChange,
                    y: y_coords[1] + 5,
                    text: prevGame.postRank,
                    showarrow: false,
                    xanchor: "left",
                    yanchor: "bottom",
                    font: { size: 10, color: "black" },
                });

                prevChange = index;
            }
            prevGame = game;
        }

        Plotly.newPlot(this.RankPointChart, traces, layout);
        this.relayout();
    }
}

//   "sctype": "a",
//   "playernum": 4,
//   "playerlevel": 0,
//   "playlength": 2,
//   "kuitanari": 1,
//   "akaari": 1,
//   "speed": 0,

// Room codes:
// 4NEKA-
// 4 = 4 player
// N = ippan
// E = East only
// K = Kuitan (Open tanyao)
// A = Aka 5s
// - = no special rule?
async function main() {
    let players = JSON.parse(localStorage.getItem("tenhou_players") || '[""]');
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
        new Player(chart, p);
    }
}

main();
