"use strict";
const { downloadContentFromMessage } = require("@adiwajshing/baileys")
const fs = require ("fs");
const cheerio = require("cheerio")
const moment = require("moment-timezone");
const Dym = require("didyoumean");
const util = require("util");
const imageToBase64 = require('image-to-base64');
const { exec, spawn } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const xfar = require('xfarr-api');
const acrcloud = require("acrcloud");
const axios = require("axios");
const hxz = require("hxz-api");
const ra = require("ra-api");
const kotz = require("kotz-api");
const yts = require("yt-search");
const speed = require("performance-now");
const translate = require("@vitalets/google-translate-api");
const request = require("request");
const FormData = require("form-data");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
const ms = require("parse-ms");
const mumaker = require("mumaker")
const toMS = require("ms");
const { Aki } = require("aki-api")
const clph = require("caliph-api");
const nou = require("node-os-utils");
let { sizeFormatter } = require("human-readable");
let format = sizeFormatter({
  std: "JEDEC", // 'SI' (default) | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
});

// Exif
const Exif = require("../lib/exif")
const exif = new Exif()

// Lib
const afk = require("../lib/afk");
const { color, bgcolor } = require('../lib/color')
const { getBuffer, fetchJson, fetchText, getRandom, getGroupAdmins, runtime, sleep, generateProfilePicture, reSize, makeid, removeEmojis, calculate_age} = require("../lib/myfunc");
const { webp2mp4File } = require("../lib/convert")
const { pinterest } = require("../lib/pinterest")
const { isLimit, limitAdd, getLimit, giveLimit, addBalance, kurangBalance, getBalance, isGame, gameAdd, givegame, cekGLimit } = require("../lib/limit");
const { isTicTacToe, getPosTic } = require("../lib/tictactoe");
const { telesticker } = require("../lib/telestick")
const { igdl } = require("../lib/igdl");
const { getUser, getPost, searchUser, igstory } = require("../lib/instagram")
const { addPlayGame, getJawabanGame, isPlayGame, cekWaktuGame, getGamePosi } = require("../lib/game");
const { casinoSave, setCasino, deleteCasino } = require("../lib/casino");
const { isSetWelcome, addSetWelcome, changeSetWelcome, removeSetWelcome } = require('../lib/setwelcome');
const { isSetLeft, addSetLeft, removeSetLeft, changeSetLeft } = require('../lib/setleft');
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('../lib/respon-list');
const { addRespons, checkRespons, deleteRespons } = require('../lib/respon');
const { isSetProses, addSetProses, removeSetProses, changeSetProses, getTextSetProses } = require('../lib/setproses');
const { isSetDone, addSetDone, removeSetDone, changeSetDone, getTextSetDone } = require('../lib/setdone');
const { isSetOpen, addSetOpen, removeSetOpen, changeSetOpen, getTextSetOpen } = require("../lib/setopen");
const { isSetClose, addSetClose, removeSetClose, changeSetClose, getTextSetClose } = require("../lib/setclose");
const { TelegraPh, UploadFileUgu } = require('../lib/uploader');
const { goLens } = require("../lib/googlens");
const { yta, ytv } = require("../lib/ytdl");
const { TiktokDownloader } = require("../lib/tiktokdl");
const tictac = require("../lib/tictac");
const _prem = require("../lib/premium");
const _sewa = require("../lib/sewa");
const msgFilter = require("../lib/antispam");
const { writeExif } = require("../lib/exif2");

// Database
let pendaftar = JSON.parse(fs.readFileSync('./database/user/user.json'))
let mess = JSON.parse(fs.readFileSync('./message/response.json'));
let premium = JSON.parse(fs.readFileSync('./database/limit/premium.json'));
let balance = JSON.parse(fs.readFileSync('./database/limit/balance.json'));
let limit = JSON.parse(fs.readFileSync('./database/limit/limit.json'));
let glimit = JSON.parse(fs.readFileSync('./database/limit/glimit.json'));
let antilink = JSON.parse(fs.readFileSync('./database/group/antilink.json'));
let antiwame = JSON.parse(fs.readFileSync('./database/group/antiwame.json'));
let anonymous = JSON.parse(fs.readFileSync('./database/anonymous/anonymous.json'));
let listCmd = JSON.parse(fs.readFileSync('./database/storage/listcmd.json'));
let _cmd = JSON.parse(fs.readFileSync('./database/storage/command.json'));
let _cmdUser = JSON.parse(fs.readFileSync('./database/storage/commandUser.json'));
let responDB = JSON.parse(fs.readFileSync('./database/storage/respon.json'));
let listStore = JSON.parse(fs.readFileSync('./database/storage/list-message.json'));

// DB Game
let tictactoe = [];
let tebakgambar = [];
let kuis = []
let tebaklagu = [];
// let family100 = [];
let akinator = {}

// Auto Reset Limit
setInterval(function() { 
    var jamna = new Date().toLocaleTimeString('en-US', { timeZone: "Asia/Jakarta" });
    var hasilnes = jamna.split(':')[0] < 10 ? '0' + jamna : jamna
    // hasilnes Kalo mau Jam 00 jadi 12:00:00 AM
    if(hasilnes === '12:00:00 AM') {
        limit = []
        fs.writeFileSync('./database/limit/limit.json', JSON.stringify(limit))
        glimit = []
        fs.writeFileSync('./database/limit/glimit.json', JSON.stringify(glimit))
        console.log("Limit Sudah Di Reset!")
    }
}, 1000);

