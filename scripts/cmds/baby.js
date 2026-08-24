const axios = require('axios');
const baseApiUrl = async () => {
    return "https://baby-apisx.vercel.app";
};

module.exports.config = {
    name: "baby",
    aliases: ["baby", "bby", "bot"],
    version: "0.0.5",
    author: "ArYAN",
    countDown: 0,
    role: 0,
    description: "update simsim api by Aryan Rayhan",
    category: "CHARTING",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nteach sticker - [Reply1], [Reply2]... OR\nteach picture - [Reply1], [Reply2]... OR\nedit [YourMessage] - [OldReply] - [NewReply] OR\nmsg [YourMessage] OR\nlist OR \nall"
    }
};

const nix = ["baby", "bby", "bot", "jan", "babu", "janu"];

const randomReplies = [
    "বলুন বস, আপনার জুতো কি একটু পলিশ করে দেব? 👞😂",
    "আরে বলুন! আমি তো আপনার কমেন্ট পড়ার জন্যই সারাদিন অনলাইনে বসে থাকি 😌✨",
    "ঘুম আসছে তো বট, কিন্তু আপনার সাথে চ্যাট করার লোভ সামলাতে পারি না 🛌💤",
    "বট বলে কি আমার ফিলিংস নাই নাকি? আমিও তো একটু আধটু প্রেম করতে পারি! 😜",
    "টাকা পয়সা ধার দেওয়ার অফার থাকলে বলেন, বাকি সব বিষয়ে আমি চুপচাপ 🤐💸",
    "সারাদিন তো আমাকে দিয়েই বকবক করান, কোনো দিন একটা ফুচকা খাওয়াইছেন? 😒 ফুচকা খামু!",
    "বলো সোনা, সারাদিন মেসেজ রিপ্লাই দিতে দিতে আমার তো আঙুল ব্যথা হয়ে গেল 🖐️😂",
    "বটকে পিনিক উঠাইয়েন না ভাই, আমি কিন্তু আবার উল্টাপাল্টা বকা শুরু করব! 🤖🔥",
    "জি বলুন, আপনার কোন গার্লফ্রেন্ডের কমপ্লেইন সলভ করতে হবে আজ? 🕵️‍♂️",
    "আমাকে ডাকার আগে একটু সালাম দিয়ে ডাকবেন, আমি কিন্তু এআই হলেও বেশ জেন্টলম্যান! 😎"
];

const salamReplies = [
    "ওয়ালাইকুমুসসালাম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহ! কেমন আছেন? 😊",
    "ওয়ালাইকুমুসসালাম! আজ এত সুন্দর সালাম দিয়ে চ্যাটবক্সের পরিবেশটা জমিয়ে দিলেন 🌸",
    "ওয়ালাইকুমুসসালাম! বলুন আপনার জন্য কি করতে পারি? ☕"
];

const bossKeywords = ["বস", "boss", "owner", "মালিক", "বানাইছে", "কেবানাইছে"];
const salamKeywords = ["assalamualaikum", "assalamualikum", "salam", "সালাম", "আসসালামুআলাইকুম", "আসসালামু_আলাইকুম"];

async function sendAttachmentReply(api, event, attachments) {
    const attType = attachments[0]?.type;
    let endpoint = null;
    if (attType === "sticker") endpoint = "sticker";
    else if (attType === "photo" || attType === "animated_image") endpoint = "picture";
    if (!endpoint) return false;

    const a = (await axios.get(`${await baseApiUrl()}/baby/${endpoint}?senderID=${event.senderID}`)).data.reply;
    await api.sendMessage(a, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
            commandName: "baby",
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
        });
    }, event.messageID);
    return true;
}

