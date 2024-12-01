import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

class Scraper {
    constructor(url) {
        this.url = url;
    }

    async fetchHTML() {
        const response = await fetch(this.url);
        const html = await response.text();
        return html;
    }

    parseQuests(html) {
        const $ = cheerio.load(html);
        const quests = [];

        $('.va-table tbody tr').each((index, element) => {
            const iconUrl = $(element).find('td:nth-child(1) img').attr('src');
            const name = $(element).find('td:nth-child(2) a').text().trim();
            const location = $(element).find('td:nth-child(3) a').text().trim();
            const givenBy = $(element).find('td:nth-child(4) a').text().trim();
            const reward = $(element).find('td:nth-child(5)').html().replace(/<br>/g, '\n').trim();
            const questId = $(element).find('td:nth-child(7) .va-formid').text().trim(); // Note the 7th column for questId

            if (name) {
                quests.push({
                    iconUrl,
                    name,
                    location,
                    givenBy,
                    reward,
                    questId
                });
            }
        });

        return quests;
    }

    async getQuests() {
        const html = await this.fetchHTML();
        const quests = this.parseQuests(html);
        return quests;
    }
}

export default Scraper;
