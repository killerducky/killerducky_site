import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import mysql from "mysql2/promise";
import compression from "compression";
import cors from "cors";

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
        host: process.env.DB_HOST || "mahjong-mysql",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "rootpass",
        database: process.env.DB_NAME || "mahjong",
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
app.use(cors());
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
        if (!result) {
            res.status(404).json({ error: "Player index not found" });
            return;
        }

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
            // testing shows ${start}000 will work, but just leave it as is
            let s1 = `${s0}player_records/${result.id}/${start}999/${date_limit}000?limit=500&mode=${mode}&descending=true&tag=`;
            const res2 = await fetch(s1);
            const these_games = await res2.json();
            console.log(these_games.length);
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

app.get("/api/tenhou/nodocchi_listuser/:nickname", async (req, res) => {
    try {
        const pname = req.params.nickname;
        console.log(`server fetch ${pname}`);
        const url = "https://nodocchi.moe";
        let s1 = `${url}/api/listuser.php?name=${pname}`;
        let res1 = await fetch(s1);
        let data = await res1.json();

        // let s2 = `${url}/tenhoulog/#!&name=${pname}`;
        // let res2 = await fetch(s2);
        // let data2 = await res2.text();
        // data.html = data2;

        // console.log(data);
        // console.log(JSON.stringify(data, null, 2));
        // cache headers (valid for 2 minutes) -- should cut 90% of the users doing quick multiple refreshes
        res.set("Cache-Control", "public, max-age=180");
        res.json(data);
    } catch (err) {
        console.log("Error caught");
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// Do I still need this? Jekyll/nginx is serving the static files
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "index.html"));
// });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