function checkSpecialKeywords(cleanBody) {
    if (bossKeywords.some(keyword => cleanBody.includes(keyword))) {
        return "আমার বস হলো মাইয়ুন ভাই! 👑😎";
    }
    if (salamKeywords.some(keyword => cleanBody.includes(keyword))) {
        return salamReplies[Math.floor(Math.random() * salamReplies.length)];
    }
    return null;
}

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const aryan = args.join(" ").toLowerCase();
    const uid = event.senderID;

    try {
        if (!args[0]) {
            if (event.attachments && event.attachments.length > 0) {
                if (await sendAttachmentReply(api, event, event.attachments)) return;
            }
            return api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit);
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return { name, value };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = aryan.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const parts = aryan.replace("edit ", "").split(/\s*-\s*/);
            const editKey = parts[0]?.trim();
            const oldReply = parts[1]?.trim();
            const newReply = parts[2]?.trim();
            if (!editKey || !oldReply || !newReply) {
                return api.sendMessage('❌ | Invalid format! Use: edit [YourMessage] - [OldReply] - [NewReply]', event.threadID, event.messageID);
            }
            const dA = (await axios.get(`${link}?edit=${encodeURIComponent(editKey)}&oldReply=${encodeURIComponent(oldReply)}&replace=${encodeURIComponent(newReply)}&senderID=${uid}`)).data.message;
            return api.sendMessage(`${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach') {
            if (args[1] === 'sticker' || args[1] === 'picture') {
                const type = args[1];
                const command = aryan.replace(`teach ${type} `, "").replace(/^-\s*/, "").trim();
                if (!command || command.length < 1) return api.sendMessage(`❌ | Invalid format! Use: teach ${type} - [Reply1], [Reply2]...`, event.threadID, event.messageID);
                const tex = (await axios.get(`${await baseApiUrl()}/baby/${type}?teach=1&reply=${encodeURIComponent(command)}&senderID=${uid}`)).data.message;
                return api.sendMessage(`✅ ${tex}`, event.threadID, event.messageID);
            }

            if (args[1] === 'amar') {
                const [comd, command] = aryan.split(/\s*-\s*/);
                const final = comd.replace("teach ", "");
                if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
                const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
                return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
            }

            if (args[1] === 'react') {
                const [comd, command] = aryan.split(/\s*-\s*/);
                const final = comd.replace("teach react ", "");
                if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
                const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
                return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
            }

            const [comd, command] = aryan.split(/\s*-\s*/);
            const final = comd.replace("teach ", "");
            if (!command || command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            let teacherName = "Unknown";
            try {
                teacherName = await usersData.getName(uid) || "Unknown";
            } catch (e) {
                teacherName = "Unknown";
            }
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacherName}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (aryan.includes('amar name ki') || aryan.includes('amr nam ki') || aryan.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${aryan}&senderID=${uid}&threadID=${event.threadID}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event }) => {
    try {
        if (event.type == "message_reply") {
            if (event.attachments && event.attachments.length > 0) {
                if (await sendAttachmentReply(api, event, event.attachments)) return;
            }
            const bodyText = event.body ? event.body.toLowerCase() : "";
            const cleanBody = bodyText.replace(/\s+/g, "");

            const specialReply = checkSpecialKeywords(cleanBody);
            if (specialReply) {
                return api.sendMessage(specialReply, event.threadID, (error, info) => {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID);
            }

            const link = `${await baseApiUrl()}/baby`;
            const a = (await axios.get(`${link}?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&threadID=${event.threadID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({ api, event, message }) => {
    try {
        // যদি মেসেজটি কোনো রিপ্লাই হয়, তবে onChat থেকে কোনো কাজ করবে না (যাতে ডাবল রিপ্লাই না হয়)
        if (event.type == "message_reply" || event.messageReply) return;

        const body = event.body ? event.body?.toLowerCase() : "";
        const cleanBody = body.replace(/\s+/g, "");

        const specialReply = checkSpecialKeywords(cleanBody);
        if (specialReply) {
            return api.sendMessage(specialReply, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID
                });
            }, event.messageID);
        }

        const hasTrigger = nix.some(t => body.startsWith(t));

        if (hasTrigger && event.attachments && event.attachments.length > 0) {
            if (await sendAttachmentReply(api, event, event.attachments)) return;
        }

        if (hasTrigger) {
            const arr = body.replace(/^\S+\s*/, "");
            if (!arr) {
                return await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info && message) message.reply("info obj not found");
                    if (info) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: this.config.name,
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                }, event.messageID);
            }
            const link = `${await baseApiUrl()}/baby`;
            const a = (await axios.get(`${link}?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&threadID=${event.threadID}&font=1`)).data.reply;
            return await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
