import express from 'express';
import Scraper from './Scraper.mjs';

const app = express();
const port = 3000;

const url = 'https://fallout.fandom.com/wiki/Fallout:_New_Vegas_quests';
const scraper = new Scraper(url);

app.get('/quests', async (req, res) => {
    try {
        const quests = await scraper.getQuests();
        res.json(quests);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the quests.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
