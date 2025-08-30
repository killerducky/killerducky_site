import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import mysql from "mysql2/promise";
import compression from "compression";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_DATA_BASE_FILENAME = "json_db/amae_data";
const app = express();
const PORT = 3000;
const s0 = "https://5-data.amae-koromo.com/api/v2/pl4/";
// # 12 = 4p Hanchan Jade room, 9 = 4p Hanchan Gold room
// # 11 = 4p Tonpuusen Jade room, 8 = 4p Tonpuusent Gold room
const mode = "16,15,12,11,9,8";
const db = await initializeDatabase();
const MJS_DATE_LIMIT = 1262304000000; // 2010-01-01 in milliseconds

async function initializeDatabase() {
    const db = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "mahjong",
        password: process.env.DB_PASS || "strongpassword",
        database: process.env.DB_NAME || "mahjong_stats",
    });

    await db.execute("CREATE DATABASE IF NOT EXISTS mahjong_stats");
    await db.execute(`
        CREATE TABLE IF NOT EXISTS player_stats (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nickname VARCHAR(255) NOT NULL,
            pidx INT NOT NULL,
            info JSON,
            games JSON,
            UNIQUE KEY unique_player (nickname, pidx)
        )
    `);
    return db;
}

async function addPlayer(nickname, pidx, infoObj, gamesObj) {
    const sql = `
    INSERT INTO player_stats (nickname, pidx, info, games)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      info = VALUES(info),
      games = VALUES(games)
  `;

    await db.execute(sql, [nickname, pidx, JSON.stringify(infoObj), JSON.stringify(gamesObj)]);
}

async function getPlayer(nickname, pidx) {
    const sql = `
    SELECT * FROM player_stats
    WHERE nickname = ? AND pidx = ?
  `;

    const [rows] = await db.execute(sql, [nickname, pidx]);

    if (rows.length === 0) return null;

    const player = rows[0];

    // Parse JSON columns
    return {
        info: player.info,
        games: player.games,
    };
}

app.use(compression());
app.use(express.static(__dirname));
// app.use((req, res, next) => {
//     res.setHeader("Cache-Control", "no-store");
//     next();
// });

// Endpoint to fetch player data (avoids CORS issues)
app.get("/player/:nickname/:pidx", async (req, res) => {
    try {
        const pname = req.params.nickname;
        const pidx = req.params.pidx;
        const url = `https://5-data.amae-koromo.com/api/v2/pl4/search_player/${pname}`;

        console.log("server fetch", pname, pidx);
        let res1 = await fetch(url);
        let data1 = await res1.json();
        if (data1.length == 0) {
            res.status(404).json({ error: "Player not found" });
            return;
        }
        const result = data1[pidx];

        let dbPlayerData = await getPlayer(pname, pidx);
        if (dbPlayerData) {
            console.log("DB Player:", dbPlayerData.info.latest_timestamp, dbPlayerData.games.length);
            if (dbPlayerData.info.latest_timestamp == result.latest_timestamp) {
                console.log("latest_timestamp match, no new games");
                res.json(dbPlayerData);
                return;
            }
        } else {
            dbPlayerData = {};
        }
        dbPlayerData.info = result; // update info

        // for debug write to file
        // await fs.writeFile(`${JSON_DATA_BASE_FILENAME}_${pname}_${pidx}.json`, JSON.stringify(dbPlayerData, null, 2));
        // dbPlayerData.games.slice(0, 2).forEach((g) => {
        //     console.log("db:", g.uuid);
        // });

        // let latest_timestamp = dbPlayerData.info.latest_timestamp * 1000;
        // let now = new Date();
        // console.log(latest_timestamp, now.getTime(), now - latest_timestamp, (now - latest_timestamp) / 1000 / 60 / 60);
        // console.log(new Date(latest_timestamp).toString());
        // console.log(now.toString());

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        let games = [];
        let start = result.latest_timestamp;

        // Either set a very old date limit, or the start time of the most recent game we have in the DB
        // The API returns seconds.
        // Use seconds for all these variables, and convert to ms in the actual fetch URL
        let date_limit = MJS_DATE_LIMIT / 1000;
        if (dbPlayerData.games && dbPlayerData.games.length > 0) {
            // date_limit = dbPlayerData.games[0].startTime;  // one game overlap
            date_limit = dbPlayerData.games[0].startTime + 1; // no overlap
            // so the date_limit is exclusive -- does not include games that start on this timestamp
        }
        for (let i = 0; i < 20; i++) {
            console.log("start", start);
            // testing shows ${start}000 will work, but just leave it as is
            let s1 = `${s0}player_records/${result.id}/${start}999/${date_limit}000?limit=500&mode=${mode}&descending=true&tag=`;
            const res2 = await fetch(s1);
            const these_games = await res2.json();
            console.log(these_games.length, s1);
            // these_games.slice(0, 5).forEach((g) => {
            //     console.log(g.uuid, start - g.startTime, date_limit - g.startTime);
            // });
            await delay(10);
            const length = these_games.length;
            if (length == 0) {
                break;
            }
            start = these_games[these_games.length - 1].startTime - 1;
            games = games.concat(these_games);
            if (length < 500) {
                break;
            }
        }
        // Combine new games with existing ones
        dbPlayerData.games = [...games, ...(dbPlayerData.games || [])];
        await addPlayer(pname, pidx, dbPlayerData.info, dbPlayerData.games);
        res.json(dbPlayerData);
    } catch (err) {
        console.log("Error caught");
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
