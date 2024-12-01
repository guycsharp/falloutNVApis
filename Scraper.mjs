import cheerio from 'cheerio';
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

        $('.wikitable tr').each((index, element) => {
            const quest = $(element).find('td').first().text().trim();
            if (quest) {
                quests.push(quest);
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
