import Scraper from "./Scraper.js";

const url = 'https://fallout.fandom.com/wiki/Fallout:_New_Vegas_quests';
const scraper = new Scraper(url);

scraper.getQuests().then(quests => {
    console.log(quests);
}).catch(error => {
    console.error('Error:', error);
});
