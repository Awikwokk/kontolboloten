"use strict";
const {
	default: makeWASocket,
	BufferJSON,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
	useSingleFileAuthState,
	makeInMemoryStore,
	delay,
	downloadContentFromMessage,
	jidDecode,
	generateForwardMessageContent,
	generateWAMessageFromContent,
	proto,
	prepareWAMessageMedia
} = require("@adiwajshing/baileys")
const figlet = require("figlet");
const fs = require("fs");
const moment = require('moment')
const chalk = require('chalk')
const logg = require('pino')
const clui = require('clui')
const PhoneNumber = require('awesome-phonenumber')
const { Spinner } = clui

const afk = require("./lib/afk");
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif2')
const { serialize, getBuffer, makeid } = require("./lib/myfunc");
const { color, Riy04Log } = require("./lib/color");
const _sewa = require("./lib/sewa");
const { isSetWelcome, getTextSetWelcome } = require('./lib/setwelcome');
const { isSetLeft, getTextSetLeft } = require('./lib/setleft');

let _afk = JSON.parse(fs.readFileSync('./database/group/afk.json'));
let db_respon_list = JSON.parse(fs.readFileSync('./database/storage/list-message.json'));
let welcome = JSON.parse(fs.readFileSync('./database/group/welcome.json'));
let left = JSON.parse(fs.readFileSync('./database/group/left.json'));
let set_welcome_db = JSON.parse(fs.readFileSync('./database/group/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/group/set_left.json'));
let sewa = JSON.parse(fs.readFileSync('./database/group/sewa.json'));
let opengc = JSON.parse(fs.readFileSync('./database/group/opengc.json'));
let set_proses = JSON.parse(fs.readFileSync('./database/storage/set_proses.json'));
let set_done = JSON.parse(fs.readFileSync('./database/storage/set_done.json'));
let set_open = JSON.parse(fs.readFileSync('./database/group/set_open.json'));
let set_close = JSON.parse(fs.readFileSync('./database/group/set_close.json'));

const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')

let setting = JSON.parse(fs.readFileSync('./config.json'));
let session = `./${setting.sessionName}.json`
const { state, saveState } = useSingleFileAuthState(session)