// Bandwidth
async function checkBandwidth() {
    let ind = 0;
    let out = 0;
    for (let i of await require("node-os-utils").netstat.stats()) {
        ind += parseInt(i.inputBytes);
        out += parseInt(i.outputBytes);
    }
    return {
        download: format(ind),
        upload: format(out),
    };
}

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async(hinata, msg, m, setting, store, welcome, left, set_welcome_db, set_left_db, db_respon_list, sewa, opengc, _afk, set_proses, set_done, set_open, set_close) => {
    try {
        let { ownerNumber, ownerName, botName, footer, lolkey, youtube, instagram, gamewaktu, limitCount, sticker: stc } = setting
        let { allMenu, donate } = require('./help')
        const { type, quotedMsg, now, fromMe, mentioned } = msg
        if (msg.isBaileys) return
        const tanggal = moment().tz("Asia/Jakarta").format("dddd, ll")
        const jam = moment().format("HH:mm:ss z")
        let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
        var fildt = dt == 'pagi' ? dt + '🌝' : dt == 'siang' ? dt + '🌞' : dt == 'sore' ? dt + '🌝' : dt + '🌚'
        const ucapanWaktu = fildt.charAt(0).toUpperCase() + fildt.slice(1)
        const content = JSON.stringify(msg.message)
        const from = msg.key.remoteJid
        const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type == "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (type == "messageContextInfo") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
        const toJSON = j => JSON.stringify(j, null,'\t')
        if (hinata.multi) {
        	var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°▸π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
        } else {
        	if (hinata.nopref) {
                prefix = ''
        	} else {
                prefix = hinata.prefa
        	}
        }
        const args = chats.split(' ')
        const command = chats.toLowerCase().split(' ')[0] || ''
        const isCmd = command.startsWith(prefix)
        const isGroup = msg.key.remoteJid.endsWith('@g.us')
        const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
        const isOwner = ownerNumber.includes(sender)
        const pushname = msg.pushName
        const q = chats.slice(command.length + 1, chats.length)
        const body = chats.startsWith(prefix) ? chats : ''
        const botNumber = hinata.user.id.split(':')[0] + '@s.whatsapp.net'
        const groupMetadata = isGroup ? await hinata.groupMetadata(from) : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const groupId = isGroup ? groupMetadata.id : ''
        const groupMembers = isGroup ? groupMetadata.participants : ''
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isGroupAdmins = groupAdmins.includes(sender)
        const isUser = pendaftar.includes(sender)
        const isAfkOn = afk.checkAfkUser(sender, _afk)
        const isPremium = isOwner ? true : _prem.checkPremiumUser(sender, premium)
        const isSewa = _sewa.checkSewaGroup(from, sewa)
        const isAntiLink = antilink.includes(from) ? true : false
        const isAntiWame = antiwame.includes(from) ? true : false
        const isWelcome = isGroup ? welcome.includes(from) ? true : false : false
        const isLeft = isGroup ? left.includes(from) ? true : false : false

        const gcounti = setting.gcount
        const gcount = isPremium ? gcounti.prem : gcounti.user

        let timestamp = speed();
        let latensi = speed() - timestamp

        const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []
        
        let ytPaiz_01 = 'https://youtube.com/channel/UCR2iLtp3jno9K9F9ObSiwbg'
        let footxt = `${footer} © 2022`
        let thumb = fs.readFileSync(setting.pathimg)
        let mark = '0@s.whatsapp.net'

        async function downloadAndSaveMediaMessage (type_file, path_file) {
        	if (type_file === 'image') {
                var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                	buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
        	} else if (type_file === 'video') {
                var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                	buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
        	} else if (type_file === 'sticker') {
                var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                	buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
        	} else if (type_file === 'audio') {
                var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
                let buffer = Buffer.from([])
                for await(const chunk of stream) {
                	buffer = Buffer.concat([buffer, chunk])
                }
                fs.writeFileSync(path_file, buffer)
                return path_file
        	}
        }
        const sendFileFromUrl = async (from, url, caption, options = {}) => {
            let mime = '';
            let res = await axios.head(url)
            mime = res.headerd["content-type"]
            let type = mime.split("/")[0]+"Message"
            if (mime.split("/")[0] === "image") {
               var img = await getBuffer(url)
               return hinata.sendMessage(from, { image: img, caption: caption }, options)
            } else if (mime.split("/")[0] === "video") {
               var vid = await getBuffer(url)
               return hinata.sendMessage(from, { video: vid, caption: caption }, options)
            } else if (mime.split("/")[0] === "audio") {
               var aud = await getBuffer(url)
               return hinata.sendMessage(from, { audio: aud, mimetype: 'audio/mp3' }, options)
            } else {
               var doc = await getBuffer(url)
               return hinata.sendMessage(from, { document: doc, mimetype: mime, caption: caption }, options)
            }
        }
        async function sendPlay(from, query) {
            var url = await yts(query)
            url = url.videos[0].url
            hxz.youtube(url).then(async(data) => {
                var button = [{ urlButton: { displayText: `Source Code`, url: `${url}` } }, { quickReplyButton: { displayText: `🎵 Audio`, id: `${prefix}ytmp3 ${url}` } }, { quickReplyButton: { displayText: `🎥 Video`, id: `${prefix}ytmp4 ${url}` } }]
                // var button = [{ buttonId: `!ytmp3 ${url}`, buttonText: { displayText: `🎵 Audio (${data.size_mp3})` }, type: 1 }, { buttonId: `!ytmp4 ${url}`, buttonText: { displayText: `🎥 Video (${data.size})` }, type: 1 }]
                hinata.sendMessage(from, { caption: `*YOUTUBE-DOWNLOADER 📂*\n\n📃 *Title :* ${data.title ? data.title : '-'}\n📸 *Quality :* ${data.quality}\n\n_Silahkan Pilih Format yang ada dibawah_`, image: { url: data.thumb }, templateButtons: button, footer: 'Pilih Salah Satu Button Dibawah⬇️', mentions: [sender] })
           }).catch((e) => {
               hinata.sendMessage(from, { text: mess.error.api }, { quoted: msg })
               ownerNumber.map( i => hinata.sendMessage(from, { text: `Send Play Error : ${e}` }))
           })
        }
        function hitungmundur(bulan, tanggal) {
            let from = new Date(`${bulan} ${tanggal}, 2022 00:00:00`).getTime();
            let now = Date.now();
            let distance = from - now;
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            return days + "Hari " + hours + "Jam " + minutes + "Menit " + seconds + "Detik"
        }
        const isUrl = (url) => {
        	return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
        }
        const isEmoji = (emo) => {
            let emoji_ranges = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
            let regexEmoji = new RegExp(emoji_ranges, 'gi');
            return emo.match(regexEmoji)
        }
        function jsonformat(string) {
            return JSON.stringify(string, null, 2)
        }
        function monospace(string) {
            return '```' + string + '```'
        }
        function randomNomor(min, max = null) {
            if (max !== null) {
        	    min = Math.ceil(min);
        	    max = Math.floor(max);
        	    return Math.floor(Math.random() * (max - min + 1)) + min;
            } else {
        	    return Math.floor(Math.random() * min) + 1
            }
        }
        const pickRandom = (arr) => {
        	return arr[Math.floor(Math.random() * arr.length)]
        }
        function mentions(teks, mems = [], id) {
        	if (id == null || id == undefined || id == false) {
        	    let res = hinata.sendMessage(from, { text: teks, mentions: mems })
        	    return res
        	} else {
                let res = hinata.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
                return res
            }
        }
        const nebal = (angka) => {
            return Math.floor(angka)
        }
        function parseMention(text = '') {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
        }
        const reply = (teks) => {
        	return hinata.sendMessage(from, { text: teks, mentions: parseMention(teks) }, { quoted: msg })
        }
        const fakeDeface = (from, teks, title, description, img, option = {}) => {
            if (!isUrl(teks)) return 'teks harus mengandung url'
            return hinata.sendMessage(from, {
                text: teks,
                title,
                matchedText: isUrl(teks)[0],
                canonicalUrl: isUrl(teks)[0],
                description,
                detectLinks: false,
                jpegThumbnail: img
            }, option)
        }
        const replyDeface = (teks) => {
            return hinata.sendMessage(from, {
                text: teks, contextInfo: {
                    externalAdReply: {
                        title: `${botName}`,
                        body: `Simple Bot WhatsApp By ${ownerName}`,
                        mediaType: 2,
                        thumbnail: thumb,
                        sourceUrl: ytPaiz_01
                    }
                }
            }, { quoted: msg })
        }
        const replyDeface2 = (teks) => {
            return hinata.sendMessage(from, {
                text: teks,
                mentions: parseMention(teks),
                contextInfo: {
                    externalAdReply: {
                        title: `${botName}`,
                        body: `Simple Bot WhatsApp By ${ownerName}`,
                        thumbnail: thumb,
                        mediaType:1,
                        mediaUrl: 'https://chat.whatsapp.com/GtxWnk2n2ryCiwYFWScOk5',
                        sourceUrl: 'https://chat.whatsapp.com/GtxWnk2n2ryCiwYFWScOk5'
                    }
                }
            }, { quoted:msg })
        }
        const textImg = (teks) => {
        	return hinata.sendMessage(from, { text: teks, jpegThumbnail: fs.readFileSync(setting.pathimg), mentions: parseMention(teks) }, { quoted: msg })
        }
        const sendMess = (hehe, teks) => {
        	hinata.sendMessage(hehe, { text, teks })
        }
        const buttonWithText = (from, text, footer, buttons) => {
        	return hinata.sendMessage(from, { text: text, footer: footer, templateButtons: buttons })
        }
        const sendContact = (jid, numbers, name, quoted, mn) => {
        	let number = numbers.replace(/[^0-9]/g, '')
        	const vcard = 'BEGIN:VCARD\n' 
        	+ 'VERSION:3.0\n' 
        	+ 'FN:' + name + '\n'
        	+ 'ORG:;\n'
        	+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
        	+ 'END:VCARD'
        	return hinata.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
        }
        async function getGcName(groupID) {
            try {
                let data_name = await hinata.groupMetadata(groupID)
                return data_name.subject
            } catch (err) {
                return '-'
            }
        }

        /*async function getAtminTag(groupID) {
            try {
                let data_admin = await hinata.groupMetadata(groupID)
                let array_admin = [];
                for (let x of data_admin.participants) {
                    if (x.isAdmin === true) {
                        array_admin.push(x.jid)
                    }
                }
                return array_admin
            } catch (err) {
                return '-'
            }
        }

        async function getAtmin(groupID) {
            try {
                let list_admin = "*ADMIN GROUP:*\n"
                let data_group = await hinata.groupMetadata(groupID)
                for (let x of data_group.participants) {
                    if (x.isAdmin === true) {
                        list_admin += ` ▸ @${x.jid.split('@')[0]}\n`
                    }
                }
                return list_admin.trim()
            } catch (err) {
                return '-'
            }
        }*/

        async function sendStickerFromUrl(from, url, packname1 = stc.packname, author1 = stc.author, options = {}) {
        	var names = Date.now() / 10000;
        	var download = function (uri, filename, callback) {
                request.head(uri, function (err, res, body) {
                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	            });
        	};
            exif.create(packname1, author1, `sendstc_${names}`)
        	download(url, './sticker/' + names + '.png', async function () {
                let filess = './sticker/' + names + '.png'
        	    let asw = './sticker/' + names + '.webp'
        	    exec(`ffmpeg -i ${filess} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${asw}`, async (err) => {
        	        exec(`webpmux -set exif ./sticker/sendstc_${names}.exif ${asw} -o ${asw}`, async (error) => {
                        hinata.sendMessage(from, { sticker: fs.readFileSync(asw) }, options)
                        fs.unlinkSync(filess)
                        fs.unlinkSync(asw)
        	        })
                })
        	})
        }

        const buttonsDefault = [
            { urlButton: { displayText: `YouTube`, url: `${youtube}` } },
        	{ urlButton: { displayText: `Instagram`, url: `${instagram}` } },
        	{ quickReplyButton: { displayText: `🌐 Bot Info`, id: `${prefix}infobot` } },
        	{ quickReplyButton: { displayText: `💰 Donate`, id: `${prefix}donate` } },
            { quickReplyButton: { displayText: `🗒️ Dashboard`, id: `${prefix}dashboard` } }
        ]

        async function akiStart() {
            var data = await fetchJson(`https://api.lolhuman.xyz/api/akinator/start?apikey=${lolkey}`)
            return data
        }

        async function akiAnswer(server, frontaddr, session, signature, step, answer) {
	        var data = await fetchJson(`https://api.lolhuman.xyz/api/akinator/answer?apikey=${lolkey}&server=${server}&frontaddr=${frontaddr}&session=${session}&signature=${signature}&step=${step}&answer=${answer}`)
	        return data
	    }

        async function akiBack(server, frontaddr, session, signature, step, answer) {
            var data = await fetchJson(`https://api.lolhuman.xyz/api/akinator/back?apikey=${lolkey}&server=${server}&frontaddr=${frontaddr}&session=${session}&signature=${signature}&step=${step}&answer=${answer}`)
            return data
        }

        async function akiEnd(server, session, signature, step) {
            var data = await fetchJson(`https://api.lolhuman.xyz/api/akinator/end?apikey=${lolkey}&server=${server}&session=${session}&signature=${signature}&step=${step}`)
            return data
        }

        // Anti Link
        if (isGroup && isAntiLink && !isOwner && !isGroupAdmins && isBotGroupAdmins){
            if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
                if (!isBotGroupAdmins) return replyDeface(`Untung bot bukan admin`)
                replyDeface(`*「 GROUP LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link grup, maaf kamu akan di kick`)
                hinata.groupParticipantsUpdate(from, [sender], "remove")
            }
        }

        // Anti Wame
        if (isGroup && isAntiWame && !isOwner && !isGroupAdmins && isBotGroupAdmins){
            if (chats.match(/(https:\/\/wa.me)/gi)) {
                if (!isBotGroupAdmins) return replyDeface(`Untung bot bukan admin`)
                replyDeface(`*「 NOMOR LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link wa.me, maaf kamu akan di kick`)
                hinata.groupParticipantsUpdate(from, [sender], "remove")
            }
        }

	    async function addCountCmdUser(nama, sender, u) {
            var posi = null
            var pos = null
            Object.keys(u).forEach((i) => {
                if (u[i].jid === sender) {
                    posi = i
                }
            })
            if (posi === null) {
                u.push({jid: sender, db: [{nama: nama, count: 0}]})
                fs.writeFileSync('./database/storage/commandUser.json', JSON.stringify(u, null, 2));
                Object.keys(u).forEach((i) => {
                    if (u[i].jid === sender) {
                        posi = i
                    }
                })
            }
            if (posi !== null) {
                Object.keys(u[posi].db).forEach((i) => {
                    if (u[posi].db[i].nama === nama) {
                        pos = i
                    }
                })
                if (pos === null) {
                    u[posi].db.push({nama: nama, count: 1})
                    fs.writeFileSync('./database/storage/commandUser.json', JSON.stringify(u, null, 2));
                } else {
                    u[posi].db[pos].count += 1
                    fs.writeFileSync('./database/storage/commandUser.json', JSON.stringify(u, null, 2));
                }
            }
        }

        async function getPosiCmdUser(sender, _db) {
            var posi = null
            Object.keys(_db).forEach((i) => {
                if (_db[i].jid === sender) {
                    posi = i
                }
            })
            return posi
        }

        async function addCountCmd(nama, sender, _db) {
            addCountCmdUser(nama, sender, _cmdUser)
            var posi = null
            Object.keys(_db).forEach((i) => {
                if (_db[i].nama === nama) {
                   posi = i
                }
            })
            if (posi === null) {
                _db.push({nama: nama, count: 1})
                fs.writeFileSync('./database/storage/command.json',JSON.stringify(_db, null, 2));
            } else {
                _db[posi].count += 1
                fs.writeFileSync('./database/storage/command.json',JSON.stringify(_db, null, 2));
            }
        }

        // Store
        if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
            var get_data_respon = getDataResponList(from, chats, db_respon_list)
            if (get_data_respon.isImage === false) {
                hinata.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
                    quoted: msg
                })
            } else {
                hinata.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
                    quoted: msg
                })
            }
        }

        const isImage = (type == 'imageMessage')
        const isVideo = (type == 'videoMessage')
        const isSticker = (type == 'stickerMessage')
        const isQuotedMsg = msg.isQuotedMsg
        const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
        const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
        const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
        const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
        const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false

        // Auto Read & Presence Online
        hinata.readMessages([msg.key])
        hinata.sendPresenceUpdate('available', from)

        // Auto Registrasi
        if (isCmd && !isUser) {
            pendaftar.push(sender)
            fs.writeFileSync('./database/user/user.json', JSON.stringify(pendaftar, null, 2))
        }

        // Auto Block +212
        if (sender.startsWith('212')) {
            return hinata.updateBlockStatus(sender, 'block')
        }

        // Mode
        if (hinata.mode === 'self'){
            if (!isOwner && !fromMe) return
        }

        // Premium
        _prem.expiredCheck(hinata, premium)

        // Tictactoe
        if (isTicTacToe(from, tictactoe)) tictac(chats, prefix, tictactoe, from, sender, reply, mentions, addBalance, balance)

        // Game
        cekWaktuGame(from, tebakgambar) // Tebak Gambar
        if (isPlayGame(from, tebakgambar) && isUser) {
            if (chats.toLowerCase() == getJawabanGame(from, tebakgambar)) {
                var htgm = randomNomor(100, 150)
                addBalance(sender, htgm, balance)
                replyDeface(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tebakgambar)}\nHadiah : ${htgm} balance\n\nIngin bermain lagi? ketik *${prefix}tebakgambar*`)
                tebakgambar.splice(getGamePosi(from, tebakgambar), 1)
            }
        }
        cekWaktuGame(from, kuis) // Kuis Game
        if (isPlayGame(from, kuis) && isUser) {
            if (chats.toLowerCase() == getJawabanGame(from, kuis)) {
                var htgm = randomNomor(100, 150)
                addBalance(sender, htgm, balance)
                replyDeface(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, kuis)}\nHadiah : ${htgm} balance\n\nIngin bermain lagi? ketik *${prefix}kuis*`)
                kuis.splice(getGamePosi(from, kuis), 1)
            }
        }
        cekWaktuGame(from, tebaklagu) // Tebak Lagu
        if (isPlayGame(from, tebaklagu) && isUser) {
            if (chats.toLowerCase() == getJawabanGame(from, tebaklagu)) {
                var htl = randomNomor(150, 200)
                addBalance(sender, htl, balance)
                replyDeface(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tebaklagu)}\nHadiah : ${htl} balance\n\nIngin bermain lagi? ketik *${prefix}tebaklagu*`)
                tebaklagu.splice(getGamePosi(from, tebaklagu), 1)
            }
         }
        /*
        cekWaktuGame(from, family100) // Family 100
        if (isPlayGame(from, family100) && isUser) {
            var anjuy = getJawabanGame(from, family100)
            for (let i of anjuy) {
                if (chats.toLowerCase().includes(i)) {
                    var htli = randomNomor(150, 200)
                    addBalance(sender, htli, balance)
                    replyDeface(`*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${i}\nHadiah : ${htli} balance\n\nIngin bermain lagi? ketik *${prefix}family100*`)
                    var anug = anjuy.indexOf(i)
                    anjuy.splice(anug, 1)
                }
            }
            if (anjuy.length < 1) {
                hinata.sendMessage(from, { text: `Semua jawaban sudah tertebak\nKirim *${prefix}family100* untuk bermain lagi` })
                family100.splice(getGamePosi(from, family100), 1)
            }
        }
        */
        
             // Anonymous Chat
            if (!isGroup && !msg.key.fromMe && !isCmd) {
        	this.anonymous = this.anonymous ? this.anonymous : {}
        	let rums = Object.values(this.anonymous).find(room => [room.a, room.b].includes(sender) && room.state == "CHATTING")
        	if (rums) {
        	    var partnerJID = [rums.a, rums.b].find(user => user !== sender)
        	    if (msg.type == "conversation") {
                    hinata.sendMessage(partnerJID, { text: chats })
        	    } else if (msg.type == "extendedTextMessage") {
                    hinata.sendMessage(partnerJID, { text: chats, contextInfo: msg.message["extendedTextMessage"].contextInfo })
        	    } else {
                    var contextInfo = msg.message[msg.type].contextInfo
        	        hinata.sendMessageFromContent(partnerJID, msg.message, { contextInfo })
        	    }
        	}
        }

        if (fs.existsSync(`./database/casino/${from}.json`)) {
            var casinoo = setCasino(`${from}`)
            if (sender == `${casinoo.Y}@s.whatsapp.net` && chats.toLowerCase() == 'n') {
                hinata.sendMessage(from, { text: `「 Game Casino Rejected 」\n\n▸ @${casinoo.Y} Membatalkan Game`, mentions: [casinoo.Y+"@s.whatsapp.net"] }, {quoted: msg })
                deleteCasino(from)
            }
            if (sender == `${casinoo.Y}@s.whatsapp.net` && chats.toLowerCase() == 'y') {
                var angka1 = await randomNomor(10, 20)
                var angka2 = await randomNomor(10, 20)
                if (angka1 > angka2) {
                    starGame =  `🎰 Casino Game 💰

▸ @${casinoo.Z} --> ${angka1} 👑
▸ @${casinoo.Y} --> ${angka2} 🥈

Pemenangnya adalah [ @${casinoo.Z} ]
Mendapatkan: $ ${nebal(casinoo.nominal)}`
                    hinata.sendMessage(from, { text: starGame, mentions: [casinoo.Z + "@s.whatsapp.net",  casinoo.Y + "@s.whatsapp.net"]}, {quoted: msg })
                    await addBalance(`${casinoo.Z}@s.whatsapp.net`, nebal(casinoo.nominal), balance)
                    await kurangBalance(`${casinoo.Y}@s.whatsapp.net`, nebal(casinoo.nominal), balance)
                    deleteCasino(from)
                } else if (angka1 < angka2) {
                    starGame =  `🎰 Casino Game 💰

▸ @${casinoo.Z} --> ${angka1} 🥈
▸ @${casinoo.Y} --> ${angka2} 👑

Pemenangnya adalah [ @${casinoo.Y} ]
Mendapatkan: $ ${nebal(casinoo.nominal)}`
                    hinata.sendMessage(from, { text: starGame, mentions: [casinoo.Z + "@s.whatsapp.net",  casinoo.Y + "@s.whatsapp.net"] }, {quoted: msg })
                    await addBalance(`${casinoo.Y}@s.whatsapp.net`, nebal(casinoo.nominal), balance)
                    await kurangBalance(`${casinoo.Z}@s.whatsapp.net`, nebal(casinoo.nominal), balance)
                    deleteCasino(from)
                } else if (angka1 = angka2) {
                    starGame =  `🎰 Casino Game 💰

▸ @${casinoo.Z} --> ${angka1} 📍
▸ @${casinoo.Y} --> ${angka2} 📍

Games Draw, Tidak Ada Pemenang`
                    hinata.sendMessage(from, { text: starGame, mentions: [casinoo.Z + "@s.whatsapp.net",  casinoo.Y + "@s.whatsapp.net" ]}, { quoted: msg })
                    deleteCasino(from)
                }
            }
        }
        // Auto Write Database Akinator Every 1 Minutes
        setInterval(() => {
            fs.writeFileSync('./database/game/akinator.json', JSON.stringify(akinator, null, 2))
        }, 30 * 1000)

        // Akinator
        if (!isGroup && akinator.hasOwnProperty(sender.split('@')[0]) && !isCmd && ["0", "1", "2", "3", "4"].includes(chats)) {
            var { server, frontaddr, session, signature, question, step } = akinator[sender.split('@')[0]]
            var jwb = (await akiAnswer(server, frontaddr, session, signature, step, chats)).result
            if (jwb.hasOwnProperty('name')) {
                var img = await getBuffer(jwb.image)
                var cpt = `*HASIL DITEMUKAN*\n\nNama : ${jwb.name}\nDeskripsi : ${jwb.description}`
                hinata.sendMessage(from, { image: img, caption: cpt }, { quoted: msg })
                .then( res => {
                    delete akinator[sender.split("@")[0]]
                })
                return
            }
            var jques = jwb.question
            var jstep = jwb.step
            var jteks = `${jques}\n\n`
            jteks += `0 - Ya\n`
            jteks += `1 - Tidak\n`
            jteks += `2 - Tidak Tahu\n`
            jteks += `3 - Mungkin\n`
            jteks += `4 - Mungkin Tidak`
            hinata.sendMessage(from, { text: jteks }, { quoted: msg }).then( res => {
                var jaki = akinator[sender.split("@")[0]]
                jaki.question = jques
                jaki.step = jstep
                akinator[sender.split("@")[0]] = jaki
            })
        }

        // Antispam
        msgFilter.ResetSpam(hinata.spam)

		const spampm = () => {
            console.log(color('[ SPAM ]', 'red'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`))
            msgFilter.addSpam(sender, hinata.spam)
            replyDeface(`Kamu terdeteksi spam bot tanpa jeda, lakukan perintah setelah 5 detik`)
        }
        const spamgr = () => {
            console.log(color('[ SPAM ]', 'red'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
            msgFilter.addSpam(sender, hinata.spam)
            replyDeface(`Kamu terdeteksi spam bot tanpa jeda, lakukan perintah setelah 5 detik`)
        }

        if (isCmd && msgFilter.isFiltered(sender) && !isGroup) return spampm()
        if (isCmd && msgFilter.isFiltered(sender) && isGroup) return spamgr()
        if (isCmd && args[0].length > 1 && !isOwner && !isPremium) msgFilter.addFilter(sender)

		if (chats.startsWith("x ") && isOwner) {
            console.log(color('[ EVAL ]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
            const ev = (sul) => {
                var sat = JSON.stringify(sul, null, 2)
                var bang = util.format(sat)
                if (sat == undefined) {
                    bang = util.format(sul)
                }
                return replyDeface(bang)
            }
            try {
                replyDeface(util.format(eval(`;(async () => { ${chats.slice(2)} })()`)))
            } catch (e) {
                replyDeface(util.format(e))
            }
		} else if (chats.startsWith("$ ") && isOwner) {
            console.log(color('[ EXEC ]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
            exec(chats.slice(2), (err, stdout) => {
                if (err) return replyDeface(`${err}`)
                if (stdout) replyDeface(`${stdout}`)
            })
        } else if (chats.startsWith("> ") && isOwner) {
	        console.log(color('[ EVAL ]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkaokwoak`))
        try {
            let evaled = await eval(chats.slice(2))
            if (typeof evaled !== 'string') evaled = require("util").inspect(evaled)
            replyDeface(`${evaled}`)
        } catch (err) {
            replyDeface(`${err}`)
        }
        }

		// Logs
		if (!isGroup && isCmd && !fromMe) {
		    addBalance(sender, randomNomor(20), balance)
		    console.log(color('[ CMD ]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
		}
		if (isGroup && isCmd && !fromMe) {
		    addBalance(sender, randomNomor(20), balance)
		    console.log(color('[ CMD ]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
		}
        function triggerSticker() {
            try {
                for (let x = 0; x < responDB.length; x++) {
                    if (msg.message.stickerMessage.fileSha256.toString('hex') == responDB[x].hex) {
                        return responDB[x].balasan;
                    }
                }
            } catch {
                return false;
            }
        }
        switch (command || triggerSticker()) {
        case prefix+'menu': case prefix+'help':
            addCountCmd('#menu', sender, _cmd)
            let mundur = hitungmundur(7, 9)
            var { download, upload } = await checkBandwidth();
            var teks = allMenu(ucapanWaktu, pushname, mundur, upload, download, ownerName, botName, jam, tanggal, runtime, isOwner, isPremium, sender, limitCount, limit, gcount, glimit, balance, prefix)
            hinata.send5ButLoc(from, teks, footxt, fs.readFileSync(setting.pathimg), buttonsDefault, { quoted: msg })
            // hinata.sendMessage(from, { document: fs.readFileSync(setting.pathimg), caption: allMenu(ucapanWaktu, pushname, mundur, upload, download, ownerName, botName, jam, tanggal, runtime, isOwner, isPremium, sender, limitCount, limit, gcount, glimit, balance, prefix), mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileName: `© ${ownerName}`, fileLength: '99999999999999', jpegThumbnail: fs.readFileSync(setting.pathimg), footer: footxt, templateButtons: buttonsDefault, mentions: [sender] }, { quoted: msg })
            break
        case prefix+'infobot': case prefix+'info': case prefix+'botinfo':
            addCountCmd('#infobot', sender, _cmd)
            var capt = `_*${botName} Information*_

*▸ Name :* ${hinata.user.name}
*▸ Number :* ${botNumber.split("@")[0]}
*▸ Owner :* ${ownerNumber.split("@")[0]}
*▸ Total Pengguna :* ${pendaftar.length}
*▸ Prefix :* Multi Prefix
*▸ Bot Created On 10 Mei 2022*

_*Special Thanks To :*_
*▸ Allah SWT*
*▸ Adiwajshing/Baileys*
*▸ Irfan*
*▸ Yog Azz*
*▸ Faiz*
*▸ Arthur*
*▸ Riy 04*
*▸ Xcode Team*
*▸ Penyedia Dari :*
   *- Rest Api*
   *- Module*`
            var buts = [
                { urlButton: { displayText: `Instagram`, url: `${instagram}` } },
                { quickReplyButton: { displayText: `💰 Donasi`, id: prefix+'donate' } },
                { quickReplyButton: { displayText: `👑 Owner`, id: prefix+'dev' } }
            ]
            hinata.sendMessage(from, { image: thumb, caption: capt, footer: footxt, templateButtons: buts })
            break
        case prefix+'donate': case prefix+'donasi':
            addCountCmd('#donate', sender, _cmd)
            var butdonate = [ { urlButton: { displayText: `Instagram`, url: `${instagram}` } } ]
            hinata.sendMessage(from, { image: fs.readFileSync('./media/donasi.jpg'), caption: donate(pushname, ownerNumber), footer: footxt, templateButtons: butdonate })
            break;
        case prefix+'script': case prefix+'sc':
            addCountCmd('#script', sender, _cmd)
            let esceh = [
            { urlButton: { displayText: `Subscribe`, url : `${ytPaiz_01}` } }
            ]
            buttonWithText(from, `Bot ini menggunakan Script dari : ${ytPaiz_01}`, footxt, esceh)
            break
        case prefix+'dashboard': case prefix+'dash':
	        addCountCmd('#dashboard', sender, _cmd)
            var posi = await getPosiCmdUser(sender, _cmdUser)
            _cmdUser[posi].db.sort((a, b) => (a.count < b.count) ? 1 : -1)
            _cmd.sort((a, b) => (a.count  < b.count) ? 1 : -1)
            var posi = await getPosiCmdUser(sender, _cmdUser)
            var jumlahCmd = _cmd.length
            if (jumlahCmd > 10) jumlahCmd = 10
            var jumlah = _cmdUser[posi].db.length
            if (jumlah > 5) jumlah = 5
            var totalUser = 0
            for (let x of _cmdUser[posi].db) {
                totalUser = totalUser + x.count
            }
            var total = 0
            for (let o of _cmd) {
                total = total + o.count
            }
            var teks = `*${botName} DASHBOARD*\n\n*HIT*\n▸ GLOBAL : ${total}\n▸ USER : ${totalUser}\n\n`
            teks += `*Most Command Global*\n`
            for (let u = 0; u < jumlahCmd; u ++) {
                teks += `▸ ${_cmd[u].nama} : ${_cmd[u].count}\n`
            }
            teks += `\n*Most Command User*\n`
            for (let i = 0; i < jumlah; i ++) {
                teks += `▸ ${_cmdUser[posi].db[i].nama} : ${_cmdUser[posi].db[i].count}\n`
            }
            replyDeface(teks)
            break
        case prefix+'owner': case prefix+'dev':
            addCountCmd('#owner', sender, _cmd)
            sendContact(from, ownerNumber.split('@s.whatsapp.net')[0], ownerName, msg)
            // hinata.sendContact(from, ownerNumber.map( i => i.split("@")[0]), msg)
            .then((res) => hinata.sendMessage(from, { text: 'Tuh Nomor Ownerku' }, {quoted: res}))
            break
        case prefix+'grouphinata': case prefix+'gruphinata': case prefix+'groupbot': case prefix+'grupbot':
            addCountCmd('#grouphinata', sender, _cmd)
            var gc = 'https://chat.whatsapp.com/'+await hinata.groupInviteCode("14165203201-1429891386@g.us")
            var tek = `Jangan lupa join grup Hinata untuk mengetahui informasi lebih lanjut tentang bot\n\nGroup : ${gc}\n\nJangan lupa juga untuk Donasi supaya admin semakin semangat dalam mengembangkan bot ini, terimakasih.`
            replyDeface(tek)
            break
        case prefix+'cekdrive': case prefix+'drive':
            var result = await nou.drive.info();
            addCountCmd('#cekdrive', sender, _cmd)
            replyDeface(`*Drive Server Info*\n\n *▸ Total :* ${result.totalGb} GB\n *▸ Used :* ${result.usedGb} GB (${result.usedPercentage}%)\n *▸ Free :* ${result.freeGb} GB (${result.freePercentage}%)`)
            break
        case prefix+'cekbandwidth': case prefix+'bandwidth':
            replyDeface(mess.wait);
            addCountCmd('#cekbandwidth', sender, _cmd)
            var { download, upload } = await checkBandwidth();
            replyDeface(`*Bandwidth Server*\n\n*>* Upload : ${upload}\n*>* Download : ${download}`)
            break
        case prefix+'cekprem': case prefix+'cekpremium':
            if (!isPremium) return replyDeface(`Kamu bukan user premium, kirim perintah *${prefix}daftarprem* untuk membeli premium`)
            addCountCmd('#cekpremium', sender, _cmd)
            if (isOwner) return replyDeface(`Lu owner bego!`)
            if (_prem.getPremiumExpired(sender, premium) == "PERMANENT") return replyDeface(`PERMANENT`)
            let cekvip = ms(_prem.getPremiumExpired(sender, premium) - Date.now())
            let premiumnya = `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
            replyDeface(premiumnya)
            break
        case prefix+'sewabot': case prefix+'sewa':
            addCountCmd('#sewabot', sender, _cmd)
            let butSewa = [
            { urlButton: { displayText: `Click Here!`, url : `https://wa.me/6285921969852` } }
            ]
            buttonWithText(from, '*PRICE LIST SEWA BOT*\n\nIDR : 5.000\nExpired : 1 Month\n\nUntuk Info Sewa Bot Lebih Lanjut, Silahkan Klik Dibawah', footxt, butSewa)
            break
        case prefix+'listpremium': case prefix+'listprem':
            addCountCmd('#listpremium', sender, _cmd)
            let txt = `*List Premium User*\nJumlah : ${premium.length}\n\n`
            let men = [];
            for (let i of premium) {
                men.push(i.id)
                txt += `*ID :* @${i.id.split("@")[0]}\n`
                if (i.expired === 'PERMANENT') {
                    let cekvip = 'PERMANENT'
                    txt += `*Expire :* PERMANENT\n\n`
                } else {
                    let cekvip = ms(i.expired - Date.now())
                    txt += `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
                }
            }
            mentions(txt, men, true)
            break
        case prefix+'listsewa':
            let list_sewa_list = `*LIST-SEWA-GROUP*\n\n*Total:* ${sewa.length}\n\n`
            let data_array = [];
            for (let x of sewa) {
                addCountCmd('#listsewa', sender, _cmd)
                list_sewa_list += `*Name:* ${await getGcName(x.id)}\n*ID :* ${x.id}\n`
                if (x.expired === 'PERMANENT') {
                    let ceksewa = 'PERMANENT'
                    list_sewa_list += `*Expire :* PERMANENT\n\n`
                } else {
                    let ceksewa = ms(x.expired - Date.now())
                    list_sewa_list += `*Expire :* ${ceksewa.days} day(s) ${ceksewa.hours} hour(s) ${ceksewa.minutes} minute(s) ${ceksewa.seconds} second(s)\n\n`
                }
            }
            hinata.sendMessage(from, { text: list_sewa_list }, { quoted: msg })
            break
        case prefix+'speed': case prefix+'ping':
            addCountCmd('#speed', sender, _cmd)
            let butSinyal = [
            { urlButton: { displayText: `Instagram`, url : `${instagram}` } }
            ]
            buttonWithText(from, 'Speed Test', `${latensi.toFixed(4)} Second`, butSinyal)
            break
        case prefix+'runtime':
            addCountCmd('#runtime', sender, _cmd)
            let butRun = [
            { urlButton: { displayText: `Instagram`, url : `${instagram}` } }
            ]
            buttonWithText(from, 'Active During', `${runtime(process.uptime())}`, butRun)
            break
        case prefix+'listbahasa':
            addCountCmd('#listbahasa', sender, _cmd)
            var clear = ["auto", "isSupported", "getCode"]
            var teks = `List Bahasa Yang Tersedia\n\n`
            for (let i in translate.languages) {
                if (!clear.includes(i)) {
                    teks += `*${i}* untuk ${translate.languages[i]}\n`
                }
            }
            replyDeface(teks)
            break

        // Converter & Tools Menu
        case prefix+'sticker': case prefix+'stiker': case prefix+'s':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (isImage || isQuotedImage) {
                addCountCmd('#sticker', sender, _cmd)
                var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
                var buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                var rand1 = 'sticker/'+getRandom('.jpg')
                var rand2 = 'sticker/'+getRandom('.webp')
                fs.writeFileSync(`./${rand1}`, buffer)
                ffmpeg(`./${rand1}`)
                .on("error", console.error)
                .on("end", () => {
                    exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
                        hinata.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
                        limitAdd(sender, limit)
                        fs.unlinkSync(`./${rand1}`)
                        fs.unlinkSync(`./${rand2}`)
                    })
                })
                .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
                .toFormat('webp')
                .save(`${rand2}`)
            } else if (isVideo && msg.message.videoMessage.seconds < 10 || isQuotedVideo && quotedMsg.videoMessage.seconds < 10) {
                addCountCmd('#sticker', sender, _cmd)
                replyDeface(mess.wait)
                var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
                var buffer = Buffer.from([])
                for await(const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                var rand1 = 'sticker/'+getRandom('.mp4')
                var rand2 = 'sticker/'+getRandom('.webp')
                fs.writeFileSync(`./${rand1}`, buffer)
                ffmpeg(`./${rand1}`)
                .on("error", console.error)
                .on("end", () => {
                    exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
                        hinata.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
                        limitAdd(sender, limit)
                        fs.unlinkSync(`./${rand1}`)
                        fs.unlinkSync(`./${rand2}`)
                    })
                })
                .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
                .toFormat('webp')
                .save(`${rand2}`)
            } else {
                replyDeface(`Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`)
            }
            break
        case prefix+'swm': case prefix+'wm': case prefix+'stikerwm': case prefix+'stickerwm':
            if (!isPremium) return replyDeface(mess.OnlyPrem)
            var packname = q.split('|')[0] ? q.split('|')[0] : q
            var author = q.split('|')[1] ? q.split('|')[1] : ''
            if (isImage || isQuotedImage) {
                if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} nama|author\n\nContoh : ${command} teks1|teks2`)
                addCountCmd('#stickerwm', sender, _cmd)
                var media = await hinata.downloadAndSaveMediaMessage(msg, 'image', `./sticker/${sender}.jpeg`)
                var opt = { packname, author }
                hinata.sendImageAsSticker(from, media, msg, opt)
                .then( res => {
                    fs.unlinkSync(media)
                }).catch((e) => replyDeface(mess.error.api))
            } else if (isVideo || isQuotedVideo) {
                if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} nama|author\n\nContoh : ${command} teks1|teks2`)
                replyDeface(mess.wait)
                addCountCmd('#stickerwm', sender, _cmd)
                var media = await hinata.downloadAndSaveMediaMessage(msg, 'video', `./sticker/${sender}.jpeg`)
                var opt = { packname, author }
                hinata.sendImageAsSticker(from, media, msg, opt)
                .then( res => {
                    fs.unlinkSync(media)
                }).catch((e) => replyDeface(mess.error.api))
            } else {
                replyDeface(`Kirim gambar/video dengan caption ${prefix}stickerwm nama|author atau tag gambar/video yang sudah dikirim\nNote : Durasi video maximal 10 detik`)
            }
            break
        case prefix+'smeme': case prefix+'stikermeme': case prefix+'stickermeme': case prefix+'memestiker':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            var atas = q.includes('|') ? q.split('|')[0] ? q.split('|')[0] : q : '-'
            var bawah = q.includes('|') ? q.split('|')[1] ? q.split('|')[1] : '' : q
            var opt = { packname: stc.packname, author: stc.author }
            if (isImage || isQuotedImage) {
                try {
                    if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} text atas|text bawah\n\nContoh : ${command} Beliau|Awikawok`)
                    addCountCmd('#smeme', sender, _cmd)
                    replyDeface(mess.wait)
                    var media = await hinata.downloadAndSaveMediaMessage(msg, 'image', `./sticker/${sender+Date.now()}.jpg`)
                    var media_url = (await UploadFileUgu(media)).url
                    var meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${media_url}`
                    hinata.sendImageAsSticker(from, meme_url, msg, opt)
                    limitAdd(sender, limit)
                    fs.unlinkSync(media)
                } catch (e) {
                    console.log(color('[ ERROR ]', 'red'), e)
                    replyDeface(mess.error.api)
                    hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
                }
            } else if (isQuotedSticker) {
                try {
                    if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} text atas|text bawah\n\nContoh : ${command} Beliau|Awikawok`)
                    addCountCmd('#smeme', sender, _cmd)
                    replyDeface(mess.wait)
                    var media = await hinata.downloadAndSaveMediaMessage(msg, 'sticker', `./sticker/${sender+Date.now()}.webp`)
                    var media_url = (await UploadFileUgu(media)).url
                    var meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${media_url}`
                    hinata.sendImageAsSticker(from, meme_url, msg, opt)
                    limitAdd(sender, limit)
                    fs.unlinkSync(media)
                } catch (err) {
                    console.log(color('[ ERROR ]', 'red'), err)
                    replyDeface(mess.error.api)
                    hinata.sendMessage(ownerNumber, { text: `${command} error : ${err}` })
                }
            } else {
                replyDeface(`Kirim Gambar atau balas Sticker dengan caption ${command} teks atas|teks bawah`)
            }
            break
        case prefix+'toimg': case prefix+'toimage': case prefix+'tovid': case prefix+'tovideo':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (!isQuotedSticker) return replyDeface(`Reply stikernya!`)
            var stream = await downloadContentFromMessage(msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
            var buffer = Buffer.from([])
            for await(const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            var rand1 = 'sticker/'+getRandom('.webp')
            var rand2 = 'sticker/'+getRandom('.png')
            fs.writeFileSync(`./${rand1}`, buffer)
            if (isQuotedSticker && msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated !== true) {
                addCountCmd('#toimg', sender, _cmd)
                exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
                    fs.unlinkSync(`./${rand1}`)
                    if (err) return replyDeface(mess.error.api)
                    hinata.sendMessage(from, { image: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
                    limitAdd(sender, limit)
                    fs.unlinkSync(`./${rand2}`)
                })
            } else {
                replyDeface(mess.wait)
                addCountCmd('#tovid', sender, _cmd)
                webp2mp4File(`./${rand1}`).then(async(data) => {
                    fs.unlinkSync(`./${rand1}`)
                    hinata.sendMessage(from, { video: await getBuffer(data.data) }, { quoted: msg })
                    limitAdd(sender, limit)
                })
            }
            break
        case prefix+'tomp3': case prefix+'toaudio':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (isVideo || isQuotedVideo) {
                let media = await downloadAndSaveMediaMessage('video', `./sticker/${sender}.mp4`)
                replyDeface(mess.wait)
                addCountCmd('#tomp3', sender, _cmd)
                let ran = './sticker/'+getRandom('.mp3')
                exec(`ffmpeg -i ${media} ${ran}`, async (err) => {
                    fs.unlinkSync(media)
                    if (err) return replyDeface('Gagal :V')
                    hinata.sendMessage(from, { audio: fs.readFileSync(ran),  mimetype: 'audio/mp4', fileName: `${sender.split("@")[0]}ToMp3` }, { quoted: msg })
                    limitAdd(sender, limit)
                    fs.unlinkSync(media)
                    fs.unlinkSync(ran)
                })
            } else {
                replyDeface(`Kirim/reply video dengan caption ${command}`)
            }
            break
        case prefix+'ttp':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} teks`)
            if (q.length > 75) return replyDeface(`Teksnya terlalu panjang`)
            addCountCmd('#ttp', sender, _cmd)
            var pth = await getBuffer(`https://api.xteam.xyz/ttp?file&text=${encodeURIComponent(q)}`)
            fs.writeFileSync(`./sticker/${sender}.png`, pth)
            var media = `./sticker/${sender}.png`
            await ffmpeg(`${media}`)
            .input(media)
            .on('start', function (cmd) {
            })
            .on('error', function (err) {
                console.log(`Error : ${err}`)
                fs.unlinkSync(media)
                replyDeface(mess.error.api)
            })
            .on('end', function () {
                exec(`webpmux -set exif ./sticker/data.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
                    if (error) return replyDeface(mess.error.api)
                    hinata.sendMessage(from, { sticker: fs.readFileSync(`./sticker/${sender}.webp`) }, {quoted: msg})
                    limitAdd(sender, limit)
                    fs.unlinkSync(media)
                    fs.unlinkSync(`./sticker/${sender}.webp`)
                })
            })
            .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
            .toFormat('webp')
            .save(`./sticker/${sender}.webp`)
            break
        case prefix+'attp':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} teks`)
            if (q.length > 75) return replyDeface(`Teksnya terlalu panjang`)
            addCountCmd('#attp', sender, _cmd)
            var data = await getBuffer(`https://api.xteam.xyz/attp?file&text=${encodeURIComponent(q)}`)
            var rand2 = 'sticker/'+getRandom('.webp')
            fs.writeFileSync(`./${rand2}`, data)
            exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
                hinata.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
                limitAdd(sender, limit)
                fs.unlinkSync(`./${rand2}`)
            })
            break
        case prefix+'emojimix': case prefix+'mixemoji':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} emoji1+emoji2\n\nContoh : ${command} 😅+😝`)
            var emo1 = q.split("+")[0]
            var emo2 = q.split("+")[1]
            if (!isEmoji(emo1) || !isEmoji(emo2)) return replyDeface(`Itu bukan emoji!`)
            addCountCmd('#emojimix', sender, _cmd)
            fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emo1)}_${encodeURIComponent(emo2)}`)
            .then(data => {
                sendStickerFromUrl(from, data.results[0]. url, packname, author, { quoted: msg })
                limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'nulis':
            addCountCmd('#nulis', sender, _cmd)
            replyDeface(`*Pilihan Fitur Nulis*
1. ${prefix}nuliskiri
2. ${prefix}nuliskanan
3. ${prefix}foliokiri
4. ${prefix}foliokanan

Contoh:
${prefix}nuliskiri Paiz 01`)
            break
        case prefix+'nuliskiri': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} Paiz 01`)
            replyDeface(mess.wait)
            const tulisan = body.slice(11)
            addCountCmd('#nuliskiri', sender, _cmd)
            const splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
            spawn('convert', [
                './media/nulis/images/buku/sebelumkiri.jpg',
                '-font',
                './media/nulis/font/Indie-Flower.ttf',
                '-size',
                '960x1280',
                '-pointsize',
                '22',
                '-interline-spacing',
                '2',
                '-annotate',
                '+140+153',
                fixHeight,
                './media/nulis/images/buku/setelahkiri.jpg'
            ])
                .on('error', () => replyDeface(mess.error.api))
                .on('exit', () => {
                    hinata.sendMessage(from, { caption: 'Jangan males pak...', image: fs.readFileSync('./media/nulis/images/buku/setelahkiri.jpg') }, { quoted: msg, thumbnail: Buffer.alloc(0) })
                    limitAdd(sender, limit)
                })
            }
            break
        case prefix+'nuliskanan': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} Paiz 01`)
            replyDeface(mess.wait)
            const tulisan = body.slice(12)
            addCountCmd('#nuliskanan', sender, _cmd)
            const splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 31).join('\n')
            spawn('convert', [
                './media/nulis/images/buku/sebelumkanan.jpg',
                '-font',
                './media/nulis/font/Indie-Flower.ttf',
                '-size',
                '960x1280',
                '-pointsize',
                '23',
                '-interline-spacing',
                '2',
                '-annotate',
                '+128+129',
                fixHeight,
                './media/nulis/images/buku/setelahkanan.jpg'
            ])
                .on('error', () => replyDeface(mess.error.api))
                .on('exit', () => {
                    hinata.sendMessage(from, { caption: 'Jangan males pak...', image: fs.readFileSync('./media/nulis/images/buku/setelahkanan.jpg') }, { quoted: msg, thumbnail: Buffer.alloc(0) })
                    limitAdd(sender, limit)
                })
            }
            break
        case prefix+'foliokiri': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} Paiz 01`)
            replyDeface(mess.wait)
            const tulisan = body.slice(11)
            addCountCmd('#foliokiri', sender, _cmd)
            const splitText = tulisan.replace(/(\S+\s*){1,13}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 38).join('\n')
            spawn('convert', [
                './media/nulis/images/folio/sebelumkiri.jpg',
                '-font',
                './media/nulis/font/Indie-Flower.ttf',
                '-size',
                '1720x1280',
                '-pointsize',
                '23',
                '-interline-spacing',
                '4',
                '-annotate',
                '+48+185',
                fixHeight,
                './media/nulis/images/folio/setelahkiri.jpg'
            ])
                .on('error', () => replyDeface(mess.error.api))
                .on('exit', () => {
                    hinata.sendMessage(from, { caption: 'Jangan males pak...', image: fs.readFileSync('./media/nulis/images/folio/setelahkiri.jpg') }, { quoted: msg, thumbnail: Buffer.alloc(0) })
                    limitAdd(sender, limit)
                })
            }
            break
        case prefix+'foliokanan': {
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} Paiz 01`)
            replyDeface(mess.wait)
            const tulisan = body.slice(12)
            addCountCmd('#foliokanan', sender, _cmd)
            const splitText = tulisan.replace(/(\S+\s*){1,13}/g, '$&\n')
            const fixHeight = splitText.split('\n').slice(0, 38).join('\n')
            spawn('convert', [
                './media/nulis/images/folio/sebelumkanan.jpg',
                '-font',
                './media/nulis/font/Indie-Flower.ttf',
                '-size',
                '960x1280',
                '-pointsize',
                '23',
                '-interline-spacing',
                '3',
                '-annotate',
                '+89+190',
                fixHeight,
                './media/nulis/images/folio/setelahkanan.jpg'
            ])
                .on('error', () => replyDeface(mess.error.api))
                .on('exit', () => {
                    hinata.sendMessage(from, { caption: 'Jangan males pak...', image: fs.readFileSync('./media/nulis/images/folio/setelahkanan.jpg') }, { quoted: msg, thumbnail: Buffer.alloc(0) })
                    limitAdd(sender, limit)
                })
            }
            break
        case prefix+'spamcall':
            if (!isPremium) return replyDeface(`Kamu bukan user premium, kirim perintah *${prefix}daftarprem* untuk membeli premium`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} nomor\n\nContoh : ${command} 628XXXXXXXXXX`)
            var data = await fetchJson(`https://arugaz.herokuapp.com/api/spamcall?no=${args[1]}`).catch(() => replyDeface(mess.error.api))
            if (data.status == false) {
                replyDeface(data.msg)
            } else {
                addCountCmd('#spamcall', sender, _cmd)
                replyDeface(data.logs)
            }
            break
        case prefix+'say':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} teks`)
	        addCountCmd('#say', sender, _cmd)
	        var lang = q.split("--")[1]
            if (!lang) lang = 'id'
            var gen = ["female", "male"].includes(args[1]) ? args[1] : 'female'
            var teks = ["female", "male"].includes(args[1]) ? (q.slice(args[1].length + 1, q.length).split('--')[0]) : q.split('--')[0]
            hinata.sendPresenceUpdate('recording', from)
            getBuffer(`http://texttospeech.responsivevoice.org/v1/text:synthesize?text=${removeEmojis(teks)}&lang=${lang}&engine=g3&name=&pitch=0.5&rate=0.420&volume=1&key=0POmS5Y2&gender=${gen}`)
            .then(async(buf) => {
                hinata.sendMessage(from, { audio: buf, mimetype: 'audio/mp4', ptt: true }, { quoted: msg })
                limitAdd(sender, limit)
            })
            break
        case prefix+'translate': case prefix+'tr':{
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara :\n${command} kodebahasa text\n${command} kodebahasa < reply chat >\n\nContoh :\n${command} id what\n${command} id < reply chat >`)
            if (isQuotedMsg){
                addCountCmd('#translate', sender, _cmd)
                let bahasanya = args[1].toString()
                const trans = await translate(quotedMsg.chats, {
                    to: bahasanya
                })
                .then((res) => replyDeface(res.text))
                .catch((err) => {
                    replyDeface(`Kode bahasa salah!`)
                })
                trans
                limitAdd(sender, limit)
            } else {
                if (args.length < 3) return replyDeface(`Gunakan dengan cara :\n${command} kodebahasa text\n${command} kodebahasa < reply chat >\n\nContoh :\n${command} id what\n${command} id < reply chat >`)
                addCountCmd('#translate', sender, _cmd)
                let bahasanya = args[1].toString()
                let textnya = q.slice(args[1].length + 1, q.length)
                const trans = await translate(textnya, {
                    to: bahasanya
                })
                .then((res) => replyDeface(res.text))
                .catch((err) => {
                    replyDeface(`Kode bahasa salah!`)
                })
                trans
                limitAdd(sender, limit)
            }
            }
            break

               // Anonymous Chat
        case prefix+'anonymous':
            if (isGroup) return replyDeface(mess.OnlyPM)
            addCountCmd('#anonymous', sender, _cmd)
            this.anonymous = this.anonymous ? this.anonymous : {}
            var but = [
                { urlButton: { displayText: "Subscribe", url: `${ytPaiz_01}` }},
                { quickReplyButton: { displayText: "SEARCH", id: prefix+'start' }}
            ]
            var teks = `Hai ${pushname !== undefined ? pushname : 'Kak'} Selamat Datang di Anonymous Chat\n\nKetik ${prefix}search untuk mencari Teman Chat anda, atau bisa pencet tombol Search dibawah`
            hinata.sendMessage(from, { text: teks, footer: footxt, templateButtons: but })
            break
        case prefix+'start': case prefix+'search':
            if (isGroup) return replyDeface(mess.OnlyPM)
            addCountCmd('#start', sender, _cmd)
            this.anonymous = this.anonymous ? this.anonymous : {}
            var rooms = Object.values(this.anonymous).find(room => room.check(sender))
            if (rooms) {
                var but = [
                    { urlButton: { displayText: "Subscribe", url: `${ytPaiz_01}` }},
                    { quickReplyButton: { displayText: "STOP", id: prefix+'stop' }},
                    { quickReplyButton: { displayText: "SKIP", id: prefix+'skip' }}
                ]
                var teks = `[⚠️] Kamu masih dalam sesi chat dengan partner! ❌`
                return hinata.sendMessage(from, { text: teks, footer: footxt, templateButtons: but })
            }
            var roomm = Object.values(this.anonymous).find(room => room.state == "WAITING" && !room.check(sender))
            if (roomm) {
                var but = [
                    { urlButton: { displayText: "Subscribe", url: `${ytPaiz_01}` }},
                    { quickReplyButton: { displayText: "STOP", id: prefix+'stop' }},
                    { quickReplyButton: { displayText: "SKIP", id: prefix+'skip' }}
                ]
                roomm.b = sender
                roomm.state = "CHATTING"
                var teks = `_Pasangan Ditemukan 🐼_\n${prefix}skip -- _cari pasangan baru_\n${prefix}stop -- _hentikan dialog ini_`
                await hinata.sendMessage(roomm.a, { text: teks, footer: footxt, templateButtons: but })
                await hinata.sendMessage(roomm.b, { text: teks, footer: footxt, templateButtons: but })
            } else if (!rooms) {
                let id = + new Date
                this.anonymous[id] = {
                    id,
                    a: sender,
                    b: '',
                    state: "WAITING",
                    check: function(who = '') {
                        return [this.a, this.b].includes(who)
                    },
                    other: function(who = '') {
                        return who == this.a ? this.b : who == this.b ? this.a : ''
                    }
                }
                var but = [
                    { urlButton: { displayText: "Subscribe", url: `${ytPaiz_01}` }},
                    { quickReplyButton: { displayText: "STOP", id: prefix+'stop' }}
                ]
                var teks = `[🔎] Mohon tunggu sedang mencari teman chat`
                await hinata.sendMessage(from, { text: teks, footer: footxt, templateButtons: but })
            }
            break
        case prefix+'next': case prefix+'skip':
            if (isGroup) return replyDeface(mess.OnlyPM)
            addCountCmd('#next', sender, _cmd)
            this.anonymous = this.anonymous ? this.anonymous : {}
            let romeo = Object.values(this.anonymous).find(room => room.check(sender))
            var but = [
                { urlButton: { displayText: "Subscribe", url: `${ytPaiz_01}` }},
                { quickReplyButton: { displayText: "SEARCH", id: prefix+'start' }}
            ]
            if (!romeo) {
                var teks = `[⚠️] Kamu belum pernah memulai chat! ❌`
                await hinata.sendMessage(from, { text: teks, footer: footxt, templateButtons: but })
                throw false
            }
            let other = romeo.other(sender)
            var teks1 = `[⚠️] Sesi chat ini telah diberhentikan oleh teman chat kamu! ❌`
            if (other) await hinata.sendMessage(other, { text: teks1, footer: footxt, templateButtons: but })
            delete this.anonymous[romeo.id]
            let room = Object.values(this.anonymous).find(room => room.state == "WAITING" && !room.check(sender))
            if (room) {
                var but = [
                    { urlButton: { displayText: "Subscribe", url: `${ytPaiz_01}` }},
                    { quickReplyButton: { displayText: "STOP", id: prefix+'stop' }},
                    { quickReplyButton: { displayText: "SKIP", id: prefix+'skip' }}
                ]
                room.b = sender
                room.state = "CHATTING"
                var teks = `_Pasangan Ditemukan 🐼_\n${prefix}skip -- _cari pasangan baru_\n${prefix}stop -- _hentikan dialog ini_`
                await hinata.sendMessage(room.a, { text: teks, footer: footxt, templateButtons: but })
                await hinata.sendMessage(room.b, { text: teks, footer: footxt, templateButtons: but })
            } else {
                let id = + new Date
                this.anonymous[id] = {
                    id,
                    a: sender,
                    b: '',
                    state: "WAITING",
                    check: function(who = '') {
                        return [this.a, this.b].includes(who)
                    },
                    other: function(who = '') {
                        return who == this.a ? this.b : who == this.b ? this.a : ''
                    }
                }
                var but = [
                    { urlButton: { displayText: "Subscribe", url: `${ytPaiz_01}` }},
                    { quickReplyButton: { displayText: "STOP", id: prefix+'stop' }}
                ]
                var teks = `[🔎] Mohon tunggu sedang mencari teman chat`
                await hinata.sendMessage(from, { text: teks, footer: footxt, templateButtons: but })
            }
            break
        case prefix+'stop':
            if (isGroup) return replyDeface(mess.OnlyPM)
            addCountCmd('#stop', sender, _cmd)
            this.anonymous = this.anonymous ? this.anonymous : {}
            var roomo = Object.values(this.anonymous).find(room => room.check(sender))
            if (!roomo) {
                var but = [
                    { urlButton: { displayText: "Subscribe", url: `${ytPaiz_01}` }},
                    { quickReplyButton: { displayText: "SEARCH", id: prefix+'start' }}
                ]
                var teks = `[⚠️] Kamu belum pernah mulai chat! ❌`
                await hinata.sendMessage(from, { text: teks, footer: footxt, templateButtons: but })
                throw false
            } else {
                var but = [
                    { urlButton: { displayText: "Subscribe", url: `${ytPaiz_01}` }},
                    { quickReplyButton: { displayText: "SEARCH", id: prefix+'start' }}
                ]
                var teks = `[✅] Berhasil memberhentikan chat`
                var teks2 = `[⚠️] Sesi chat ini telah diberhentikan oleh teman chat kamu`
                await hinata.sendMessage(from, { text: teks, footer: footxt, templateButtons: but })
                let other = roomo.other(sender)
                if (other) await hinata.sendMessage(other, { text: teks2, footer: footxt, templateButtons: but })
                delete this.anonymous[roomo.id]
            }
            break
        case prefix+'sendprofile': case prefix+'sendprofil':
            if (isGroup) return replyDeface(mess.OnlyPM)
            this.anonymous = this.anonymous ? this.anonymous : {}
	        let romoe = Object.values(this.anonymous).find(room => room.check(sender))
	        var but = [
                { urlButton: { displayText: "Subscribe", url: `${ytPaiz_01}` }},
                { quickReplyButton: { displayText: "SEARCH", id: prefix+'start' }}
	        ]
		    if (!romoe) {
                var teks = `[⚠️] Kamu belum pernah memulai chat! ❌`
                await hinata.sendMessage(from, { text: teks, footer: footxt, templateButtons: but })
                throw false
            } else {
                let rms = Object.values(this.anonymous).find(room => [room.a, room.b].includes(sender) && room.state == "CHATTING")
                var partnerJID = rms.other(sender)
                var res = await hinata.sendContact(partnerJID, [sender.split("@")[0]])
                hinata.sendMessage(from, { text: '[✅] Berhasil mengirim profil ke teman chat anda!' }, { quoted: msg })
                hinata.sendMessage(partnerJID, { text: '[👨👩] Teman chat kamu memberikan kontak profil nya!' }, { quoted: res })
            }
            break

        // Store Menu
        case prefix+'list':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (db_respon_list.length === 0) return replyDeface(`Belum ada list message di database`)
            if (!isAlreadyResponListGroup(from, db_respon_list)) return replyDeface(`Belum ada list message yang terdaftar di group ini`)
            var arr_rows = [];
            for (let x of db_respon_list) {
                if (x.id === from) {
                    arr_rows.push({
                        title: x.key,
                        rowId: x.key
                    })
                }
            }
            var listMsg = {
                text: `${ucapanWaktu} @${sender.split("@")[0]}`,
                buttonText: 'Click Here!',
                footer: `*List ${groupName}*\n\n⏳ ${jam}\n📆 ${tanggal}`,
                mentions: [sender],
                sections: [{
                    title: groupName, rows: arr_rows
                }]
            }
            hinata.sendMessage(from, listMsg)
            break
        case prefix+'addlist':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            var args1 = q.split("@")[0]
            var args2 = q.split("@")[1]                
            if (!q.includes("@")) return replyDeface(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            if (isAlreadyResponList(from, args1, db_respon_list)) return replyDeface(`List respon dengan key : *${args1}* sudah ada di group ini.`)
            if (isImage || isQuotedImage) {
                let media = await downloadAndSaveMediaMessage('image', `./sticker/${sender}`)
                const fd = new FormData();
                fd.append('file', fs.readFileSync(media), '.tmp', '.jpg')
                fetch('https://telegra.ph/upload', {
                    method: 'POST',
                    body: fd
                }).then(res => res.json())
                    .then((json) => {
                        addResponList(from, args1, args2, true, `https://telegra.ph${json[0].src}`, db_respon_list)
                        replyDeface(`Sukses set list message dengan key : *${args1}*`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
                    })
            } else {
                addResponList(from, args1, args2, false, '-', db_respon_list)
                replyDeface(`Sukses set list message dengan key : *${args1}*`)
            }
            break
        case prefix+'dellist':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (db_respon_list.length === 0) return replyDeface(`Belum ada list message di database`)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *key*\n\n_Contoh_\n\n${command} hello`)
            if (!isAlreadyResponList(from, q, db_respon_list)) return replyDeface(`List respon dengan key *${q}* tidak ada di database!`)
            delResponList(from, q, db_respon_list)
            replyDeface(`Sukses delete list message dengan key *${q}*`)
            break
        case prefix+'updatelist': case prefix+'update':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            var args1 = q.split("@")[0]
            var args2 = q.split("@")[1]
            if (!q.includes("@")) return replyDeface(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            if (!isAlreadyResponListGroup(from, db_respon_list)) return replyDeface(`Maaf, untuk key *${args1}* belum terdaftar di group ini`)
            if (isImage || isQuotedImage) {
                let media = await downloadAndSaveMediaMessage('image', `./sticker/${sender}`)
                const fd = new FormData();
                fd.append('file', fs.readFileSync(media), '.tmp', '.jpg')
                fetch('https://telegra.ph/upload', {
                    method: 'POST',
                    body: fd
                }).then(res => res.json())
                    .then((json) => {
                        updateResponList(from, args1, args2, true, `https://telegra.ph${json[0].src}`, db_respon_list)
                        replyDeface(`Sukses update list message dengan key : *${args1}*`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
                    })
            } else {
                updateResponList(from, args1, args2, false, '-', db_respon_list)
                replyDeface(`Sukses update respon list dengan key *${args1}*`)
            }
            break
        case prefix+'jeda': {
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            if (!args[1]) return replyDeface(`kirim ${command} waktu\nContoh: ${command} 30m\n\nlist waktu:\ns = detik\nm = menit\nh = jam\nd = hari`)
            opengc[from] = { id: from, time: Date.now() + toMS(args[1]) }
            fs.writeFileSync('./database/group/opengc.json', JSON.stringify(opengc))
            hinata.groupSettingUpdate(from, "announcement")
            .then((res) => replyDeface(`Sukses, group akan dibuka ${args[1]} lagi`))
            .catch((err) => replyDeface('Error'))
            }
            break
        case prefix+'tambah':
            if (args.length < 3) return replyDeface(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
            var nilai_one = Number(args[1])
            var nilai_two = Number(args[2])
            replyDeface(`${nilai_one + nilai_two}`)
            break
        case prefix+'kurang':
            if (args.length < 3) return replyDeface(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
            var nilai_one = Number(args[1])
            var nilai_two = Number(args[2])
            replyDeface(`${nilai_one - nilai_two}`)
            break
        case prefix+'kali':
            if (args.length < 3) return replyDeface(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
            var nilai_one = Number(args[1])
            var nilai_two = Number(args[2])
            replyDeface(`${nilai_one * nilai_two}`)
            break
        case prefix+'bagi':
            if (args.length < 3) return replyDeface(`Gunakan dengan cara ${command} *angka* *angka*\n\n_Contoh_\n\n${command} 1 2`)
            var nilai_one = Number(args[1])
            var nilai_two = Number(args[2])
            replyDeface(`${nilai_one / nilai_two}`)
            break
        case 'p': case 'proses':
            if (!isGroup) return
            if (!isOwner && !isGroupAdmins) return
            if (!isQuotedMsg) return
            let proses = `「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Pending\`\`\`\n\n📝 Catatan :\n${quotedMsg.chats}\n\nPesanan @${quotedMsg.sender.split("@")[0]} sedang di proses!`
            const getTextP = getTextSetProses(from, set_proses);
            if (getTextP !== undefined) {
                mentions(getTextP.replace('pesan', quotedMsg.chats).replace('nama', quotedMsg.sender.split("@")[0]).replace('jam', jam).replace('tanggal', tanggal), [quotedMsg.sender], true);
            } else {
                mentions(proses, [quotedMsg.sender], true)
            }
            break
        case 'd': case 'done':
            if (!isGroup) return
            if (!isOwner && !isGroupAdmins) return
            if (!isQuotedMsg) return
            let sukses = `「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM     : ${jam}\n✨ STATUS  : Berhasil\`\`\`\n\nTerimakasih @${quotedMsg.sender.split("@")[0]} Next Order ya🙏`
            const getTextD = getTextSetDone(from, set_done);
            if (getTextD !== undefined) {
                mentions(getTextD.replace('pesan', quotedMsg.chats).replace('nama', quotedMsg.sender.split("@")[0]).replace('jam', jam).replace('tanggal', tanggal), [quotedMsg.sender], true);
            } else {
                mentions(sukses, [quotedMsg.sender], true)
            }
            break
        case prefix+'setproses': case prefix+'setp':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_p*\n\n_Contoh_\n\n${command} pesanan @pesan, tag orang @nama`)
            if (isSetProses(from, set_proses)) return replyDeface(`Set proses already active`)
            addCountCmd('#setproses', sender, _cmd)
            addSetProses(q, from, set_proses)
            replyDeface(`Successfully set proses!`)
            break
        case prefix+'changeproses': case prefix+'changep':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_p*\n\n_Contoh_\n\n${command} pesanan @pesan, tag orang @nama`)
            addCountCmd('#changeproses', sender, _cmd)
            if (isSetProses(from, set_proses)) {
                changeSetProses(q, from, set_proses)
                replyDeface(`Sukses change set proses teks!`)
            } else {
                addSetProses(q, from, set_proses)
                replyDeface(`Sukses change set proses teks!`)
            }
            break
        case prefix+'delsetproses': case prefix+'delsetp':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!isSetProses(from, set_proses)) return replyDeface(`Belum ada set proses di sini..`)
            addCountCmd('#delsetproses', sender, _cmd)
            removeSetProses(from, set_proses)
            replyDeface(`Sukses delete set proses`)
            break
        case prefix+'setdone': case prefix+'setd':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_d*\n\n_Contoh_\n\n${command} pesanan @pesan, tag orang @nama`)
            if (isSetDone(from, set_done)) return replyDeface(`Set done already active`)
            addCountCmd('#setdone', sender, _cmd)
            addSetDone(q, from, set_done)
            replyDeface(`Successfully set done!`)
            break
        case prefix+'changedone': case prefix+'changed':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_d*\n\n_Contoh_\n\n${command} pesanan @pesan, tag orang @nama`)
            addCountCmd('#changedone', sender, _cmd)
            if (isSetDone(from, set_done)) {
                changeSetDone(q, from, set_done)
                replyDeface(`Sukses change set done teks!`)
            } else {
                addSetDone(q, from, set_done)
                replyDeface(`Sukses change set done teks!`)
            }
            break
        case prefix+'delsetdone': case prefix+'delsetd':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!isSetDone(from, set_done)) return replyDeface(`Belum ada set done di sini..`)
            addCountCmd('#delsetdone', sender, _cmd)
            removeSetDone(from, set_done)
            replyDeface(`Sukses delete set done`)
            break

        // Downloads Menu
        case prefix+'play':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *query*\n\nContoh : ${command} aku bukan jodohnya`)
            replyDeface(mess.wait)
            addCountCmd('#play', sender, _cmd)
            await sendPlay(from, q)
            limitAdd(sender, limit)
            break
        case prefix+'ytmp3': case prefix+'mp3':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *url*\n\n_Contoh_\n\n${command} https://youtu.be/J9YG0LxpSqM`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            if (!args[1].includes('youtu.be') && !args[1].includes('youtube.com')) return replyDeface(mess.error.Iv)
            replyDeface(mess.wait)
            addCountCmd('#ytmp3', sender, _cmd)
            args[1] = args[1].includes('shorts') ? args[1].replace('https://youtube.com/shorts/', 'https://youtu.be/') : args[1]
            yta(args[1]).then(async(data) => {
                var teks = `*YOUTUBE-DOWNLOADER 📂*\n\n*▸ Title :* ${data.title}\n*▸ Size :* ${data.filesizeF}\n*▸ Url Source :* ${args[1]}\n\n_Wait a minute sending media..._`
                if (Number(data.filesize) >= 30000) {
                    var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                    teks = `*YOUTUBE-DOWNLOADER 📂*\n\n*▸ Title :* ${data.title}\n*▸ Size :* ${data.filesizeF}\n*▸ Url Source :* ${args[1]}\n*▸ Download :* ${res.data}\n\n_For larger sizes, presented in the form of a link_`
                    hinata.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                    limitAdd(sender, limit)
                } else {
                    hinata.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                    hinata.sendMessage(from, { audio: await getBuffer(data.dl_link), mimetype: 'audio/mp4' }, { quoted: msg })
                    limitAdd(sender, limit)
                }
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'ytmp4': case prefix+'mp4':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *url*\n\n_Contoh_\n\n${command} https://youtu.be/J9YG0LxpSqM`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            if (!args[1].includes('youtu.be') && !args[1].includes('youtube.com')) return replyDeface(mess.error.Iv)
            replyDeface(mess.wait)
            addCountCmd('#ytmp4', sender, _cmd)
            args[1] = args[1].includes('shorts') ? args[1].replace('https://youtube.com/shorts/', 'https://youtu.be/') : args[1]
            ytv(args[1]).then(async(data) => {
                var teks = `*YOUTUBE-DOWNLOADER 📂*\n\n*▸ Title :* ${data.title}\n*▸ Size :* ${data.filesizeF}\n*▸ Url Source :* ${args[1]}`
                if (Number(data.filesize) >= 30000) {
                    var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                    teks += `\n*▸ Download :* ${res.data}\n\n_For larger sizes, presented in the form of a link_`
                    hinata.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                    limitAdd(sender, limit)
                } else {
                    hinata.sendMessage(from, { video: await getBuffer(data.dl_link) }, { quoted: msg })
                    limitAdd(sender, limit)
                }
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'getmusik': case prefix+'getmusic':
		    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
		    if (!isQuotedImage) return replyDeface(`Gunakan dengan cara reply dari hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
		    if (!quotedMsg.fromMe) return replyDeface(`Hanya bisa mengambil hasil dari pesan bot`)
		    if (args.length < 2) return replyDeface(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
		    var kuoted = await quotedMsg.chats
            var ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/gi
            var arrey = [...kuoted.matchAll(ytIdRegex)].map(x => x[1])
            if (arrey.length == 0) return replyDeface(`Reply hasil dari *${prefix}ytsearch* dengan perintah *${command}* urutan`)
             if (isNaN(args[1])) return replyDeface(`Hanya support angka! pilih angka 1 sampai 10\nContoh : ${command} 2`)
            if (args[1] > arrey.length) return replyDeface(`Urutan Hasil *${prefix}ytsearch* Hanya Sampai *${arrey.length}*`)
            replyDeface(mess.wait)
            addCountCmd('#getmusic', sender, _cmd)
            args[1] = args[1].includes('shorts') ? args[1].replace('https://youtube.com/shorts/', 'https://youtu.be/') : args[1]
            yta(args[1]).then(async(data) => {
                var teks = `*YOUTUBE-DOWNLOADER 📂*\n\n*▸ Title :* ${data.title}\n*▸ Size :* ${data.filesizeF}\n*▸ Url Source :* ${args[1]}\n\n_Wait a minute sending media..._`
                if (Number(data.filesize) >= 30000) {
                    var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                    teks = `*YOUTUBE-DOWNLOADER 📂*\n\n*▸ Title :* ${data.title}\n*▸ Size :* ${data.filesizeF}\n*▸ Url Source :* ${args[1]}\n*▸ Download :* ${res.data}\n\n_For larger sizes, presented in the form of a link_`
                    hinata.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                    limitAdd(sender, limit)
                } else {
                    hinata.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                    hinata.sendMessage(from, { audio: await getBuffer(data.dl_link), mimetype: 'audio/mp4' }, { quoted: msg })
                    limitAdd(sender, limit)
                }
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'getvideo': case prefix+'getvidio':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (!isQuotedImage) return replyDeface(`Gunakan dengan cara reply hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
            if (!quotedMsg.fromMe) return replyDeface(`Hanya bisa mengambil hasil dari pesan bot`)
            if (args.length < 2) return replyDeface(`Balas hasil pencarian dari ${prefix}ytsearch dengan teks ${command} <no urutan>`)
            var kuoted = await quotedMsg.chats
            var ytIdRegex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/gi
            var arrey = [...kuoted.matchAll(ytIdRegex)].map(x => x[1])
            if (arrey.length == 0) return replyDeface(`Reply hasil dari *${prefix}ytsearch* dengan perintah *${command}* urutan`)
            if (isNaN(args[1])) return replyDeface(`Hanya support angka! pilih angka 1 sampai 10\nContoh : ${command} 2`)
            if (args[1] > arrey.length) return replyDeface(`Urutan Hasil *${prefix}ytsearch* Hanya Sampai *${arrey.length}*`)
            replyDeface(mess.wait)
            addCountCmd('#getvideo', sender, _cmd)
            args[1] = args[1].includes('shorts') ? args[1].replace('https://youtube.com/shorts/', 'https://youtu.be/') : args[1]
            ytv(args[1]).then(async(data) => {
                var teks = `*YOUTUBE-DOWNLOADER 📂*\n\n*▸ Title :* ${data.title}\n*▸ Size :* ${data.filesizeF}\n*▸ Url Source :* ${args[1]}`
                if (Number(data.filesize) >= 30000) {
                    var res = await axios.get(`https://tinyurl.com/api-create.php?url=${data.dl_link}`)
                    teks += `\n*▸ Download :* ${res.data}\n\n_For larger sizes, presented in the form of a link_`
                    hinata.sendMessage(from, { image: { url: data.thumb }, caption: teks }, { quoted: msg })
                    limitAdd(sender, limit)
                } else {
                    hinata.sendMessage(from, { video: await getBuffer(data.dl_link) }, { quoted: msg })
                    limitAdd(sender, limit)
                }
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'igdl': case prefix+'instagram': case prefix+'ig':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *url*\n\n_Contoh_\n\n${command} https://www.instagram.com/p/CWR_S4BF0mt/?utm_medium=copy_link`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            if (!args[1].includes('instagram.com')) return replyDeface(mess.error.Iv)
            replyDeface(mess.wait)
            igdl(args[1]).then(async(res) => {
                let { medias } = res
                let { username, fullName } = res.user
                var capat = `*INSTAGRAM-DOWNLOAD* 📂\n\n≻ *Username:* ${username}\n≻ *Fullname :* ${fullName}\n≻ *Jumlah Media :* ${medias.length}\n\n_wait a minute, media is being sent..._`
                hinata.sendMessage(from, { text: capat }, { quoted: msg })
                for (let i = 0; i < medias.length; i++) {
                    if (medias[i].fileType == 'jpg') {
                        hinata.sendMessage(from, { image: await getBuffer(medias[i].url) })
                    } else if (medias[i].fileType == 'mp4') {
                        hinata.sendMessage(from, { video: await getBuffer(medias[i].url) })
                    }
                }
                limitAdd(sender, limit)
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'igstory':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *username*\n\n_Contoh_\n\n${command} user name`)
            replyDeface(mess.wait)
            addCountCmd('#igstory', sender, _cmd)
            if (args[1].startsWith("@")) args[1] = args[1].replace("@", "")
            igstory(args[1]).then(async(data) => {
                var teks = `Instagram Story total ${data.medias.length}, media segera dikirim`
                replyDeface(teks)
                for (let i of data.medias) {
                    var media = await getBuffer(i.url)
                    if (i.type == "image") {
                        hinata.sendMessage(from, { image: media })
                    } else if (i.type == "video") {
                        hinata.sendMessage(from, { video: media })
                    }
                }
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'tiktok':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *url*\n\n_Contoh_\n\n${command} https://vt.tiktok.com/ZSduDmwCq/?k=1`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            if (!args[1].includes('tiktok')) return replyDeface(mess.error.Iv)
            replyDeface(mess.wait)
            addCountCmd('#tiktok', sender, _cmd)
            clph.downloader.tiktok(args[1]).then( data => {
                hinata.sendMessage(from, {
                    text: `*TIKTOK-DOWNLOADER 📂*\n\n🗒️ Title : ${data.title}\n👤 Username : ${data.author}\n\n_Silahkan Pilih Format yang ada dibawah_`,
                    footer: footxt,
                    templateButtons: [{ urlButton: { displayText: `Subscribe`, url: `${ytPaiz_01}` } },
                        { quickReplyButton: { displayText: `🎥 Video`, id: `${prefix}tiktoknowm ${args[1]}` } },
                        { quickReplyButton: { displayText: `🎧 Audio`, id: `${prefix}tiktokaudio ${args[1]}` } }]
                }, { quoted: msg })
                limitAdd(sender, limit)
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'tiktoknowm':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *url*\n\n_Contoh_\n\n${command} https://vt.tiktok.com/ZSduDmwCq/?k=1`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            if (!args[1].includes('tiktok')) return replyDeface(mess.error.Iv)
            replyDeface(mess.wait)
            addCountCmd('#tiktoknowm', sender, _cmd)
            TiktokDownloader(args[1]).then( data => {
                hinata.sendMessage(from, { video: { url: data.result.nowatermark }}, { quoted: msg })
                limitAdd(sender, limit)
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
		case prefix+'tiktokaudio':
		    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
		    if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *url*\n\n_Contoh_\n\n${command} https://vt.tiktok.com/ZSduDmwCq/?k=1`)
		    if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
		    if (!args[1].includes('tiktok')) return replyDeface(mess.error.Iv)
		    replyDeface(mess.wait)
		    addCountCmd('#tiktokaudio', sender, _cmd)
		    TiktokDownloader(args[1]).then( data => {
		        hinata.sendMessage(from, { audio: { url: data.result.nowatermark }, mimetype: 'audio/mp4' }, { quoted: msg })
		        limitAdd(sender, limit)
		    }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
		    break
        case prefix+'facebook': case prefix+'fbdl':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *url*\n\n_Contoh_\n\n${command} https://m.facebook.com/groups/4021832254535027/permalink/5410646708986901/`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            if (!args[1].includes('facebook.com')) return replyDeface(mess.error.Iv)
            replyDeface(mess.wait)
            addCountCmd('#facebook', sender, _cmd)
            xfar.Facebook(args[1]).then( data => {
                hinata.sendMessage(from, { video: { url: data.medias[0].url }, caption: data.title }, { quoted: msg })
                limitAdd(sender, limit)
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'mediafire': case prefix+'mfire': case prefix+'mfdl':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix} limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *url*\n\n_Contoh_\n\n${command} https://www.mediafire.com/file/a61862y1tgvfiim/ZackBotMans+(+Versi+1.0.1+).zip/file`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            if (!args[1].includes('mediafire.com')) return replyDeface(mess.error.Iv)
            replyDeface(mess.wait)
            addCountCmd('#mediafire', sender, _cmd)
            kotz.mediafire(args[1]).then(async(data) => {
                data = data[0]
                data.nama = decodeURIComponent(data.nama)
                var media = await getBuffer(data.link)
                if (data.mime.includes('mp4')) {
                    hinata.sendMessage(from, { document: media, fileName: data.nama, mimetype: 'video/mp4' }, { quoted: msg })
                } else if (data.mime.includes('mp3')) {
                    hinata.sendMessage(from, { document: media, fileName: data.nama, mimetype: 'audio/mp3' }, { quoted: msg })
                } else {
                    hinata.sendMessage(from, { document: media, fileName: data.nama, mimetype: 'application/'+data.mime }, { quoted: msg })
                }
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'telestick': case prefix+'telesticker':
            if (!isPremium) return replyDeface(mess.OnlyPrem)
            if (isGroup) return replyDeface(`Untuk menghindari Spam, fitur ${command} hanya bisa digunakan di Chat Pribadi`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *url*\n\n_Contoh_\n\n${command} https://t.me/addstickers/Nekonyaaaa`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            if (!args[1].includes('t.me')) return replyDeface(mess.error.Iv)
            replyDeface(mess.wait)
            addCountCmd('#telestick', sender, _cmd)
            telesticker(args[1]).then(async(data) => {
                for (let i of data) {
                    if (i.status == 200) {
			            sendStickerFromUrl(from, i.url)
			            await sleep(1000)
			        } else {
			            hinata.sendMessage(from, { text: 'Salah satu sticker error!' })
			        }
			    }
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'pindl': case prefix+'pinterestdl':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *url*\n\n_Contoh_\n\n${command} https://pin.it/xyHalNF`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            if (!args[1].includes('pin')) return replyDeface(mess.error.Iv)
            addCountCmd('#pinterestdl', sender, _cmd)
            replyDeface(mess.wait)
            fetchJson(`https://api.zacros.my.id/downloader/pindl?link=${args[1]}`)
            .then(async(res) => {
                hinata.sendMessage(from, { image: await getBuffer(res.result) }, { quoted: msg })
                limitAdd(sender, limit)
            })
            .catch(() => { replyDeface(mess.error.api) })
            break
        case prefix+'gitclone':
            let regx = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
            if (!q) return replyDeface('Linknya?')
            if (!regx.test(args[1])) return replyDeface('Linknya salah')
            replyDeface(mess.wait)
            let [, usr, repo] = args[1].match(regx) || []
            let repos = repo.replace(/.git$/, '')
            let hasdl = `https://api.github.com/repos/${usr}/${repos}/zipball`
            let namafile = (await fetch(hasdl, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
            hinata.sendMessage(from, { document: { url: hasdl }, mimetype: 'application/zip', fileName: namafile }, { quoted: msg })
            break

        // Group Menu
        case prefix+'afk':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (isAfkOn) return replyDeface('afk sudah diaktifkan sebelumnya')
            if (body.slice(100)) return replyDeface('Alasanmu terlalu panjang')
            addCountCmd('#afk', sender, _cmd)
            let reason = body.slice(5) ? body.slice(5) : 'Nothing.'
            afk.addAfkUser(sender, Date.now(), reason, _afk)
            mentions(`@${sender.split('@')[0]} sedang afk\nAlasan : ${reason}`, [sender], true)
            break
        case prefix+'welcome':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (args.length === 1) return replyDeface(`Pilih enable atau disable`)
            if (args[1].toLowerCase() === "enable") {
                addCountCmd('#welcome', sender, _cmd)
                if (isWelcome) return replyDeface(`Udah aktif`)
                welcome.push(from)
                fs.writeFileSync('./database/group/welcome.json', JSON.stringify(welcome, null, 2))
                replyDeface('Sukses mengaktifkan welcome di grup ini')
            } else if (args[1].toLowerCase() === "disable") {
                addCountCmd('#welcome', sender, _cmd)
                var posi = welcome.indexOf(from)
                welcome.splice(posi, 1)
                fs.writeFileSync('./database/group/welcome.json', JSON.stringify(welcome, null, 2))
                replyDeface('Sukses menonaktifkan welcome di grup ini')
            } else {
                replyDeface(`Pilih enable atau disable`)
            }
            break
        case prefix+'left':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (args.length === 1) return replyDeface(`Pilih enable atau disable`)
            if (args[1].toLowerCase() === "enable") {
                addCountCmd('#setleft', sender, _cmd)
                if (isLeft) return replyDeface(`Udah aktif`)
                left.push(from)
                fs.writeFileSync('./database/group/left.json', JSON.stringify(left, null, 2))
                replyDeface('Sukses mengaktifkan left di grup ini')
            } else if (args[1].toLowerCase() === "disable") {
                addCountCmd('#leave', sender, _cmd)
                var posi = left.indexOf(from)
                left.splice(posi, 1)
                fs.writeFileSync('./database/group/left.json', JSON.stringify(left, null, 2))
                replyDeface('Sukses menonaktifkan left di grup ini')
            } else {
                replyDeface(`Pilih enable atau disable`)
            }
            break
        case prefix+'setwelcome':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_welcome*\n\n_Contoh_\n\n${command} Halo @user, Selamat datang di @group`)
            if (isSetWelcome(from, set_welcome_db)) return replyDeface(`Set welcome already active`)
            addSetWelcome(q, from, set_welcome_db)
            addCountCmd('#setwelcome', sender, _cmd)
            replyDeface(`Successfully set welcome!`)
            break
        case prefix+'changewelcome':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_welcome*\n\n_Contoh_\n\n${command} Halo @user, Selamat datang di @group`)
            if (isSetWelcome(from, set_welcome_db)) {
                addCountCmd('#changewelcome', sender, _cmd)
                changeSetWelcome(q, from, set_welcome_db)
                replyDeface(`Sukses change set welcome teks!`)
            } else {
                addCountCmd('#changewelcome', sender, _cmd)
                addSetWelcome(q, from, set_welcome_db)
                replyDeface(`Sukses change set welcome teks!`)
            }
            break
        case prefix+'delsetwelcome':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!isSetWelcome(from, set_welcome_db)) return replyDeface(`Belum ada set welcome di sini..`)
            removeSetWelcome(from, set_welcome_db)
            addCountCmd('#delsetwelcome', sender, _cmd)
            replyDeface(`Sukses delete set welcome`)
            break
        case prefix+'setleft':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_left*\n\n_Contoh_\n\n${command} Halo @user, Selamat tinggal dari @group`)
            if (isSetLeft(from, set_left_db)) return replyDeface(`Set left already active`)
            addCountCmd('#setleft', sender, _cmd)
            addSetLeft(q, from, set_left_db)
            replyDeface(`Successfully set left!`)
            break
        case prefix+'changeleft':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_left*\n\n_Contoh_\n\n${command} Halo @user, Selamat tinggal dari @group`)
            if (isSetLeft(from, set_left_db)) {
                addCountCmd('#changeleft', sender, _cmd)
                changeSetLeft(q, from, set_left_db)
                replyDeface(`Sukses change set left teks!`)
            } else {
                addCountCmd('#changeleft', sender, _cmd)
                addSetLeft(q, from, set_left_db)
                replyDeface(`Sukses change set left teks!`)
            }
            break
        case prefix+'delsetleft':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!isSetLeft(from, set_left_db)) return replyDeface(`Belum ada set left di sini..`)
            addCountCmd('#delsetleft', sender, _cmd)
            removeSetLeft(from, set_left_db)
            replyDeface(`Sukses delete set left`)
            break
        case prefix+'linkgrup': case prefix+'link': case prefix+'linkgc':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            addCountCmd('#linkgc', sender, _cmd)
            var url = await hinata.groupInviteCode(from).catch(() => replyDeface(mess.error.api))
            url = 'https://chat.whatsapp.com/'+url
            replyDeface(url)
            break
        case prefix+'setppgrup': case prefix+'setppgc':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            if (isImage || isQuotedImage) {
            addCountCmd('#setppgrup', sender, _cmd)
            var media = await downloadAndSaveMediaMessage('image', `ppgc${from}.jpeg`)
            if (args[1] == '\'panjang\'') {
            	var { img } = await generateProfilePicture(media)
            	await hinata.query({
                    tag: 'iq',
                    attrs: {
                        to: from,
                        type:'set',
                        xmlns: 'w:profile:picture'
                    },
                    content: [
                    {
                        tag: 'picture',
                        attrs: { type: 'image' },
                        content: img
                    } 
                    ]
                })
                fs.unlinkSync(media)
            	replyDeface(`Sukses`)
            } else {
                await hinata.updateProfilePicture(from, { url: media })
                .then( res => {
                    replyDeface(`Sukses`)
                    fs.unlinkSync(media)
                }).catch(() => replyDeface(mess.error.api))
            }
            } else {
			    replyDeface(`Kirim/balas gambar dengan caption ${command}`)
            }
            break
        case prefix+'setnamegrup': case prefix+'setnamegc':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *text*\n\n_Contoh_\n\n${command} Support ${ownerName}`)
            addCountCmd('#setnamegc', sender, _cmd)
            await hinata.groupUpdateSubject(from, q)
            .then( res => {
                replyDeface(`Sukses`)
            }).catch(() => replyDeface(mess.error.api))
            break
        case prefix+'setdesc': case prefix+'setdescription':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *text*\n\n_Contoh_\n\n${command} New Description by ${ownerName}`)
            addCountCmd('#setdesc', sender, _cmd)
            await hinata.groupUpdateDescription(from, q)
            .then( res => {
                replyDeface(`Sukses`)
            }).catch(() => replyDeface(mess.error.api))
            break
        case prefix+'antilink':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            if (args.length === 1) return replyDeface(`Pilih enable atau disable`)
            if (args[1].toLowerCase() === 'enable'){
                addCountCmd('#antilink', sender, _cmd)
                if (isAntiLink) return replyDeface(`Udah aktif`)
                antilink.push(from)
                fs.writeFileSync('./database/group/antilink.json', JSON.stringify(antilink, null, 2))
                replyDeface('Successfully Activate Antilink In This Group')
            } else if (args[1].toLowerCase() === 'disable'){
                addCountCmd('#antilink', sender, _cmd)
                if (!isAntiLink) return replyDeface(`Udah nonaktif`)
                let anu = antilink.indexOf(from)
                antilink.splice(anu, 1)
                fs.writeFileSync('./database/group/antilink.json', JSON.stringify(antilink, null, 2))
                replyDeface('Successfully Disabling Antilink In This Group')
            } else {
                replyDeface(`Pilih enable atau disable`)
            }
            break
        case prefix+'antiwame':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            if (args.length === 1) return replyDeface(`Pilih enable atau disable`)
            if (args[1].toLowerCase() === 'enable'){
                addCountCmd('#antiwame', sender, _cmd)
                if (isAntiWame) return replyDeface(`Udah aktif`)
                antilink.push(from)
                fs.writeFileSync('./database/group/antiwame.json', JSON.stringify(antiwame, null, 2))
                replyDeface('Successfully Activate Antiwame In This Group')
            } else if (args[1].toLowerCase() === 'disable'){
                addCountCmd('#antiwame', sender, _cmd)
                if (!isAntiWame) return replyDeface(`Udah nonaktif`)
                let anu = antiwame.indexOf(from)
                antiwame.splice(anu, 1)
                fs.writeFileSync('./database/group/antiwame.json', JSON.stringify(antiwame, null, 2))
                replyDeface('Successfully Disabling Antiwame In This Group')
            } else {
                replyDeface(`Pilih enable atau disable`)
            }
            break
        case prefix+'open': case prefix+'buka':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            addCountCmd('#open', sender, _cmd)
            hinata.groupSettingUpdate(from, 'not_announcement')
            .then((res) => {
                const textOpen = getTextSetOpen(from, set_open);
                if (textOpen !== undefined) {
                    replyDeface(textOpen);
                } else {
                    replyDeface(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
                }
            })
            .catch((err) => replyDeface('Error'))
			break
        case prefix+'close': case prefix+'tutup':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
		    addCountCmd('#close', sender, _cmd)
		    hinata.groupSettingUpdate(from, 'announcement')
		    .then((res) => {
                const textClose = getTextSetClose(from, set_close);
                if (textClose !== undefined) {
                    replyDeface(textClose);
                } else {
                    replyDeface(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
                }
            })
            .catch((err) => replyDeface('Error'))
		    break
        case prefix+'setopen':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_open*\n\n_Contoh_\n\n${command} Group telah di buka`)
            if (isSetOpen(from, set_open)) return replyDeface(`Set Open already active`)
            addCountCmd('#setopen', sender, _cmd)
            addSetOpen(q, from, set_open)
            replyDeface(`Successfully set Open!`)
            break
        case prefix+'changeopen':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_open*\n\n_Contoh_\n\n${command} Group telah di buka`)
            addCountCmd('#changeopen', sender, _cmd)
            if (isSetOpen(from, set_open)) {
                changeSetOpen(q, from, set_open)
                replyDeface(`Sukses change set Open teks!`)
            } else {
                addSetOpen(q, from, set_open)
                replyDeface(`Sukses change set Open teks!`)
            }
            break
        case prefix+'delsetopen':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!isSetOpen(from, set_open)) return replyDeface(`Belum ada set Open di sini..`)
            addCountCmd('#delsetopen', sender, _cmd)
            removeSetOpen(from, set_open)
            replyDeface(`Sukses delete set Open`)
            break
        case prefix+'setclose':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_close*\n\n_Contoh_\n\n${command} Group telah di tutup`)
            if (isSetClose(from, set_close)) return replyDeface(`Set Close already active`)
            addCountCmd('#setclose', sender, _cmd)
            addSetClose(q, from, set_close)
            replyDeface(`Successfully set Close!`)
            break
        case prefix+'changeclose':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!q) return replyDeface(`Gunakan dengan cara ${command} *teks_close*\n\n_Contoh_\n\n${command} Group telah di tutup`)
            addCountCmd('#changeclose', sender, _cmd)
            if (isSetClose(from, set_close)) {
                changeSetClose(q, from, set_close)
                replyDeface(`Sukses change set Close teks!`)
            } else {
                addSetClose(q, from, set_close)
                replyDeface(`Sukses change set Close teks!`)
            }
            break
        case prefix+'delsetclose':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!isSetClose(from, set_close)) return replyDeface(`Belum ada set Close di sini..`)
            addCountCmd('#delseclose', sender, _cmd)
            removeSetClose(from, set_close)
            replyDeface(`Sukses delete set Close`)
            break
        case prefix+'add':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins) return replyDeface(mess.GrupAdmin)
            if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            if (groupMembers.length == 257) return replyDeface(`Anda tidak dapat menambah peserta, karena Grup sudah penuh!`)
            var mems = []
            groupMembers.map( i => mems.push(i.id) )
            var number;
            if (args.length > 1) {
                number = q.replace(/[^0-9]/gi, '')+"@s.whatsapp.net"
                var cek = await hinata.onWhatsApp(number)
                if (cek.length == 0) return replyDeface(`Masukkan nomer yang valid dan terdaftar di WhatsApp`)
                if (mems.includes(number)) return replyDeface(`Nomer tersebut sudah berada didalam grup!`)
                addCountCmd('#add', sender, _cmd)
                hinata.groupParticipantsUpdate(from, [number], "add")
                .then( res => replyDeface(jsonformat(res)))
                .catch((err) => replyDeface(jsonformat(err)))
            } else if (isQuotedMsg) {
                number = quotedMsg.sender
                var cek = await hinata.onWhatsApp(number)
                if (cek.length == 0) return replyDeface(`Peserta tersebut sudah tidak terdaftar di WhatsApp`)
                if (mems.includes(number)) return replyDeface(`Nomer tersebut sudah berada didalam grup!`)
                addCountCmd('#add', sender, _cmd)
                hinata.groupParticipantsUpdate(from, [number], "add")
                .then( res => replyDeface(jsonformat(res)))
                .catch((err) => replyDeface(jsonformat(err)))
            } else {
                replyDeface(`Kirim perintah ${command} nomer atau balas pesan orang yang ingin dimasukkan`)
            }
            break
        case prefix+'kick':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins) return replyDeface(mess.GrupAdmin)
            if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            var number;
			if (mentionUser.length !== 0) {
                number = mentionUser[0]
                addCountCmd('#kick', sender, _cmd)
                hinata.groupParticipantsUpdate(from, [number], "remove")
                .then( res => replyDeface(jsonformat(res)))
                .catch((err) => replyDeface(jsonformat(err)))
            } else if (isQuotedMsg) {
                number = quotedMsg.sender
                addCountCmd('#kick', sender, _cmd)
                hinata.groupParticipantsUpdate(from, [number], "remove")
                .then( res => replyDeface(jsonformat(res)))
                .catch((err) => replyDeface(jsonformat(err)))
            } else {
                replyDeface(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
            }
            break
        case prefix+'promote': case prefix+'pm':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins) return replyDeface(mess.GrupAdmin)
            if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            if (mentionUser.length !== 0) {
                addCountCmd('#promote', sender, _cmd)
                hinata.groupParticipantsUpdate(from, [mentionUser[0]], "promote")
                .then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai admin`, [mentionUser[0]], true) })
                .catch(() => replyDeface(mess.error.api))
            } else if (isQuotedMsg) {
                addCountCmd('#promote', sender, _cmd)
                hinata.groupParticipantsUpdate(from, [quotedMsg.sender], "promote")
                .then( res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai admin`, [quotedMsg.sender], true) })
                .catch(() => replyDeface(mess.error.api))
            } else {
                replyDeface(`Tag atau balas pesan member yang ingin dijadikan admin`)
            }
            break
        case prefix+'demote':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins) return replyDeface(mess.GrupAdmin)
            if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            if (mentionUser.length !== 0) {
                addCountCmd('#demote', sender, _cmd)
                hinata.groupParticipantsUpdate(from, [mentionUser[0]], "demote")
                .then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai member biasa`, [mentionUser[0]], true) })
                .catch(() => replyDeface(mess.error.api))
            } else if (isQuotedMsg) {
                addCountCmd('#demote', sender, _cmd)
                hinata.groupParticipantsUpdate(from, [quotedMsg.sender], "demote")
                .then( res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai member biasa`, [quotedMsg.sender], true) })
                .catch(() => replyDeface(mess.error.api))
            } else {
                replyDeface(`Tag atau balas pesan admin yang ingin dijadikan member biasa`)
            }
            break
        case prefix+'revoke':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins) return replyDeface(mess.GrupAdmin)
            if (!isBotGroupAdmins) return replyDeface(mess.BotAdmin)
            addCountCmd('#revoke', sender, _cmd)
            await hinata.groupRevokeInvite(from)
            .then( res => {
                replyDeface(`Sukses menyetel tautan undangan grup ini`)
            }).catch(() => replyDeface(mess.error.api))
            break
        case prefix+'tagall': case prefix+'infoall':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins) return replyDeface(mess.GrupAdmin)
	       addCountCmd('#tagall', sender, _cmd)
	       let participants = msg.isGroup ? await groupMetadata.participants : ''
           let tekss = `*👤 TAG ALL 👤*\n\n*Pesan : ${q ? q : 'Nothing'}*\n\n`
           for (let mem of participants) {
           tekss += `• @${mem.id.split('@')[0]}\n`
           }
           tekss += `\n${footxt}`
           hinata.sendMessage(from, { text: tekss, mentions: participants.map(a => a.id) }, { quoted: msg })
           break
        case prefix+'hidetag':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            addCountCmd('#hidetag', sender, _cmd)
            let mem = [];
            groupMembers.map( i => mem.push(i.id) )
            hinata.sendMessage(from, { text: q ? q : '', mentions: mem })
            break
        case prefix+'delete': case prefix+'del': case prefix+'d':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return replyDeface(mess.GrupAdmin)
            if (!isQuotedMsg) return replyDeface(`Balas chat dari bot yang ingin dihapus`)
            if (!quotedMsg.fromMe) return replyDeface(`Hanya bisa menghapus chat dari bot`)
            addCountCmd('#delete', sender, _cmd)
            hinata.sendMessage(from, { delete: { fromMe: true, id: quotedMsg.id, remoteJid: from }})
            break
        case prefix+'checksewa': case prefix+'ceksewa':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (!isSewa) return replyDeface(`Bot tidak di sewa group ini!`)
            addCountCmd('#checksewa', sender, _cmd)
            let ceksewa = ms(_sewa.getSewaExpired(from, sewa) - Date.now())
            let sewanya = `*Expire :* ${ceksewa.days} day(s) ${ceksewa.hours} hour(s) ${ceksewa.minutes} minute(s)`
            replyDeface(sewanya)
            break

        // Game Menu
        case prefix+'tictactoe': case prefix+'ttt': case prefix+'ttc':
            if (!isGroup)return replyDeface(mess.OnlyGrup)
            if (isGame(sender, isOwner, gcount, glimit)) return replyDeface(`Limit game kamu sudah habis`)
            if (isTicTacToe(from, tictactoe)) return replyDeface(`Masih ada game yg blum selesai`)
            if (args.length < 2) return replyDeface(`Kirim perintah *${prefix}tictactoe* @tag`)
            if (mentionByTag.length !== 1) {
                if (mentionByTag[0] === botNumber) return replyDeface(`Tidak bisa bermain dengan bot!`)
                if (mentionByTag[0] === sender) return replyDeface(`Sad amat main ama diri sendiri`)
                var hadiah = randomNomor(100, 150)
                addCountCmd('#tictactoe', sender, _cmd)
                mentions(monospace(`@${sender.split('@')[0]} menantang @${mentionByTag[0].split('@')[0]} untuk bermain TicTacToe\n\nKirim (Y/N) untuk bermain\n\nHadiah : ${hadiah} balance`), [sender, mentionByTag[0]], false)
                tictactoe.push({
                    id: from,
                    status: null,
                    hadiah: hadiah,
                    penantang: sender,
                    ditantang: mentionByTag[0],
                    TicTacToe: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣']
                })
                gameAdd(sender, limit)
            } else {
                replyDeface(`Kirim perintah *${prefix}tictactoe* @tag`)
            }
            break
        case prefix+'delttt': case prefix+'delttc':
            if (!isGroup)return replyDeface(mess.OnlyGrup)
            if (!isTicTacToe(from, tictactoe)) return replyDeface(`Tidak ada sesi game tictactoe di grup ini`)
            var posi = getPosTic(from, tictactoe)
            if (tictactoe[posi].penantang.includes(sender)) {
                addCountCmd('#delttc', sender, _cmd)
                tictactoe.splice(posi, 1)
                replyDeface(`Berhasil menghapus sesi tictactoe di grup ini`)
            } else if (tictactoe[posi].ditantang.includes(sender)) {
                addCountCmd('#delttc', sender, _cmd)
                tictactoe.splice(posi, 1)
                replyDeface(`Berhasil menghapus sesi tictactoe di grup ini`)
            } else if (isGroupAdmins) {
                addCountCmd('#delttc', sender, _cmd)
                tictactoe.splice(posi, 1)
                replyDeface(`Berhasil menghapus sesi tictactoe di grup ini`)
            } else if (isOwner) {
                addCountCmd('#delttc', sender, _cmd)
                tictactoe.splice(posi, 1)
                replyDeface(`Berhasil menghapus sesi tictactoe di grup ini`)
            } else {
                replyDeface(`Anda tidak bisa menghapus sesi tictactoe, karena bukan pemain!`)
            }
            break
        case prefix+'tebakgambar': case prefix+'tg':
		    if (isGame(sender, isOwner, gcount, glimit)) return replyDeface(`Limit game kamu sudah habis`)
		    if (isPlayGame(from, tebakgambar)) return hinata.replyDeface(from, `Masih ada game yang belum diselesaikan`, tebakgambar[getGamePosi(from, tebakgambar)].msg)
		    addCountCmd('#tebakgambar', sender, _cmd)
		    var data = { image: '', jawaban: '' }
		    try {
		        var anu1 = await fetchJson(`https://api.kaysa.xyz/api/tebakgambar?&apikey=KaysaS`)
		        data.image = anu1.image
		        data.jawaban = anu1.answer
		    } catch {
		        var anu2 = await kotz.tebakgambar()
		        anu2 = anu2[0]
		        data.image = data.image
		        data.jawaban = data.jawaban.split('Jawaban ').join('')
		    }
		    var teks = `*TEBAK GAMBAR*\n\n`+monospace(`Petunjuk : ${data.jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : ${gamewaktu}s`)
		    hinata.sendMessage(from, { image: { url: data.image }, caption: teks }, { quoted: msg, messageId: 'BAE5'+makeid(10).toUpperCase()+'TG' })
		    .then( res => {
		        var jawab = data.jawaban.toLowerCase()
		        addPlayGame(from, 'Tebak Gambar', jawab, gamewaktu, res, tebakgambar)
		        gameAdd(sender, glimit)
		    })
		    .catch((err) => {
                console.log(color('[ ERROR ]', 'red'), err)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${err}` })
            })
		    break
		case prefix+'kuis':
		    if (isGame(sender, isOwner, gcount, glimit)) return replyDeface(`Limit game kamu sudah habis`)
		    if (isPlayGame(from, kuis)) return hinata.replyDeface(from, `Masih ada game yang belum diselesaikan`, kuis[getGamePosi(from, kuis)].msg)
		    addCountCmd('#kuis', sender, _cmd)
		    fetchJson('https://raw.githubusercontent.com/xdlyy404/database/master/games/tebaktebakan.json').then( data => {
		        var result = data[Math.floor(Math.random() * data.length)]
		        var { soal, jawaban } = result
		        var teks = `*KUIS GAME*\n\n`+monospace(`Soal : ${soal}\nPetunjuk : ${jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : ${gamewaktu}s`)
		        hinata.sendMessage(from, { text: teks }, { quoted: msg, messageId: 'BAE5'+makeid(10).toUpperCase()+'KS' })
		        .then( res => {
					var jawab = jawaban.toLowerCase()
                    addPlayGame(from, 'Kuis Game', jawab, gamewaktu, res, kuis)
                    gameAdd(sender, glimit)
                })
            }).catch((err) => {
                console.log(color('[ ERROR ]', 'red'), err)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${err}` })
            })
            break
        case prefix+'tebaklagu': case prefix+'tl':
            if (isGame(sender, isOwner, gcount, glimit)) return replyDeface(`Limit game kamu sudah habis`)
            if (isPlayGame(from, tebaklagu)) return hinata.replyDeface(from, `Masih ada game yang belum diselesaikan`, tebaklagu[getGamePosi(from, tebaklagu)].msg)
            addCountCmd('#tebaklagu', sender, _cmd)
            fetchJson('https://raw.githubusercontent.com/xdlyy404/database/master/games/tebaklagu.json').then( data => {
                var results = data[Math.floor(Math.random() * data.length)]
                var { preview, judul } = results
                if (judul.toLowerCase() == 'audio tidak ditemukan, silahkan request ulang!') judul = 'Rick Roll'
                var teks = `*TEBAK LAGU*\n\n`+monospace(`Petunjuk : ${judul.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : ${gamewaktu}s`)
                hinata.sendMessage(from, { audio: { url: preview }, mimetype: 'audio/mp4', ptt: true }, { quoted: msg, messageId: 'BAE5'+makeid(10).toUpperCase()+'TL' })
                .then( res => {
                    hinata.sendMessage(from, { text: teks }, { quoted: res })
                    var jawab = judul.toLowerCase()
                    addPlayGame(from, 'Tebak Lagu', jawab, gamewaktu, res, tebaklagu)
                    gameAdd(sender, glimit)
                })
            }).catch((err) => {
                console.log(color('[ ERROR ]', 'red'), err)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${err}` })
            })
            break
        /*
        case prefix+'family100':
            if (isGame(sender, isOwner, gcount, glimit)) return replyDeface(`Limit game kamu sudah habis`)
            if (isPlayGame(from, family100)) return hinata.replyDeface(from, `Masih ada soal yang belum diselesaikan`, family100[getGamePosi(from, family100)].msg)
            addCountCmd('#family100', sender, _cmd)
            var data = JSON.parse(fs.readFileSync('./database/game/family100.json'))
                var teks = `*JAWABLAH SOAL BERIKUT*\n\n*Soal :* ${data.result.soal}\n*Total Jawaban :* ${data.result.total}\n\nWaktu : ${gamewaktu}s`
                hinata.sendMessage(from, { text: teks }, { quoted: msg, messageId: 'BAE5'+makeid(10).toUpperCase()+'FML' })
                // let anoh = anu.result.answer
                .then( res => {
                    let rgfds = []
                    for (let i of data.result.soal) {
                        let fefs = i.split('/') ? i.split('/')[0] : i
                        let iuhbb = fefs.startsWith(' ') ? fefs.replace(' ', '') : fefs
                        let axsf = iuhbb.endsWith(' ') ? iuhbb.replace(iuhbb.slice(-1), '') : iuhbb
                        rgfds.push(axsf.toLowerCase())
                    }
                    addPlayGame(from, 'Family 100', rgfds, gamewaktu, res, family100)
                    gameAdd(sender, glimit)
            }).catch((err) => {
                console.log(color('[ ERROR ]', 'red'), err)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${err}` })
            })
            break
        */
        case prefix+'delgame': case prefix+'deletegame': case prefix+'dellgame': case prefix+'nyerah':
		    if (!isQuotedMsg) return replyDeface(`Balas pesan soal game yang ingin dihapus`)
		    if (quotedMsg.id.endsWith('TG')) {
		        var tg = getGamePosi(from, tebakgambar)
		        if (tg == undefined) return replyDeface(`Game tersebut sudah selesai`)
		        if (tebakgambar[tg].msg.key.id !== quotedMsg.id) return replyDeface(`Game tersebut sudah selesai`)
		        addCountCmd('#nyerah', sender, _cmd)
		        replyDeface(`*Tebak Gambar*\nJawaban : ${tebakgambar[tg].jawaban}`)
		        tebakgambar.splice(tg, 1)
		    } else if (quotedMsg.id.endsWith('KS')) {
		        var ks = getGamePosi(from, kuis)
		        if (ks == undefined) return replyDeface(`Game tersebut sudah selesai`)
		        if (kuis[ks].msg.key.id !== quotedMsg.id) return replyDeface(`Game tersebut sudah selesai`)
		        addCountCmd('#nyerah', sender, _cmd)
		        replyDeface(`*Kuis Game*\nJawaban : ${kuis[ks].jawaban}`)
		        kuis.splice(ks, 1)
		    } else if (quotedMsg.id.endsWith('TL')) {
		        var tl = getGamePosi(from, tebaklagu)
		        if (tl == undefined) return replyDeface(`Game tersebut sudah selesai`)
		        if (tebaklagu[tl].msg.key.id !== quotedMsg.id) return replyDeface(`Game tersebut sudah selesai`)
		        addCountCmd('#nyerah', sender, _cmd)
		        replyDeface(`*Tebal Lagu*\nJawaban : ${tebaklagu[tl].jawaban}`)
		        tebaklagu.splice(tl, 1)
		    } /* else if (quotedMsg.id.endsWith('FML')) {
		        var fml = getGamePosi(from, family100)
		        if (fml == undefined) return replyDeface(`Game tersebut sudah selesai`)
		        if (family100[fml].msg.key.id !== quotedMsg.id) return replyDeface(`Game tersebut sudah selesai`)
		        addCountCmd('#nyerah', sender, _cmd)
		        replyDeface(`*Family 100*\nJawaban : ${family100[fml].jawaban}`)
		        family100.splice(fml, 1)
		    } */ else {
		        replyDeface(`Balas soal game!`)
		    }
		    break
		case prefix+'casino':
            if (!isGroup)return replyDeface(mess.OnlyGrup)
            if (isGame(sender, isOwner, gcount, glimit)) return replyDeface(`Limit game kamu sudah habis`)
            if (args.length < 2) return replyDeface(`Kirim perintah *${command}* @tag nominal`)
            if (mentionUser.length == 0) return replyDeface(`Tag Lawan Yang Ingin Diajak Bermain Game`)
            if (mentionUser.length > 2) return replyDeface('Hanya bisa dengan 1 orang')
            if (mentionUser[0] === sender) return replyDeface(`Sad amat main sama diri sendiri`)
            if (mentionUser[0] === botNumber) return replyDeface(`Tidak bisa bermain dengan bot!`)
            if (fs.existsSync(`./database/${from}.json`)) return replyDeface(`Sedang Ada Sesi, tidak dapat dijalankan secara bersamaan\nKetik *${prefix}delcasino*, untuk menghapus sesi`)
            if (args.length == 2) return replyDeface('Masukan Nominal Nya')
            if (args[2].includes('-')) return replyDeface(`Jangan menggunakan -`)
            if (isNaN(parseInt(args[2]))) return replyDeface('Nominal Harus Berupa Angka!')
            var anu = getBalance(sender, balance)
            var ani = getBalance(mentionUser[0], balance)
            if (anu < args[2] || anu == 'undefined') return replyDeface(`Balance Tidak Mencukupi, Kumpulkan Terlebih Dahulu\nKetik ${prefix}balance, untuk mengecek Balance mu!`)
            if (ani < args[2] || ani == 'undefined') return replyDeface(`Balance Lawan Tidak Mencukupi Untuk Bermain Denganmu\nKetik ${prefix}balance @tag untuk mengecek Balance lawanmu`)
            var casinoo = setCasino(`${from}`)
            casinoo.Z = sender.replace("@s.whatsapp.net", "")
            casinoo.Y = mentionUser[0].split("@")[0]
            casinoo.nominal = parseInt(args[2])
            addCountCmd('#casino', sender, _cmd)
            fs.writeFileSync(`./database/casino/${from}.json`, JSON.stringify(casinoo, null, 2))
            gameAdd(sender, glimit)
            var starGame = `🎰 Memulai Game Casino 💰\n\n▸ @${sender.replace("@s.whatsapp.net", "")} Menantang ${args[1]}, dengan Nominal: *$ ${parseInt(args[2])}*\n▸ Ketik Y/N untuk menerima atau menolak Permainan!`
            hinata.sendMessage(from, { text: starGame, mentions: [sender, args[1].replace("@", "") + "@s.whatsapp.net"] }, { quoted: msg })
            break
        case prefix+'delcasino':
            if (fs.existsSync('./database/casino/'+from+'.json')) {
                var csn = JSON.parse(fs.readFileSync('./database/casino/'+from+'.json'))
                if (csn.Z.includes(sender)) {
                    addCountCmd('#delcasino', sender, _cmd)
                    deleteCasino(from)
                    replyDeface('Berhasil Menghapus Sesi Casino')
		        } else if (csn.Y.includes(sender)) {
                    addCountCmd('#delcasino', sender, _cmd)
                    deleteCasino(from)
                    replyDeface('Berhasil Menghapus Sesi Casino')
                } else if (isGroupAdmins) {
                    addCountCmd('#delcasino', sender, _cmd)
                    deleteCasino(from)
                    replyDeface('Berhasil Menghapus Sesi Casino')
                } else if (isOwner) {
                    addCountCmd('#delcasino', sender, _cmd)
                    deleteCasino(from)
                    replyDeface('Berhasil Menghapu Sesi Casino')
                } else {
	                replyDeface('Anda tidak bisa menghapus sesi casino, karena bukan pemain!')
	            }
            } else {
                replyDeface('Tidak ada sesi yang berlangsung')
            }
            break
        case prefix+'akinator':
            if (isGroup) return replyDeface(mess.OnlyPM)
            if (akinator.hasOwnProperty(sender.split('@')[0])) return replyDeface("Selesain yg sebelumnya dulu atuh")
            var get_result = await akiStart()
            if (get_result.status == 200) {
                var { server, frontaddr, session, signature, question, step } = get_result.result
                const data = {}
                data["server"] = server
                data["frontaddr"] = frontaddr
                data["session"] = session
                data["signature"] = signature
                data["question"] = question
                data["step"] = step
                var ini_txt = `${question}\n\n`
                ini_txt += "0 - Ya\n"
                ini_txt += "1 - Tidak\n"
                ini_txt += "2 - Saya Tidak Tau\n"
                ini_txt += "3 - Mungkin\n"
                ini_txt += "4 - Mungkin Tidak"
                hinata.sendMessage(from, { text: ini_txt }, { quoted: msg }).then(() => {
                    akinator[sender.split('@')[0]] = data
                })
            } else {
                replyDeface(mess.error.api)
            }
            break
        case prefix+'cancelakinator':
            if (isGroup) return replyDeface(mess.OnlyPM)
            if (!akinator.hasOwnProperty(sender.split('@')[0])) return replyDeface("Anda tidak memiliki akinator sebelumnya")
            delete akinator[sender.split("@")[0]]
            replyDeface(`Sukses`)
            break

        // Kerang Menu
        case prefix+'apakah':
            if (!q) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} kamu lonteh`)
            const apa = ['Iya', 'Tidak', 'Bisa Jadi', 'Betul','Bisa Jadi Tidak']
            const kah = apa[Math.floor(Math.random() * apa.length)]
            hinata.sendMessage(from, { text: `Pertanyaan : apakah ${q}\nJawaban : ${kah}` }, { quoted: msg })
            break
        case prefix+'bisakah': case prefix+'bisa': case prefix+'bisagak':
            if (!q) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} saya punya cewe`)
            const bisa = ['Bisa','Gak Bisa','Gak Bisa Ajg Awokwokak','TENTU PASTI KAMU BISA!!!!','TENTU, PASTI KAMU *TIDAK* BISA!!']
            const ga = bisa[Math.floor(Math.random() * bisa.length)]
            hinata.sendMessage(from, { text: `Pertanyaan : bisakah ${q}\nJawaban : ${ga}` }, { quoted: msg })
            break
        case prefix+'kapankah': case prefix+'kapan':
            if (!q) return replyDeface(`Gunakan dengan cara ${command} Pertanyaan\n\nContoh : ${command} saya punya cewe`)
            const kapan = ['5 Hari Lagi', '10 Hari Lagi', '15 Hari Lagi','20 Hari Lagi', '25 Hari Lagi','30 Hari Lagi','35 Hari Lagi','40 Hari Lagi','45 Hari Lagi','50 Hari Lagi','55 Hari Lagi','60 Hari Lagi','65 Hari Lagi','70 Hari Lagi','75 Hari Lagi','80 Hari Lagi','85 Hari Lagi','90 Hari Lagi','100 Hari Lagi','5 Bulan Lagi', '10 Bulan Lagi', '15 Bulan Lagi','20 Bulan Lagi', '25 Bulan Lagi','30 Bulan Lagi','35 Bulan Lagi','40 Bulan Lagi','45 Bulan Lagi','50 Bulan Lagi','55 Bulan Lagi','60 Bulan Lagi','65 Bulan Lagi','70 Bulan Lagi','75 Bulan Lagi','80 Bulan Lagi','85 Bulan Lagi','90 Bulan Lagi','100 Bulan Lagi','1 Tahun Lagi','2 Tahun Lagi','3 Tahun Lagi','4 Tahun Lagi','5 Tahun Lagi','Besok','Lusa',`Abis Ini Juga Lu ${q}`]
            const kapankah = kapan[Math.floor(Math.random() * kapan.length)]
            hinata.sendMessage(from, { text: `Pertanyaan : kapankah ${q}\nJawaban : *${kapankah}*` }, { quoted: msg })
            break
        case prefix+'bagaimanakah': case prefix+'gimanakah': case prefix+'gimana':
            if (!q) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} cara punya cewe`)
            const gimana = ['Ga Gimana2', 'Sulit Itu Bro', 'Maaf Bot Tidak Bisa Menjawab', 'Coba Deh Cari Di Gugel','Astaghfirallah Beneran???','Pusing ah','Ooh Gitu','Yang Sabar Ya Bos','Gimana yeee']
            const ya = gimana[Math.floor(Math.random() * gimana.length)]
            hinata.sendMessage(from, { text: `Pertanyaan : bagaimanakah ${q}\nJawaban : ${ya}` }, { quoted: msg })
            break
        case prefix+'rate': case prefix+'nilai':
            if (!q) return replyDeface(`Gunakan dengan cara ${command} text\n\nContoh : ${command} kebesaran titit sy`)
            const ra = ['5', '10', '15' ,'20', '25','30','35','40','45','50','55','60','65','70','75','80','85','90','100']
            const te = ra[Math.floor(Math.random() * ra.length)]
            hinata.sendMessage(from, { text: `Rate : ${q}\nJawaban : *${te}%*` }, { quoted: msg })
            break
        case prefix+'gantengcek': case prefix+'cekganteng':
            if (!q) return replyDeface(`Gunakan dengan cara ${command} Nama\n\nContoh : ${command} Riy`)
            const gan = ['5', '10', '15' ,'20', '25','30','35','40','45','50','55','60','65','70','75','80','85','90','100']
            const teng = gan[Math.floor(Math.random() * gan.length)]
            hinata.sendMessage(from, { text: `Nama : ${q}\nJawaban : *${teng}%*` }, { quoted: msg })
            break
        case prefix+'cantikcek': case prefix+'cekcantik':
            if (!q) return replyDeface(`Gunakan dengan cara ${command} Nama\n\nContoh : ${command} ${pushname}`)
            const can = ['5', '10', '15' ,'20', '25','30','35','40','45','50','55','60','65','70','75','80','85','90','100']
            const tik = can[Math.floor(Math.random() * can.length)]
            hinata.sendMessage(from, { text: `Nama : ${q}\nJawaban : *${tik}%*` }, { quoted: msg })
            break
        case prefix+'sangecek': case prefix+'ceksange': case prefix+'gaycek': case prefix+'cekgay': case prefix+'lesbicek': case prefix+'ceklesbi':
            if (!q) return replyDeface(`Gunakan dengan cara ${command} Nama\n\nContoh : ${command} ${pushname}`)
            const sangeh = ['5', '10', '15','20', '25','30','35','40','45','50','55','60','65','70','75','80','85','90','100']
            const sange = sangeh[Math.floor(Math.random() * sangeh.length)]
            hinata.sendMessage(from, { text: `Nama : ${q}\nJawaban : *${sange}%*` }, { quoted: msg })
            break
        case prefix+'cekbapak':
            const bapak = ['Wah Mantap Lu Masih Punya Bapack\nPasti Bapack Nya Kuli :v\nAwowkwokwwok\n#CandabOs', 'Aowkwwo Disini Ada Yteam :v\nLu Yteam Bro? Awowkwowk\nSabar Bro Ga Punya Bapack\n#Camda', 'Bjir Bapack Mu Ternyata Sudah Cemrai\nSedih Bro Gua Liatnya\nTapi Nih Tapi :v\nTetep Ae Lu Yteam Aowkwowkw Ngakak :v', 'Jangan #cekbapak Mulu Broo :v\nKasian Yang Yteam\nNtar Tersinggung Kan\nYahahaha Hayyuk By : Paiz 01']
            const bapack = bapak[Math.floor(Math.random() * bapak.length)]
            hinata.sendMessage(from, { text: bapack }, { quoted: msg })
            break

        // Search Menu
        case prefix+'lirik': case 'liriklagu':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *judul*\n\n_Contoh_\n\n${command} Bila Nanti`)
            replyDeface(mess.wait)
            addCountCmd('#lirik', sender, _cmd)
            ra.Musikmatch(q).then(async(data) => {
                var teks = `*${data.result.judul} - ${data.result.penyanyi}*\n\n${data.result.lirik}`
                hinata.sendMessage(from, { image: { url: data.result.thumb }, caption: teks }, { quoted: msg })
                limitAdd(sender, limit)
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(`Judul lagu tidak ditemukan`)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'grupwa': case prefix+'searchgrup':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *nama group*\n\n_Contoh_\n\n${command} Bot WhatsApp`)
            replyDeface(mess.wait)
            addCountCmd('#grupwa', sender, _cmd)
            hxz.linkwa(q).then(async(data) => {
                if (data.length == 0) return replyDeface(`Grup ${q} tidak ditemukan`)
                var teks = `*Hasil Pencarian Dari ${q}*\n\n`
                for (let x of data) {
                    teks += `*Nama :* ${x.nama}\n*Link :* ${x.link}\n\n`
                }
                replyDeface(teks)
                limitAdd(sender, limit)
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(`Hasil pencarian dari ${q} tidak ditemukan`)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'pinterest':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *query* atau ${command} *query --jumlah*\nContoh :\n${command} cecan atau ${command} cecan --10`)
            replyDeface(mess.wait)
            addCountCmd('#pinterest', sender, _cmd)
            var jumlah;
            if (q.includes('--')) jumlah = q.split('--')[1]
            pinterest(q.replace('--'+jumlah, '')).then(async(data) => {
                if (q.includes('--')) {
                    if (data.result.length < jumlah) {
                        jumlah = data.result.length
                        replyDeface(`Hanya ditemukan ${data.result.length}, foto segera dikirim`)
                    }
                    for (let i = 0; i < jumlah; i++) {
                        hinata.sendMessage(from, { image: { url: data.result[i] }})
                    }
                    limitAdd(sender, limit)
                } else {
                    var but = [{ urlButton: { displayText: `Photo Source`, url: `https://www.pinterest.com` } }, { quickReplyButton: { displayText: `Next Photo`, id: `${command} ${q}` } }]
                    hinata.sendMessage(from, { caption: `Hasil pencarian dari ${q}`, image: { url: pickRandom(data.result) }, templateButtons: but, footer: 'Pencet tombol dibawah untuk foto selanjutnya' }, { quoted: msg })
                    limitAdd(sender, limit)
                }
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'yts': case prefix+'ytsearch':{
			if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *query*\n\n_Contoh_\n\n${command} Bila Nanti`)
            replyDeface(mess.wait)
            addCountCmd('#ytsearch', sender, _cmd)
            let search = await yts(q)
            let listSerch = []
            for (let i of search.all) {
                listSerch.push({
                    title: i.title, rowId: `${prefix}play ${i.url}`, description: `▸ Channel : ${i.author.name}\n▸ Duration : ${i.timestamp}`
                })
            }
            const listSearch = {
                text: `*Youtube Search*\n\nResult From ${q}`,
                footer: footxt,
                buttonText: "List Search",
                sections: [{
                   title: "Total Search " + search.all.length, rows: listSerch
                }]
            }
            hinata.sendMessage(from, listSearch, { quoted: msg })
            limitAdd(sender, limit)
            }
            break
		case prefix+'whatmusic': case prefix+'whatmusik':
            if (!isPremium) return replyDeface(mess.OnlyPrem)
            if (isVideo || isQuotedVideo || isQuotedAudio) {
            replyDeface(mess.wait)
            addCountCmd('#whatmusic', sender, _cmd)
            try {
                var media;
                if (isVideo || isQuotedVideo) {
                    media = await downloadAndSaveMediaMessage('video', './sticker/a'+sender+'.mp3')
                } else if (isQuotedAudio) {
                    media = await downloadAndSaveMediaMessage('audio', './sticker/a'+sender+'.mp3')
                }
                const acr = new acrcloud({
                    host: "identify-eu-west-1.acrcloud.com",
                    access_key: "1598f147ee841b02dc18821a1be79fae",
                    access_secret: "FLMLqyIMv19PHb8L4Xgy86YeD1K2qrHQFnL3muYO"
                });
                var sampleq = fs.readFileSync('./sticker/a'+sender+'.mp3')
                var metadata = await acr.identify(sampleq)
                console.log(metadata)
                hinata.replyDeface(from, `*「 Berhasil Ditemukan 」*\n\n➸ Judul Lagu : ${metadata.metadata.music[0].title}\n➸ Artis : ${metadata.metadata.music[0].artists[0].name}\n➸ Album : ${metadata.metadata.music[0].album.name}\n➸ Rilis : ${metadata.metadata.music[0].release_date}`, msg)
                fs.unlinkSync('./sticker/a'+sender+'.mp3')
            } catch (e) {
                fs.unlinkSync('./sticker/a'+sender+'.mp3')
                replyDeface(`Lagu tidak dapat ditemukan, atau ukuran lagu yang terlalu besar!`)
            }
            } else {
                replyDeface(`Reply video/audio dan sertakan caption ${prefix}whatmusic`)
            }
            break
        case prefix+'igstalk': case prefix+'stalkig':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *username*\n\n_Contoh_\n\n${command} fz_frdnd`)
            replyDeface(mess.wait)
            clph.search.igstalk(q).then( data => {
                var capt = `*INSTAGRAM-STALK*\n\n▸ Name : ${data.data.fullname}\n▸ Username : ${q}\n▸ Followers : ${data.data.follower}\n▸ Following : ${data.data.following}\n▸ Posting : ${data.data.timeline}\n\n*Biography*\n${data.data.bio}\n\n*ACCOUNT-INFO*\n▸ Private : ${data.data.private}\n▸ Verified : ${data.data.verified}`
                hinata.sendMessage(from, { image: { url: data.profile.high }, caption: capt })
            }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'googlelens': case prefix+'glens': case prefix+'searchbyimage': case prefix+'golens': case prefix+'searchbyimg':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (isImage || isQuotedImage) {
                replyDeface(mess.wait)
                addCountCmd('#googlelens', sender, _cmd)
                var media = await hinata.downloadAndSaveMediaMessage(msg, 'image', `./sticker/glens${sender}.jpg`)
                var mediaLink = (await ra.UploadFile(media)).result.namaFile
                var data = await goLens(mediaLink)
                var teks = `*Data Berhasil Di Dapatkan!*\n\n*Url Photo :* ${data.imgUrl}\n\nPencet Tombol "Menuju Pencarian" atau "Ambil Link" di bawah untuk menuju ke pencarian yang anda Cari!`
                var but = [{ urlButton: { displayText: 'Menuju Pencarian', url: `${data.url}` } }, { quickReplyButton: { displayText: 'Get Link', id: `${prefix}getglink ${data.imgUrl}` } }]
                hinata.sendMessage(from, { caption: teks, image: fs.readFileSync(media), templateButtons: but, footer: footxt, mentions: [sender] }, { quoted: msg })
                fs.unlinkSync(media)
                limitAdd(sender, limit)
            } else {
                replyDeface(`Kirim/Balas gambar yang ingin dicari!`)
            }
            break
        case prefix+'getglink':
            if (type !== 'templateButtonReplyMessage') return
            goLens(args[1]).then( data => {
                replyDeface(data.url)
            })
            break
       
        // Random Menu
        case prefix+'quote': case prefix+'quotes': case prefix+'randomquote': case prefix+'randomquotes':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            addCountCmd('#quotes', sender, _cmd)
            var data = await fetchJson(`https://megayaa.herokuapp.com/api/randomquote`)
            replyDeface(data.result.quotes+'\n\n-- '+data.result.author)
            limitAdd(sender, limit)
            .catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'cecan': case prefix+'cewek':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            replyDeface(mess.wait)
            addCountCmd('#cecan', sender, _cmd)
            var query = ["cecan hd","cecan indo","cewe cantik", "cewe aesthetic", "cecan aesthetic"]
            var data = await pinterest(pickRandom(query))
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: pickRandom(data.result) }}, { quoted: msg})
            limitAdd(sender, limit)
            .catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
        case prefix+'cogan': case prefix+'cowok':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            replyDeface(mess.wait)
            addCountCmd('#cogan', sender, _cmd)
            var query = ["cogan hd","cogan indo","cowo ganteng","handsome boy","hot boy","oppa","cowo aesthetic","cogan aesthetic"]
            var data = await pinterest(pickRandom(query))
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: pickRandom(data.result) }}, { quoted: msg})
            limitAdd(sender, limit)
            .catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
            break
		case prefix+'waifu':
		    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
		    replyDeface(mess.wait)
		    addCountCmd('#waifu', sender, _cmd)
		    var data = (await axios.get('https://waifu.pics/api/sfw/waifu')).data.url
		    var mbut = [{ buttonId: command, buttonText: { displayText: 'Next Photo' }, type: 1 }]
            hinata.sendMessage(from, { caption: "Random Waifu", image: data, buttons: mbut, headerType: 'IMAGE', footer: 'Pencet tombol dibawah untuk foto selanjutnya' }, { quoted: msg })
		    limitAdd(sender, limit)
		    .catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
		    break
        case prefix+'meme':
		    if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
		    replyDeface(mess.wait)
		    addCountCmd('#meme', sender, _cmd)
		    fetchJson(`https://docs-api-zahirrr.herokuapp.com/api/meme`).then( meme => {
		      hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: meme.url }}, { quoted: msg})
		        limitAdd(sender, limit)
		    }).catch((e) => {
                console.log(color('[ ERROR ]', 'red'), e)
                replyDeface(mess.error.api)
                hinata.sendMessage(ownerNumber, { text: `${command} error : ${e}` })
            })
		    break
		case prefix+'dark': case prefix+'darkjoke': case prefix+'darkjokes':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                addCountCmd('#darkjokes', sender, _cmd)
                replyDeface(mess.wait)
                var data = JSON.parse(fs.readFileSync('./database/random/darkjokes.json'))
                data = pickRandom(data)
                hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data.result }}, { quoted: msg})
                limitAdd(sender, limit)
                break
        case prefix+'couple': case prefix+'ppcouple':
            	if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            	addCountCmd('#couple', sender, _cmd)
                replyDeface(mess.wait)
                var anu = JSON.parse(fs.readFileSync('./database/random/couple.json'))
                var random = pickRandom(anu)
                hinata.sendMessage(from, { image: { url: random.male }, caption: `Male` }, { quoted: msg })
                hinata.sendMessage(from, { image: { url: random.female }, caption: `Female` }, { quoted: msg })
                limitAdd(sender, limit)
                break

          // Asupan Menu
            case prefix+'asupan':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                addCountCmd('#asupan', sender, _cmd)
                replyDeface(mess.wait)
                var data = JSON.parse(fs.readFileSync('./database/random/asupan.json'))
                data = pickRandom(data)
                hinata.sendMessage(from, { caption: 'Jangan Lupa Subscribe : https://youtube.com/channel/UCR2iLtp3jno9K9F9ObSiwbg', video: { url: data.url }}, { quoted: msg})
                limitAdd(sender, limit)
                break
            case prefix+'bocil':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isPremium) return rely(mess.OnlyPrem)
                addCountCmd('#bocil', sender, _cmd)
                replyDeface(mess.wait)
                var data = JSON.parse(fs.readFileSync('./database/random/bocil.json'))
                data = pickRandom(data)
                hinata.sendMessage(from, { caption: 'Jangan Lupa Subscribe : https://youtube.com/channel/UCR2iLtp3jno9K9F9ObSiwbg', video: { url: data.url }}, { quoted: msg})
                limitAdd(sender, limit)
                break
             case prefix+'geayubi':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isPremium) return rely(mess.OnlyPrem)
                addCountCmd('#geayubi', sender, _cmd)
                replyDeface(mess.wait)
                var data = JSON.parse(fs.readFileSync('./database/random/geayubi.json'))
                data = pickRandom(data)
                hinata.sendMessage(from, { caption: 'Jangan Lupa Subscribe : https://youtube.com/channel/UCR2iLtp3jno9K9F9ObSiwbg', video: { url: data.url }}, { quoted: msg})
                limitAdd(sender, limit)
                break
             case prefix+'hijaber':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isPremium) return rely(mess.OnlyPrem)
                addCountCmd('#hijaber', sender, _cmd)
                replyDeface(mess.wait)
                var data = JSON.parse(fs.readFileSync('./database/random/hijaber.json'))
                data = pickRandom(data)
                hinata.sendMessage(from, { caption: 'Jangan Lupa Subscribe : https://youtube.com/channel/UCR2iLtp3jno9K9F9ObSiwbg', video: { url: data.url }}, { quoted: msg})
                limitAdd(sender, limit)
                break
             case prefix+'rikagusriani':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isPremium) return rely(mess.OnlyPrem)
                addCountCmd('#rikagusriani', sender, _cmd)
                replyDeface(mess.wait)
                var data = JSON.parse(fs.readFileSync('./database/random/rikagusriani.json'))
                data = pickRandom(data)
                hinata.sendMessage(from, { caption: 'Jangan Lupa Subscribe : https://youtube.com/channel/UCR2iLtp3jno9K9F9ObSiwbg', video: { url: data.url }}, { quoted: msg})
                limitAdd(sender, limit)
                break
             case prefix+'santuy':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isPremium) return rely(mess.OnlyPrem)
                addCountCmd('#santuy', sender, _cmd)
                replyDeface(mess.wait)
                var data = JSON.parse(fs.readFileSync('./database/random/santuy.json'))
                data = pickRandom(data)
                hinata.sendMessage(from, { caption: 'Jangan Lupa Subscribe : https://youtube.com/channel/UCR2iLtp3jno9K9F9ObSiwbg', video: { url: data.url }}, { quoted: msg})
                limitAdd(sender, limit)
                break
             case prefix+'ukhty':
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply (`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!isPremium) return rely(mess.OnlyPrem)
                addCountCmd('#ukhty', sender, _cmd)
                replyDeface(mess.wait)
                var data = JSON.parse(fs.readFileSync('./database/random/ukhty.json'))
                data = pickRandom(data)
                hinata.sendMessage(from, { caption: 'Jangan Lupa Subscribe : https://youtube.com/channel/UCR2iLtp3jno9K9F9ObSiwbg', video: { url: data.url }}, { quoted: msg})
                limitAdd(sender, limit)
                break

         // Textpro Menu
         case prefix+'pencil':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#pencil', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-a-sketch-text-effect-online-1044.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'glitch':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#glitch', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-impressive-glitch-text-effects-online-1027.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'glitch2':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} text1|text2`)
            if (!q.includes('|')) return replyDeface(`Format salah, contoh pemakaian ${command} Riy|04`)
            if (q.length > 21) return replyDeface(`Teksnya kebanyakan`)
            var tek1 = q.split('|')[0]
            var tek2 = q.split('|')[1]
            if (!tek2) return replyDeface(`Format salah, contoh pemakaian ${command} Riy|04`)
            if (tek1.length > 10) return replyDeface(`Teks 1 kepanjangan`)
            if (tek2.length > 10) return replyDeface(`Teks 2 kepanjangan`)
            replyDeface(mess.wait)
            addCountCmd('#glitch2', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-a-glitch-text-effect-online-free-1026.html', [tek1, tek2])
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'glitchtiktok':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} text1|text2`)
            if (!q.includes('|')) return replyDeface(`Format salah, contoh pemakaian ${command} Riy|04`)
            if (q.length > 21) return replyDeface(`Teksnya kebanyakan`)
            var tek1 = q.split('|')[0]
            var tek2 = q.split('|')[1]
            if (!tek2) return replyDeface(`Format salah, contoh pemakaian ${command} Riy|04`)
            if (tek1.length > 10) return replyDeface(`Teks 1 kepanjangan`)
            if (tek2.length > 10) return replyDeface(`Teks 2 kepanjangan`)
            replyDeface(mess.wait)
            addCountCmd('#glitchtiktok', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-glitch-text-effect-style-tik-tok-983.html', [tek1, tek2])
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'pornhub':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} text1|text2`)
            if (!q.includes('|')) return replyDeface(`Format salah, contoh pemakaian ${command} Riy|04`)
            if (q.length > 13) return replyDeface(`Teksnya kebanyakan`)
            var tek1 = q.split('|')[0]
            var tek2 = q.split('|')[1]
            if (!tek2) return replyDeface(`Format salah, contoh pemakaian ${command} Riy|04`)
            if (tek1.length > 6) return replyDeface(`Teks 1 kepanjangan`)
            if (tek2.length > 6) return replyDeface(`Teks 2 kepanjangan`)
            replyDeface(mess.wait)
            addCountCmd('#pornhub', sender, _cmd)
            mumaker.textpro('https://textpro.me/pornhub-style-logo-online-generator-free-977.html', [tek1, tek2])
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'blackpink':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#blackpink', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-blackpink-logo-style-online-1001.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'berry':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#berry', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-berry-text-effect-online-free-1033.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'neon':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#neon', sender, _cmd)
            mumaker.textpro('https://textpro.me/neon-light-text-effect-online-882.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'3d-christmas':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#3d-christmas', sender, _cmd)
            mumaker.textpro('https://textpro.me/3d-christmas-text-effect-by-name-1055.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'3d-boxtext':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#3d-boxtext', sender, _cmd)
            mumaker.textpro('https://textpro.me/3d-box-text-effect-online-880.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'3d-neon-light':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#3d-neon-light', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-3d-neon-light-text-effect-online-1028.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'3d-orange-juice':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#3d-orange-juice', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-a-3d-orange-juice-text-effect-online-1084.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'logo-bear':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#logobear', sender, _cmd)
            mumaker.textpro('https://textpro.me/online-black-and-white-bear-mascot-logo-creation-1012.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'logo-ninja':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#logo-ninja', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-ninja-logo-online-935.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'thunder':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#thunder', sender, _cmd)
            mumaker.textpro('https://textpro.me/online-thunder-text-effect-generator-1031.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'video-game-classic':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} text1|text2`)
            if (!q.includes('|')) return replyDeface(`Format salah, contoh pemakaian ${command} Riy|04`)
            if (q.length > 21) return replyDeface(`Teksnya kebanyakan`)
            var tek1 = q.split('|')[0]
            var tek2 = q.split('|')[1]
            if (!tek2) return replyDeface(`Format salah, contoh pemakaian ${command} Riy|04`)
            if (tek1.length > 10) return replyDeface(`Teks 1 kepanjangan`)
            if (tek2.length > 10) return replyDeface(`Teks 2 kepanjangan`)
            replyDeface(mess.wait)
            addCountCmd('#video-game-classic', sender, _cmd)
            mumaker.textpro('https://textpro.me/video-game-classic-8-bit-text-effect-1037.html', [tek1, tek2])
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'marvel-studios':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} text1|text2`)
            if (!q.includes('|')) return replyDeface(`Format salah, contoh pemakaian ${command} Riy|04`)
            if (q.length > 21) return replyDeface(`Teksnya kebanyakan`)
            var tek1 = q.split('|')[0]
            var tek2 = q.split('|')[1]
            if (!tek2) return replyDeface(`Format salah, contoh pemakaian ${command} Riy|04`)
            if (tek1.length > 10) return replyDeface(`Teks 1 kepanjangan`)
            if (tek2.length > 10) return replyDeface(`Teks 2 kepanjangan`)
            replyDeface(mess.wait)
            addCountCmd('#marvel-studios', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-logo-style-marvel-studios-online-971.html', [tek1, tek2])
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'green-horror':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#green-horror', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-green-horror-style-text-effect-online-1036.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'magma':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#magma', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-a-magma-hot-text-effect-online-1030.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'chocolate-cake':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#chocolate-cake', sender, _cmd)
            mumaker.textpro('https://textpro.me/create-a-sketch-text-effect-online-1044.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'strawberry':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#strawberry', sender, _cmd)
            mumaker.textpro('https://textpro.me/chocolate-cake-text-effect-890.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break

        // Photooxy Menu
        case prefix+'flaming':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#flaming', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/realistic-flaming-text-effect-online-197.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'shadow-sky':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#shadow-sky', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/shadow-text-effect-in-the-sky-394.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'metallic':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#metallic', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/other-design/create-metallic-text-glow-online-188.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'logo-naruto':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#logo-naruto', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/manga-and-anime/make-naruto-banner-online-free-378.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
            case prefix+'logo-pubg':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#logo-pubg', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/battlegrounds/make-wallpaper-battlegrounds-logo-text-146.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'under-grass':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#under-grass', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/make-quotes-under-grass-376.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'harry-potter':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#harry-potter', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/create-harry-potter-text-on-horror-background-178.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'flower-typography':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#flower-typography', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/art-effects/flower-typography-text-effect-164.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'picture-of-love':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#picture-of-love', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/create-a-picture-of-love-message-377.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'coffee-cup':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#coffee-cup', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/put-any-text-in-to-coffee-cup-371.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'butterfly':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#butterfly', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/butterfly-text-with-reflection-effect-183.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'night-sky':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#night-sky', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/write-stars-text-on-the-night-sky-200.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'carved-wood':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#carved-wood', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/carved-wood-effect-online-171.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'illuminated-metallic':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#illuminated-metallic', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/illuminated-metallic-effect-177.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        case prefix+'sweet-candy':
            if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return replyDeface(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            if (q.length > 10) return replyDeface(`Teksnya kebanyakan`)
            replyDeface(mess.wait)
            addCountCmd('#sweet-candy', sender, _cmd)
            mumaker.photooxy('https://photooxy.com/logo-and-text-effects/sweet-andy-text-online-168.html', q)
            .then( data => {
            hinata.sendMessage(from, { caption: `Jangan Lupa Subscribe : ${ytPaiz_01}`, image: { url: data }}, { quoted: msg})
            limitAdd(sender, limit)
            }).catch((e) => replyDeface(mess.error.api))
            break
        // Balance Menu
        case prefix+'topbalance':{
            addCountCmd('#topbalance', sender, _cmd)
            balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
            let top = '*── 「 TOP BALANCE 」 ──*\n\n'
            let arrTop = []
            var total = 10
            if (balance.length < 10) total = balance.length
            for (let i = 0; i < total; i ++){
                top += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                arrTop.push(balance[i].id)
            }
            mentions(top, arrTop, true)
            }
            break
        case prefix+'buylimit':{
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *jumlah limit yang ingin dibeli*\n\nHarga 1 limit = $50 balance`)
            if (args[1].includes('-')) return replyDeface(`Jangan menggunakan -`)
            if (isNaN(args[1])) return replyDeface(`Harus berupa angka`)
            if (args[1].toLowerCase() === 'infinity') return replyDeface(`Yahaha saya ndak bisa di tipu`)
            let ane = Number(parseInt(args[1]) * 50)
            if (getBalance(sender, balance) < ane) return replyDeface(`Balance kamu tidak mencukupi untuk pembelian ini`)
            addCountCmd('#buylimit', sender, _cmd)
            kurangBalance(sender, ane, balance)
            giveLimit(sender, parseInt(args[1]), limit)
            replyDeface(monospace(`Pembeliaan limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Limit : ${getLimit(sender, limitCount, limit)}/${limitCount}`))
            }
            break
        case prefix+'buygamelimit': case prefix+'buyglimit':{
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *jumlah game limit yang ingin dibeli*\n\nHarga 1 game limit = $50 balance\nPajak $1 / $10`)
            if (args[1].includes('-')) return replyDeface(`Jangan menggunakan -`)
            if (isNaN(args[1])) return replyDeface(`Harus berupa angka`)
            if (args[1].toLowerCase() === 'infinity') return replyDeface(`Yahaha saya ndak bisa di tipu`)
            let ane = Number(parseInt(args[1]) * 50)
            if (getBalance(sender, balance) < ane) return replyDeface(`Balance kamu tidak mencukupi untuk pembelian ini`)
            addCountCmd('#buygamelimit', sender, _cmd)
            kurangBalance(sender, ane, balance)
            givegame(sender, parseInt(args[1]), glimit)
            replyDeface(monospace(`Pembeliaan game limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Game Limit : ${cekGLimit(sender, gcount, glimit)}/${gcount}`))
            }
            break
        case prefix+'transfer': case prefix+'tf':{
            if (args.length < 2) return mentions(`Gunakan dengan cara ${command} *@tag nominal*\n\nContoh : ${command} @${mark.split("@")[0]} 2000`, [mark], true)
            if (mentionUser.length == 0) return replyDeface(`Tag orang yang ingin di transfer balance`)
            if (!args[2]) return replyDeface(`Masukkan nominal nya!`)
            if (isNaN(args[2])) return replyDeface(`Nominal harus berupa angka!`)
            if (args[2].toLowerCase() === 'infinity') return replyDeface(`Yahaha saya ndak bisa di tipu`)
            if (args[2].includes("-")) return replyDeface(`Jangan menggunakan -`)
            var anu = getBalance(sender, balance)
            if (anu < args[2] || anu == 'undefined') return replyDeface(`Balance Kamu Tidak Mencukupi Untuk Transfer Sebesar $${args[2]}, Kumpulkan Terlebih Dahulu\nKetik ${prefix}balance, untuk mengecek Balance mu!`)
            addCountCmd('#transfer', sender, _cmd)
            kurangBalance(sender, parseInt(args[2]), balance)
            addBalance(mentionUser[0], parseInt(args[2]), balance)
            mentions(`Sukses transfer balance sebesar $${args[2]} kepada @${mentionUser[0].split("@")[0]}`, [mentionUser[0]], true)
            }
            break
        case prefix+'limit': case prefix+'balance': case prefix+'ceklimit': case prefix+'cekbalance':
            if (mentioned.length !== 0){
                addCountCmd('#limit', sender, _cmd)
                var Ystatus = ownerNumber.includes(mentioned[0])
                var isPrim = Ystatus ? true : _prem.checkPremiumUser(mentioned[0], premium)
                var ggcount = isPrim ? gcounti.prem : gcounti.user
                var limitMen = `${getLimit(mentioned[0], limitCount, limit)}`
                replyDeface(`💳 Limit : ${_prem.checkPremiumUser(mentioned[0], premium) ? 'Unlimited' : limitMen}/${limitCount}\n🕹️ Limit Game : ${cekGLimit(mentioned[0], ggcount, glimit)}/${ggcount}\n🏦 Balance : $${getBalance(mentioned[0], balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit *jumlah* dan ${prefix}buyglimit *jumlah* untuk membeli game limit\n\n*Example :*\n${prefix}buylimit 1\n${prefix}buyglimit 1\n\n*Note :*\n▸ Harga 1 limit = $50 balance`)
            } else {
                addCountCmd('#limit', sender, _cmd)
                var limitPrib = `${getLimit(sender, limitCount, limit)}/${limitCount}`
                replyDeface(`💳 Limit : ${isPremium ? 'Unlimited' : limitPrib}\n🕹️ Limit Game : ${cekGLimit(sender, gcount, glimit)}/${gcount}\n🏦 Balance : $${getBalance(sender, balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit *jumlah* dan ${prefix}buyglimit *jumlah* untuk membeli game limit\n\n*Example :*\n${prefix}buylimit 1\n${prefix}buyglimit 1\n\n*Note :*\n▸ Harga 1 limit = $50 balance`)
            }
            break

        // Baileys
        case prefix+'fitnah':
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (args.length < 2) return mentions(`Gunakan dengan cara ${command} *@tag|pesantarget|pesanbot*\n\n_Contoh_\n\n${command} @${mark.split("@")[0]}|enak ga semalem|enak banget`, [mark], true)
            var org = q.split("|")[0]
            var target = q.split("|")[1];
            var bot = q.split("|")[2];
            if (!org.startsWith('@')) return replyDeface('Tag orangnya')
            if (!target) return replyDeface(`Masukkan pesan target!`)
            if (!bot) return replyDeface(`Masukkan pesan bot!`)
            var mens = parseMention(target)
            addCountCmd('#fitnah', sender, _cmd)
            var msg1 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { extemdedTextMessage: { text: `${target}`, contextInfo: { mentionedJid: mens }}}}
            var msg2 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { conversation: `${target}` }}
            hinata.sendMessage(from, { text: bot, mentions: mentioned }, { quoted: mens.length > 2 ? msg1 : msg2 })
            break
	    case prefix+'q': case prefix+'getquotedmsg': case prefix+'getquoted': case prefix+'quoted':
            if (!isPremium) return replyDeface(mess.OnlyPrem)
            if (!isQuotedMsg) return replyDeface(`Balas Pesannya!`)
            var data = await store.loadMessage(from, quotedMsg.id)
            if (data.isQuotedMsg !== true) return replyDeface(`The message you replied to contained no reply`)
            var typ = Object.keys(data.message)[0]
            addCountCmd('#getquotedmsg', sender, _cmd)
            if (data.message[typ].contextInfo.quotedMessage.conversation) {
	            replyDeface(`${data.message[typ].contextInfo.quotedMessage.conversation}`)
            } else {
                var anu = data.message[typ].contextInfo.quotedMessage
                hinata.sendMessageFromContent(from, anu)
	        }
	        break
	    case prefix+'fakehidetag':
	        if (!isPremium) return rely(mess.OnlyPrem)
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            if (args.length < 2) return mentions(`Gunakan dengan cara ${command} *@tag|text*\n\n_Contoh_\n\n${command} @${mark.split("@")[0]}|Halo`, [mark], true)
            var org = q.split("|")[0]
            var teks = q.split("|")[1];
            if (!org.startsWith('@')) return replyDeface('Tag orangnya')
            var mem2 = []
            groupMembers.map( i => mem2.push(i.id) )
            var mens = parseMention(target)
            addCountCmd('#fakehidetag', sender, _cmd)
            var msg1 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { extemdedTextMessage: { text: `${prefix}hidetag ${teks}`, contextInfo: { mentionedJid: mens }}}}
            var msg2 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { conversation: `${prefix}hidetag ${teks}` }}
            hinata.sendMessage(from, { text: teks ? teks : '', mentions: mem2 }, { quoted: mens.length > 2 ? msg1 : msg2 })
            break
        case prefix+'react':
            if (!isOwner) return replyDeface(mess.OnlyOwner)
            if (!isQuotedMsg) return replyDeface(`Balas pesannya`)
            if (args.length < 2) return replyDeface(`Masukkan 1 emoji`)
            if (!isEmoji(args[1])) return replyDeface(`Itu bukan emoji!`)
            if (isEmoji(args[1]).length > 1) return replyDeface(`Satu aja emojinya`)
            addCountCmd('#react', sender, _cmd)
            var reactMsg = { reactionMessage: {
                key: {
                    remoteJid: from,
                    fromMe: quotedMsg.fromMe,
                    id: quotedMsg.id,
                    participant: quotedMsg.sender
                    },
                text: args[1]
            }
            }
            hinata.sendMessageFromContent(from, reactMsg)
            break
        case prefix+'setcmd':
            if (!isPremium && !isOwner && !fromMe) return replyDeface(mess.OnlyPrem)
            if (!isQuotedSticker) return replyDeface('Reply stickernya..')
            if (!q) return replyDeface(`Masukan balasannya...\nContoh: ${prefix}setcmd #menu`)
            addCountCmd('#setcmd', sender, _cmd)
            if (checkRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB) === true) return replyDeface('Key hex tersebut sudah terdaftar di database!')
            addRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), q, sender, responDB)
            replyDeface(`▸ *Key:* ${msg.quotedMsg.stickerMessage.fileSha256.toString('hex')}\n▸ *Action:* ${q}\n\nBerhasil di set`)
            break
        case prefix+'delcmd':
            if (!isPremium && !isOwner && !fromMe) return replyDeface(mess.OnlyPrem)
            if (!isQuotedSticker) return replyDeface('Reply stickernya..')
            addCountCmd('#delcmd', sender, _cmd)
            if (!deleteRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB)) return replyDeface('Key hex tersebut tidak ada di database')
            deleteRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB)
            replyDeface(`Berhasil remove key hex ${msg.quotedMsg.stickerMessage.fileSha256.toString('hex')}`)
            break

        // Owners Menu
        case prefix+'exif':
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            addCountCmd('#exif', sender, _cmd)
            var namaPack = q.split('|')[0] ? q.split('|')[0] : q
            var authorPack = q.split('|')[1] ? q.split('|')[1] : ''
            exif.create(namaPack, authorPack)
            replyDeface(`Sukses membuat exif`)
            break
        case prefix+'join':
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} _linkgrup_`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            var url = args[1]
            addCountCmd('#join', sender, _cmd)
            url = url.split('https://chat.whatsapp.com/')[1]
            var data = await hinata.groupAcceptInvite(url)
            replyDeface(jsonformat(data))
            break
        case prefix+'leave':
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            if (!isGroup) return replyDeface(mess.OnlyGrup)
            addCountCmd('#leave', sender, _cmd)
            hinata.groupLeave(from)
            break
        case prefix+'self':{
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            addCountCmd('#self', sender, _cmd)
            hinata.mode = 'self'
            replyDeface('Berhasil berubah ke mode self')
            }
            break
        case prefix+'publik': case prefix+'public':{
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            addCountCmd('#public', sender, _cmd)
            hinata.mode = 'public'
            replyDeface('Berhasil berubah ke mode public')
            }
            break
        case prefix+'setprefix':
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            if (args.length < 2) return replyDeface(`Masukkan prefix\nOptions :\n=> multi\n=> nopref`)
            if (q === 'multi') {
                addCountCmd('#setprefix', sender, _cmd)
                hinata.multi = true
                replyDeface(`Berhasil mengubah prefix ke ${q}`)
            } else if (q === 'nopref') {
                addCountCmd('#setprefix', sender, _cmd)
                hinata.multi = false
                hinata.nopref = true
                replyDeface(`Berhasil mengubah prefix ke ${q}`)
            } else {
                addCountCmd('#setprefix', sender, _cmd)
                hinata.multi = false
                hinata.nopref = false
                hinata.prefa = `${q}`
                replyDeface(`Berhasil mengubah prefix ke ${q}`)
            }
            break
        case prefix+'setpp': case prefix+'setppbot':
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            if (isImage || isQuotedImage) {
                addCountCmd('#setppbot', sender, _cmd)
                var media = await downloadAndSaveMediaMessage('image', 'ppbot.jpeg')
                if (args[1] == '\'panjang\'') {
                    var { img } = await generateProfilePicture(media)
                    await hinata.query({
                        tag: 'iq',
                        attrs: {
                            to: botNumber,
                            type:'set',
                            xmlns: 'w:profile:picture'
                        },
                        content: [
                        {
                            tag: 'picture',
                            attrs: { type: 'image' },
                            content: img
                        }
					    ]
                    })
					fs.unlinkSync(media)
					replyDeface(`Sukses`)
				} else {
					var data = await hinata.updateProfilePicture(botNumber, { url: media })
			        fs.unlinkSync(media)
				    replyDeface(`Sukses`)
				}
            } else {
                replyDeface(`Kirim/balas gambar dengan caption ${command} untuk mengubah foto profil bot`)
            }
            break
        case prefix+'broadcast': case prefix+'bc':
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            if (args.length < 2) return replyDeface(`Kirim perintah ${command} teks`)
            addCountCmd('#broadcast', sender, _cmd)
            var data = await store.chats.all()
            var teks = `${q}`
            for (let i of data) {
                hinata.sendMessage(i.id, { text: teks })
                await sleep(1000)
            }
            replyDeface(`Sukses mengirim pesan siaran kepada ${data.length} chat`)
            break
        case prefix+'bcsewa': {
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            if (!q) return replyDeface("Masukkan teks")
            addCountCmd('#bcsewa', sender, _cmd)
            for (let i of sewa){
                await hinata.sendMessage(i.id, { text: q })
                await sleep(3000) // delay 3 detik
            }
                replyDeface(`Sukses bc ke ${sewa.length} group`)
            }
            break
        case prefix+'addprem':
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara :\n${command} *@tag waktu*\n${command} *nomor waktu*\n\nContoh :\n${command} @tag 30d\n${command} 62895xxxxxxxx 30d`)
            if (!args[2]) return replyDeface(`Mau yang berapa hari?`)
            if (mentionUser.length !== 0) {
                addCountCmd('#addprem', sender, _cmd)
                _prem.addPremiumUser(mentionUser[0], args[2], premium)
                replyDeface('Sukses')
            } else {
                var cekap = await hinata.onWhatsApp(args[1]+"@s.whatsapp.net")
                if (cekap.length == 0) return replyDeface(`Masukkan nomer yang valid/terdaftar di WhatsApp`)
                addCountCmd('#addprem', sender, _cmd)
                _prem.addPremiumUser(args[1]+'@s.whatsapp.net', args[2], premium)
                replyDeface('Sukses')
            }
            break
        case prefix+'delprem':
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara :\n${command} *@tag*\n${command} *nomor*\n\nContoh :\n${command} @tag\n${command} 62895xxxxxxxx`)
            if (mentionUser.length !== 0){
                addCountCmd('#delprem', sender, _cmd)
                premium.splice(_prem.getPremiumPosition(mentionUser[0], premium), 1)
                fs.writeFileSync('./database/limit/premium.json', JSON.stringify(premium))
                replyDeface('Sukses!')
            } else {
                var cekpr = await hinata.onWhatsApp(args[1]+"@s.whatsapp.net")
                if (cekpr.length == 0) return replyDeface(`Masukkan nomer yang valid/terdaftar di WhatsApp`)
                addCountCmd('#delprem', sender, _cmd)
                premium.splice(_prem.getPremiumPosition(args[1] + '@s.whatsapp.net', premium), 1)
                fs.writeFileSync('./database/limit/premium.json', JSON.stringify(premium))
                replyDeface('Sukses!')
            }
            break
        case prefix+'addsewa':
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            if (args.length < 2) return replyDeface(`Gunakan dengan cara ${command} *link waktu*\n\nContoh : ${command} https://chat.whatsapp.com/Hjv5qt195A2AcwkbswwoMQ 30d`)
            if (!isUrl(args[1])) return replyDeface(mess.error.Iv)
            var url = args[1]
            addCountCmd('#addsewa', sender, _cmd)
            url = url.split('https://chat.whatsapp.com/')[1]
            if (!args[2]) return replyDeface(`Waktunya?`)
            var data = await hinata.groupAcceptInvite(url)
            if (_sewa.checkSewaGroup(data, sewa)) return replyDeface(`Bot sudah disewa oleh grup tersebut!`)
            _sewa.addSewaGroup(data, args[2], sewa)
            replyDeface(`Success Add Sewa Group Berwaktu!`)
            break
        case prefix+'delsewa':
            if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
            if (!isGroup) return replyDeface(`Perintah ini hanya bisa dilakukan di Grup yang menyewa bot`)
            if (!isSewa) return replyDeface(`Bot tidak disewa di Grup ini`)
            addCountCmd('#delsewa', sender, _cmd)
            sewa.splice(_sewa.getSewaPosition(args[1] ? args[1] : from, sewa), 1)
            fs.writeFileSync('./database/group/sewa.json', JSON.stringify(sewa, null, 2))
            replyDeface(`Sukses`)
            break
        case prefix+'resetlimit':
		    if (!isOwner && !fromMe) return replyDeface(mess.OnlyOwner)
			addCountCmd('#resetlimit', sender, _cmd)
            limit = []
            fs.writeFileSync('./database/limit/limit.json', JSON.stringify(limit, null, 2))
            glimit = []
            fs.writeFileSync('./database/limit/glimit.json', JSON.stringify(glimit, null, 2))
            replyDeface(`Sukses reset limit pengguna`)
            break
        default:
            if (isCmd) {
            if (args[0].length > 1) {
            var detect = await Dym(command.split(prefix)[1], listCmd)
            if (detect !== null) {
            replyDeface(`Mungkin yang anda maksud adalah ${prefix + detect} abaikan jika salah!`)
            }
            if (!isGroup && detect === null) {
            replyDeface(`Maaf kak fitur ${command} tidak terdaftar di list ${prefix+'menu'}`)
            }
            } else {
            var detect2 = await Dym(args[1], listCmd)
            if (!isGroup && detect2 !== null) {
            replyDeface(`Pastikan antara simbol/prefix jangan dipisah, contoh ${prefix+args[1]}`)
            }
	        }
            }
            }
            } catch (err) {
            console.log(color('[ ERROR ]', 'red'), err)
            }
            }