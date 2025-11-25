// import fs from "fs/promises";
import * as utils from "./utils.js";

async function getJson(pname) {
  let res = await fetch(`/api/tenhou/nodocchi_listuser/${pname}`);
  if (!res.ok) {
    return null;
  }
  let data = await res.json();
  return data;
  // console.log(JSON.stringify(data, null, 2));
}

function cleanQuotes(s) {
  return s.replace(/^"=""(.*)?"""$/, "$1");
}

let jsonPlayerlevel2RoomLong = {
  0: "Ippan",
  1: "Joukyu",
  2: "Tokujou",
  3: "Houou",
};
let jsonPlayerlevel2Room = {
  0: "N",
  1: "A",
  2: "E",
  3: "P",
};
let playlength2Str = {
  1: "E",
  2: "S",
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
    ladderInfo[rank].sumbase =
      ladderInfo[prevRank].sumbase +
      ladderInfo[prevRank].target -
      ladderInfo[prevRank].base;
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
// Room codes:
// 4NEKA-
// 4 = 4 player
// N = ippan
// E = East only
// K = Kuitan (Open tanyao)
// A = Aka 5s
// - = no special rule?
function getTypeStr(game) {
  let typeStr = "";
  typeStr += `${game.playernum}`;
  typeStr += `${jsonPlayerlevel2Room[game.playerlevel]}`;
  typeStr += `${game.playlength == 1 ? "E" : "S"}`;
  typeStr += `${game.kuitanari ? "K" : "?"}`;
  typeStr += `${game.akaari ? "A" : "?"}`;
  typeStr += `-`;
  return typeStr;
}

class Player {
  constructor(chartContainerEl, pname) {
    this.chartContainerEl = chartContainerEl;
    this.generateBtn = this.chartContainerEl.querySelector(".generate");
    this.pnameBtn = this.chartContainerEl.querySelector(".pname");
    this.pnameBtn.value = pname;
    this.ESChart = this.chartContainerEl.querySelector(".chart-tenhou-es");
    this.RankPointChart =
      this.chartContainerEl.querySelector(".chart-tenhou-rank");
    this.lastN = this.chartContainerEl.querySelector(".lastn");
    this.lastN.addEventListener("change", () => {
      this.relayout();
    });
    this.generateBtn.addEventListener("click", async () => {
      document.documentElement.style.cursor = "wait";
      this.generateBtn.disabled = true;
      await this.generate();
      document.documentElement.style.cursor = "default";
      this.generateBtn.disabled = false;
    });
    utils.handleSteppers(chartContainerEl);
  }
  relayout() {
    let xMax = this.RankPointChart.data[0].x.length + 1;
    let xMin = Math.max(0, xMax - this.lastN.value);
    Plotly.relayout(this.ESChart, {
      "xaxis.range": [xMin, xMax + 2],
      // "yaxis.range": [2.5 - 0.3, 2.5 + 0.3],
    });
    Plotly.relayout(this.RankPointChart, {
      "xaxis.range": [xMin, xMax + 2],
    });
  }

  chartRankPoints(games) {
    let pname = this.pnameBtn.value;
    let traces = [];
    const x = games.map((_, i) => i + 1); // x-axis: game numbers
    traces.push({
      x: x,
      y: games.map((game) => {
        return game.postSumRankPoints;
      }),
      text: games.map((game) => {
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
    for (let [index, game] of games.entries()) {
      // Demotion/promotion or last section
      if (
        (prevGame && prevGame.postRank != game.postRank) ||
        index == games.length - 1
      ) {
        // draw vertical lines
        let x_coords = [prevChange + 1, index + 1];
        let y_coords = [
          ladderInfo[prevGame.postRank].sumbase,
          ladderInfo[prevGame.postRank].sumbase +
            ladderInfo[prevGame.postRank].target -
            ladderInfo[prevGame.postRank].base,
          ladderInfo[prevGame.postRank].sumbase -
            ladderInfo[prevGame.postRank].base,
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
    // TODO: This is conflicting with double click (and also ugly alert right now)
    // this.RankPointChart.on("plotly_click", function (data) {
    //     if (data.points.length > 0) {
    //         let game = games[data.points[0].x];
    //         alert(`${game.postRank}, ${game.postRankPoints}, ${game.datestring}`);
    //     }
    // });
  }

  chartES(games) {
    let pname = this.pnameBtn.value;
    let traces = [];
    let windowSizes = [100, 400];
    const x = games.map((_, i) => i + 1); // x-axis: game numbers
    for (let [lambdaStr, lambdaFunc] of [
      ["EMA", utils.exponential_moving_average],
    ]) {
      for (const [key, value] of Object.entries(jsonPlayerlevel2RoomLong)) {
        for (const [lenKey, lenValue] of Object.entries(playlength2Str)) {
          console.log(key, value, lenKey, lenValue);
          if (lenValue == "E") {
            // continue; // TODO: Merging these is kinda weird. Maybe allow user to pick E or S?
          }
          let numMatch = games.filter(
            (game) => game.playerlevel == key && game.playlength == lenKey
          ).length;
          // let attr = games.map((game) => (game.playerlevel == key && game.playlength == lenKey ? game.playerPlace : null));
          this.normRank = games[games.length - 1].currRank;
          let attr = games.map((game) => {
            if (!(game.playerlevel == key && game.playlength == lenKey)) {
              return null;
            }
            return this.calcRankPointChange(game, this.normRank);
          });
          if (numMatch / games.length < 0.05) {
            continue;
          }
          for (let windowSize of windowSizes) {
            let ema = utils.calcMovingAverage(attr, windowSize, lambdaFunc);
            traces.push({
              x: x,
              y: ema,
              mode: "lines",
              text: ema.map((y) => {
                return y === null
                  ? ""
                  : `${y.toFixed(1)}<br>${value} ${lenValue}<br>${lambdaStr} ${windowSize}`;
              }),
              name: `${value} ${lenValue} ${lambdaStr} ${windowSize}`, // e.g. "Joukyu S EMA 400"
              hovertemplate: "%{text}<extra></extra>",
            });
          }
        }
      }
    }
    let layout = {
      title: {
        text: `Expected Rank Point Change per Match for ${pname} assuming ${this.normRank}`,
      },
      margin: { t: 50, b: 50, l: 60, r: 60 },
      xaxis: {
        title: { text: "Game #", standoff: 10 },
        // linecolor: "black",
        // mirror: true,
      },
      yaxis: {
        title: { text: "Expected Rank Point Change", standoff: 10 },
        // linecolor: "black",
        // mirror: true,
      },
      legend: {
        x: 0.5,
        y: -0.15,
        xanchor: "center",
        yanchor: "top",
        orientation: "h",
      },
      hovermode: "x",
      shapes: [],
      annotations: [],
    };
    for (let rankLine of ladderOrder) {
      if (!rankLine.endsWith("d")) continue;
      layout.shapes.push({
        type: "line",
        x0: 0,
        x1: 1,
        y0: (ladderInfo[this.normRank].last - ladderInfo[rankLine].last) / 4.0,
        y1: (ladderInfo[this.normRank].last - ladderInfo[rankLine].last) / 4.0,
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
        y:
          (ladderInfo[this.normRank].last - ladderInfo[rankLine].last) / 4.0 +
          1,
        xref: "paper",
        yref: "y",
        text: rankLine,
        showarrow: false,
        xanchor: screenLeft,
        font: {
          color: "blue",
          size: 12,
        },
      });
    }
    Plotly.newPlot(this.ESChart, traces, layout);
    // TODO: This is conflicting with double click (and also ugly alert right now)
    // this.RankPointChart.on("plotly_click", function (data) {
    //     if (data.points.length > 0) {
    //         let game = games[data.points[0].x];
    //         alert(`${game.postRank}, ${game.postRankPoints}, ${game.datestring}`);
    //     }
    // });
  }

  calcRankPointChange(jsonGame, normRank) {
    let rankPointChange =
      deltaPoints[jsonGame.playerlevel][jsonGame.playerPlace];
    if (jsonGame.playerPlace == 4) {
      rankPointChange = ladderInfo[normRank].last;
    }
    // East games are worth 2/3
    if (jsonGame.playlength == 1) {
      rankPointChange = (rankPointChange * 2) / 3;
    }
    return rankPointChange;
  }
  decorateCurrRank(games) {
    let pname = this.pnameBtn.value.trim();
    let currRank = "N";
    let currRankPoints = 0;
    for (const [i, jsonGame] of games.entries()) {
      for (let p = 1; p <= 4; p++) {
        if (jsonGame[`player${p}`] == pname) {
          jsonGame.playerPlace = p;
        }
      }

      if ("lobby" in jsonGame) {
        continue;
      }
      jsonGame.currRank = currRank;
      jsonGame.currRankPoints = currRankPoints;
      jsonGame.currSumRankPoints =
        currRankPoints +
        ladderInfo[currRank].sumbase -
        ladderInfo[currRank].base;

      let rankPointChange =
        deltaPoints[jsonGame.playerlevel][jsonGame.playerPlace];
      if (jsonGame.playlength == 1) {
        rankPointChange = (rankPointChange * 2) / 3;
      }
      rankPointChange = this.calcRankPointChange(jsonGame, jsonGame.currRank);
      currRankPoints += rankPointChange;
      if (currRankPoints >= ladderInfo[currRank].target) {
        currRank = promoteRank(currRank);
        currRankPoints = ladderInfo[currRank].base;
      } else if (currRankPoints < 0) {
        currRank = demoteRank(currRank);
        currRankPoints = ladderInfo[currRank].base;
      }
      jsonGame.postRank = currRank;
      jsonGame.postRankPoints = currRankPoints;
      jsonGame.postSumRankPoints =
        currRankPoints +
        ladderInfo[currRank].sumbase -
        ladderInfo[currRank].base;
      // console.log(i, currRank, currRankPoints, currRankPoints + ladderInfo[currRank].sumbase);
    }
  }

  async generate() {
    let pname = this.pnameBtn.value.trim();
    localStorage.setItem(`tenhou_players`, `["${pname}"]`);
    let jsonData;
    // for now don't cache
    // jsonData = JSON.parse(localStorage.getItem(`tenhou_${pname}`)) || (await getJson(pname));
    jsonData = await getJson(pname);
    // localStorage.setItem(`tenhou_${pname}`, JSON.stringify(jsonData));

    if (!jsonData || jsonData.list.length == 0) {
      alert(`Zero 4 player games for Name:${pname}`);
      return;
    }

    jsonData.list.map(
      (jsonGame) =>
        (jsonGame.datestring = new Date(
          jsonGame.starttime * 1000
        ).toISOString())
    );

    let filteredGames = jsonData.list;
    for (let i = filteredGames.length - 1; i >= 1; i--) {
      let gap = filteredGames[i].starttime - filteredGames[i - 1].starttime;
      if (gap >= 86400 * 181) {
        console.log(
          `Assuming account reset on ${filteredGames[i].datestring} due to ${(gap / 60 / 60 / 24).toFixed(0)} day gap`
        );
        filteredGames = filteredGames.slice(i);
        break;
      }
    }
    // Filter out games:
    // Omit games that have a lobby field (= custom non-ladder game)
    // Only 4 player games
    filteredGames = filteredGames.filter((g) => {
      return !("lobby" in g) && g.playernum == 4;
    });

    if (filteredGames.length == 0) {
      alert(`Zero 4 player games for Name:${pname}`);
      return;
    }
    if (filteredGames.length == 1) {
      // TODO: Fix fence post issues. For now just refuse to graph the 1 game case
      alert(`Only one 4 player games for Name:${pname}`);
      return;
    }
    console.log("First game is: ", filteredGames[0]);

    this.decorateCurrRank(filteredGames);
    console.log(jsonData);
    console.log(filteredGames);

    this.chartES(filteredGames);
    this.chartRankPoints(filteredGames);
    this.relayout();
    utils.plotlyTooltipSetup();
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
