//by Leo_768
console.log("機器人載入中...")
const keepAlive = require('./server');
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const log = new Discord.WebhookClient(process.env.WID,process.env.WT);

//啟動
client.on("ready", () => {
    console.log("機器人載入完成!");
    log.send("機器人啟動!");
});
//加入及離開
client.on("guildCreate", guild => {
    log.send(`**[join]** ${guild.name}(${guild.id})`)
});
client.on("guildDelete", guild => {
    log.send(`**[leave]** ${guild.name}(${guild.id})`)
});
//DM
client.on("message", msg => {
    if (!msg.author.bot && msg.channel.type === "dm") msg.channel.send('你只能在伺服器中使用指令!\n你可以在<https://github.com/Leo-768/discord-voice-channel-bot>支援我')
});
//指令
client.on("message", msg => {
    try{
        if (!msg.guild || msg.author.bot || !msg.content.startsWith('v!')){return;};
        if (msg.content === 'v!help'){
            fs.readFile('./help.txt',function(err,txt){
                if(err){console.log(err);};
                txt = txt.toString();
                msg.channel.send(txt);
            });
        }else if (msg.content === 'v!info'){
            fs.readFile('./info.txt',function(err,txt){
                if(err){console.log(err);};
                txt = txt.toString();
                msg.channel.send(txt);
            });
        }else if(msg.member.hasPermission(8) && (msg.content.startsWith('v!setcat ') && msg.content.slice(9).match(/^[0-9]{18}$/) || (msg.content.startsWith('v!setcreat ') && msg.content.slice(11).match(/^[0-9]{18}$/)) || (msg.content.startsWith('v!setname ') && msg.content.slice(10)) || msg.content === 'v!setname' || msg.content === 'v!reset')){
            fs.readFile(`./settings/.env`,function(err,setFile){
                if(err){
                    console.log(err);
                };
                var file = setFile.toString()
                file = JSON.parse(file);
                if (!file[msg.guild.id]){file[msg.guild.id] = {};};
                if (msg.content.startsWith('v!setcat ') && msg.content.slice(9).match(/^[0-9]{18}$/)){
                    file[msg.guild.id].cat = msg.content.slice(9);
                    msg.channel.send('類別設定成功!');
                    log.send(`**[cmd]** ${msg.guild.name}(${msg.guild.id}) ${msg.author.tag}(${msg.author.id}): \`${msg.content}\``);
                }else if (msg.content.startsWith('v!setcreat ') && msg.content.slice(11).match(/^[0-9]{18}$/)){
                    file[msg.guild.id].creat = msg.content.slice(11);
                    msg.channel.send('頻道設定成功!');
                    log.send(`**[cmd]** ${msg.guild.name}(${msg.guild.id}) ${msg.author.tag}(${msg.author.id}): \`${msg.content}\``);
                }else if (msg.content.startsWith('v!setname ') && msg.content.slice(10)){
                    file[msg.guild.id].name = msg.content.slice(10);
                    msg.channel.send('頻道預設名稱設定成功!');
                    log.send(`**[cmd]** ${msg.guild.name}(${msg.guild.id}) ${msg.author.tag}(${msg.author.id}): \`${msg.content}\``);
                }else if (msg.content === 'v!setname'){
                    delete file[msg.guild.id].name;
                    msg.channel.send('頻道預設名稱已刪除!');
                    log.send(`**[cmd]** ${msg.guild.name}(${msg.guild.id}) ${msg.author.tag}(${msg.author.id}): \`${msg.content}\``);
                }else if (msg.content === 'v!reset'){
                    delete file[msg.guild.id];
                    msg.channel.send('已重製設定!');
                    log.send(`**[cmd]** ${msg.guild.name}(${msg.guild.id}) ${msg.author.tag}(${msg.author.id}): \`${msg.content}\``);
                };
                file = JSON.stringify(file);
                fs.writeFile(`./settings/.env`,file,function(err){if(err){console.log(err);};});
            });
        };
    }catch(err){
        log.send(`**[error]** ${err}`)
    }
});
//建立
client.on("voiceStateUpdate", ( vd, v) =>{
    if (v.channel === vd.channel || !v.channel){return;};
    fs.readFile(`./settings/.env`,function(err,setFile){
        if (err){
            console.log(err);
        };
        let settings = setFile.toString();
        settings = JSON.parse(settings);
        if ( !settings[v.guild.id] || settings[vd.guild.id].creat !== v.channel.id || !settings[v.guild.id].cat){return;};
        let name = settings[v.guild.id].name || "$ 的頻道";
        name = name.replace(/\$/g,v.member.nickname || v.member.user.username);
        v.guild.channels.create(name,{type: 'voice', parent: settings[v.guild.id].cat, permissionOverwrites:[{id:v.member,allow:871368465}]})
            .then(ch => {
                v.member.voice.setChannel(ch);
                log.send(`**[c]** ${v.guild.name}(${v.guild.id}) ${v.member.user.tag}(${v.member.id}): ${ch.name}(${ch.id})`)
            });
    });
});
//刪除
client.on("voiceStateUpdate", ( vd, v) =>{
    try{
        if (!vd.channel || v.channel === vd.channel){return;};
        fs.readFile(`./settings/.env`,function(err,setFile){
            if (err){
                console.log(err);
            };
            let settings = setFile.toString();
            settings = JSON.parse(settings);
            if ( !settings[vd.guild.id] || !settings[vd.guild.id].creat || !settings[vd.guild.id].cat){return;};
            if (vd.channel.id === settings[v.guild.id].creat || vd.channel.parentID !== settings[v.guild.id].cat){return;};
            if (!vd.channel.members.find(user => user.permissionsIn(vd.channel).has("MANAGE_ROLES"))){
                vd.channel.delete();
                log.send(`**[d]** ${vd.guild.name}(${vd.guild.id}): ${vd.channel.name}(${vd.channel.id})`);
            };
        });
    }catch(err){
        log.send(`**[error]** ${err}`)
    }
});

keepAlive();
//機器人驗證金鑰!!!
client.login(process.env.TOKEN);