import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

class Scraper {
    constructor(url) {
        this.url = url;
    }

    async fetchHTML() {
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            return html;
        } catch (error) {
            console.error('Error fetching HTML:', error);
            throw error;
        }
    }

    parseQuests(html) {
        try {
            const $ = cheerio.load(html);
            const quests = [];
            let currentSection = '';

            $('*').each((index, element) => {
                const tag = $(element).prop('tagName').toLowerCase();

                if (tag === 'p') {
                    const paragraphText = $(element).text().trim();
                    const match = paragraphText.match(/the (.*) add-on\./i) || paragraphText.match(/part of the (.*) quest arc/i);
                    if (match && match[1]) {
                        currentSection = match[1];
                    }
                } else if (tag === 'table' && $(element).hasClass('va-table')) {
                    $(element).find('tbody tr').each((index, element) => {
                        const iconUrl = $(element).find('td:nth-child(1) img').attr('src') || '';
                        const name = $(element).find('td:nth-child(2) a').text().trim();
                        const location = $(element).find('td:nth-child(3)').text().trim();
                        const givenBy = $(element).find('td:nth-child(4)').text().trim();
                        const rewardElement = $(element).find('td:nth-child(5)').html();
                        const reward = rewardElement ? rewardElement.replace(/<br>/g, '\n').trim() : '';
                        const questId = $(element).find('td:nth-child(6) .va-formid').text().trim() || $(element).find('td:nth-child(7) .va-formid').text().trim();

                        if (name) {
                            quests.push({
                                iconUrl,
                                name,
                                location,
                                givenBy,
                                reward,
                                questId,
                                section: currentSection
                            });
                        }
                    });
                }
            });

            return quests;
        } catch (error) {
            console.error('Error parsing quests:', error);
            throw error;
        }
    }

    async getQuests() {
        try {
            const html = await this.fetchHTML();
            const quests = this.parseQuests(html);
            return quests;
        } catch (error) {
            console.error('Error in getQuests:', error);
            throw error;
        }
    }
}

export default Scraper;
