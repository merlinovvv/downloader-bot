
require('dotenv').config();
const token = process.env.BOT_API;

const http = require('http');
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});
server.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port ${process.env.PORT || 5000}`);
});

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });
const tiktokVideoDownloader = require('tiktok-video-downloader')

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! Send me a link to a TikTok video and I will download it. 🤖');
});

var isLoading = false;

function isTikTokLink(link) {
    if (link && link.includes('https://www.tiktok.com/') || link.includes('https://vm.tiktok.com')) {
        return true;
    }
}

bot.on('message', async (msg) => {
    if (isLoading) {
        return
    }
    const chatId = msg.chat.id;
    const linkVideo = msg.text;
    if (isTikTokLink(linkVideo)) {
        bot.sendChatAction(chatId, 'upload_video');
        isLoading = true;
        const video = await tiktokVideoDownloader.getInfo(linkVideo).then((result) => result.video.url.no_wm);
        bot.sendVideo(chatId, video);
        isLoading = false;
    } else if (msg.text !== '/start') {
        bot.sendMessage(chatId, 'Sorry, but i do not understand you. Better send me a link to the video 🤖');
    }
})