function title() {
    console.log(chalk.bold.green(figlet.textSync('Hinata-Md', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: false
    })))
    console.log(chalk.yellow(`\n${chalk.yellow('[ Created By Riy × Paiz ]')}\n`))
}

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = () => { }) {
    console.log(`Module ${module} sedang dipantau oleh Riy 04`)
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

const status = new Spinner(chalk.cyan(` Booting WhatsApp Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting WhatsApp Bot`))

const store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

const connectToWhatsApp = async () => {
    const hinata = makeWASocket({
        printQRInTerminal: true,
        logger: logg({ level: 'fatal' }),
        auth: state
    })
    title()
    store.bind(hinata.ev)

    hinata.spam = []
    hinata.mode = 'public'

    require('./message/help')
    require('./lib/myfunc')
    require('./message/msg')
    nocache('./message/help', module => console.log(chalk.greenBright('[ RIY 04 ]  ') + time + chalk.cyanBright(` "${module}" Updated!`)))
    nocache('./lib/myfunc', module => console.log(chalk.greenBright('[ RIY 04 ]  ') + time + chalk.cyanBright(` "${module}" Updated!`)))
    nocache('./message/msg', module => console.log(chalk.greenBright('[ RIY 04 ]  ') + time + chalk.cyanBright(` "${module}" Updated!`)))

    hinata.multi = true
    hinata.nopref = false
	hinata.prefa = 'anjing'
	hinata.ev.on('messages.upsert', async m => {
	    var msg = m.messages[0]
	    if (!m.messages) return;
	    //  msg.message = (Object.keys(msg.message)[0] == "ephemeralMessage") ? msg.message.ephemeralMessage.message : msg.message
	    if (msg.key && msg.key.remoteJid == "status@broadcast") return
	    msg = serialize(hinata, msg)
	    msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
	    require('./message/msg')(hinata, msg, m, setting, store, welcome, left, set_welcome_db, set_left_db, db_respon_list, sewa, opengc, _afk, set_proses, set_done, set_open, set_close)
	})

    hinata.ev.on('presence.update', async data => {
        if (data.presences) {
            for (let key in data.presences) {
                if (data.presences[key].lastKnownPresence === "composing" || data.presences[key].lastKnownPresence === "recording") {
                    if (afk.checkAfkUser(key, _afk)) {
                        _afk.splice(afk.getAfkPosition(key, _afk), 1)
                        fs.writeFileSync('./database/group/afk.json', JSON.stringify(_afk, null, 2))
                        hinata.sendMessage(data.id, { text: `@${key.split("@")[0]} berhenti afk, dia sedang ${data.presences[key].lastKnownPresence === "composing" ? "mengetik" : "merekam"}`, mentions: [key] })
                    }
                }
            }
        }
    })

    hinata.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            status.stop()
            reconnect.stop()
            starting.stop()
            console.log(Riy04Log('Connect, Welcome Owner'))
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
            ? connectToWhatsApp()
            : console.log(Riy04Log('Connection Lost'))
        }
    })
	
    hinata.ev.on('group-participants.update', async (data) => {
        const isWelcome = welcome.includes(data.id) ? true : false
        const isLeft = left.includes(data.id) ? true : false
        const metadata = await hinata.groupMetadata(data.id)
        const groupName = metadata.subject
        const groupDesc = metadata.desc
        const groupMem = metadata.participants.length
        try {
            for (let i of data.participants) {
                if (data.action == "add" && isWelcome) {
                    try {
                        var pp_user = await hinata.profilePictureUrl(i, 'image')
                    } catch {
                        var pp_user = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                    if (isSetWelcome(data.id, set_welcome_db)) {
                        var get_teks_welcome = getTextSetWelcome(data.id, set_welcome_db)
                        var replace_pesan = (get_teks_welcome.replace(/@user/gi, `@${i.split('@')[0]}`))
                        var full_pesan = (replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc))
                        hinata.sendMessage(data.id, { caption: `${full_pesan}`, image: await getBuffer(pp_user), mentions: [i] })
                    } else {
                        hinata.sendMessage(data.id, { caption: `Welcome @${i.split("@")[0]} in the group ${groupName}`, image: await getBuffer(pp_user), mentions: [i] })
                    }
                } else if (data.action == "remove" && isLeft) {
                    try {
                        var pp_user = await hinata.profilePictureUrl(i, 'image')
                    } catch {
                        var pp_user = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                    }
                    if (isSetLeft(data.id, set_left_db)) {
                        var get_teks_left = getTextSetLeft(data.id, set_left_db)
                        var replace_pesan = (get_teks_left.replace(/@user/gi, `@${i.split('@')[0]}`))
                        var full_pesan = (replace_pesan.replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc))
                        hinata.sendMessage(data.id, { caption: `${full_pesan}`, image: await getBuffer(pp_user), mentions: [i] })
                    } else {
                        hinata.sendMessage(data.id, { caption: `Sayonara @${i.split("@")[0]}`, image: await getBuffer(pp_user), mentions: [i] })
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    })

    hinata.ev.on('messages.delete', item => {
        if ('all' in item) {
            const list = messages[item.jid]
            list === null || list === void 0 ? void 0 : list.clear()
        }
        else {
            const jid = item.keys[0].remoteJid
            const list = messages[jid]
            if (list) {
                const idSet = new Set(item.keys.map(k => k.id));
                list.filter(m => !idSet.has(m.key.id))
            }
        }
    })

    hinata.ev.on('chats.delete', deletions => {
        for (const item of deletions) {
            chats.deleteById(item)
        }
    })

    setInterval(async function() {
        var jamna = new Date().toLocaleTimeString('en-US', { timeZone: "Asia/Jakarta" });
        var hasilnes = jamna.split(':')[0] < 10 ? '0' + jamna : jamna
        // hasilnes Kalo mau Jam 00 jadi 12:00:00 AM
        if(hasilnes === '12:00:00 AM') {
            var gcname = (await hinata.groupMetadata("17736660147-1622202642@g.us")).subject
            var count = gcname.replace(/[^0-9]/gi, '')
            hinata.groupUpdateSubject("17736660147-1622202642@g.us", gcname.replace(count, count - 1))
        }
    }, 1000);

    _sewa.expiredCheck(hinata, sewa)

    setInterval(() => {
        for (let i of Object.values(opengc)) {
            if (Date.now() >= i.time) {
                hinata.groupSettingUpdate(i.id, "not_announcement")
                .then((res) =>
                hinata.sendMessage(i.id, { text: `Sukses, group telah dibuka` }))
                .catch((err) =>
                hinata.sendMessage(i.id, { text: 'Error' }))
                delete opengc[i.id]
                fs.writeFileSync('./database/opengc.json', JSON.stringify(opengc))
            }
        }
    }, 1000)
	
    hinata.ev.on('creds.update', () => saveState)
	
	hinata.reply = (from, content, msg) => hinata.sendMessage(from, { text: content }, { quoted: msg })

    hinata.ws.on('CB:call', async (json) => {
        const callerId = json.content[0].attrs['call-creator']
        hinata.sendMessage(callerId, { text: `Jangan telepon bot!` })
    })

    hinata.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    
    hinata.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = hinata.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })
        
    hinata.getName = (jid, withoutContact = false) => {
        var id = hinata.decodeJid(jid)
        withoutContact = hinata.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = hinata.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === hinata.decodeJid(hinata.user.id) ?
            hinata.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
        
    hinata.setStatus = (status) => {
        hisoka.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        })
        return status
    }
        
    hinata.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = []
        for (let i of kon) {
            list.push({
                lisplayName: await hinata.getName(i + '@s.whatsapp.net'),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await hinata.getName(i + '@s.whatsapp.net')}\nFN:${await hinata.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
           })
        }
        return hinata.sendMessage(jid, { contacts: { displayName: `${list.length} Contacts`, contacts: list }, ...opts }, { quoted })
    }
        
    hinata.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype
        if (options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
            vtype = Object.keys(message.message.viewOnceMessage.message)[0]
            delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
            delete message.message.viewOnceMessage.message[vtype].viewOnce
            message.message = {
                ...message.message.viewOnceMessage.message
            }
        }

        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
        let context = {}
        if (mtype != "conversation") context = message.message[mtype].contextInfo
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        }
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {})
        await hinata.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
        return waMessage
    }
	
    hinata.sendMessageFromContent = async(jid, message, options = {}) => {
        var option = { contextInfo: {}, ...options }
        var prepare = await generateWAMessageFromContent(jid, message, option)
        await hinata.relayMessage(jid, prepare.message, { messageId: prepare.key.id })
        return prepare
    }
	
    hinata.downloadAndSaveMediaMessage = async(msg, type_file, path_file) => {
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
	
    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    hinata.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await hinata.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
     
    hinata.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await hinata.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
    
       // Resize
       hinata.reSize = async (image, width, height) => {
       let jimp = require('jimp')
       var oyy = await jimp.read(image);
       var kiyomasa = await oyy.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
       return kiyomasa
      }
      
      // Send 5 Button Location
      hinata.send5ButLoc = async (jid , text = '' , footer = '', lok, but = [], options = {}) =>{
      let bb = await hinata.reSize(lok, 300, 155)
      hinata.sendMessage(jid, { location: { jpegThumbnail: bb }, caption: text, footer: footer, templateButtons: but, ...options })
      }
	
    return hinata
}

connectToWhatsApp()
.catch(err => console.log(err))
