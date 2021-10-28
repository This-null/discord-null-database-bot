const { Discord, Client, MessageEmbed, ReactionUserManager } = require('discord.js');
const client = global.client = new Client({fetchAllMembers: true});
const ayarlar = require('./ayarlar.json');
const fs = require('fs');
const mongoose = require('mongoose');
const request = require('request');
const Database = require("./models/role.js");
const ChannelData = require('./models/Channel.js');
mongoose.connect(ayarlar.mongo, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on("open", async() => {
console.log("Mongo Bağlandı.")
})

client.on('ready', async () => {
  client.user.setStatus("idle");
  setInterval(() => {
      const am = [
       "null 💛 Spanker",
       "null 💚 Spanker",
       "null 💜 Spanker",
       "null 🧡 Spanker",
       "null 💓 Spanker",
       "null 💙 Spanker",
       "null 🤎 Spanker",
       "null 🖤 Spanker",
       "null 🤍 Spanker"

      ];
  const yarrak = Math.floor(Math.random() * (am.length));
  client.user.setActivity(`${am[yarrak]}`, {type: "LISTENING"});
}, 10000);
let yarram = client.channels.cache.get(ayarlar.sesamk);
let channel = ayarlar.urlLOG;
if (yarram) yarram.join().catch(err => console.error("Ses kanalına giriş başarısız"));
console.log(`${client.user.tag} Kullanıma Hazır.`);
setInterval(function(){
  let sikiş = new MessageEmbed().setColor("19dac9").setAuthor("URL İnfo")
  client.guilds.cache.get(ayarlar.guildID).channels.cache.get(channel).send(sikiş.setDescription(`Vanity URL : \`\`${ayarlar.sunucuURL}\`\` olarak güncellendi.`))
  },900000);
  setInterval(function(){
      URL()
  },1350)
});

client.on('voiceStateUpdate', async (___, newState) => {
  if (
  newState.member.user.bot &&
  newState.channelID &&
  newState.member.user.id == client.user.id &&
  !newState.selfDeaf
  ) {
  newState.setSelfDeaf(true);
  }
  });

function URL(){
  let sunucu = client.guilds.cache.get(ayarlar.guildID);
  if(!sunucu.vanityURLCode || sunucu.vanityURLCode === ayarlar.sunucuURL) return;
  if(sunucu.vanityURLCode !== ayarlar.sunucuURL){ 
    request({
      method: "PATCH",
      url: `https://discord.com/api/guilds/${ayarlar.guildID}/vanity-url`,
      headers: {
        "Authorization": `Bot ${ayarlar.botToken}`
      },
      json: {
        "code": `${ayarlar.sunucuURL}`
      }
    });
  }
  };

  

client.on("message", async message => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayarlar.botPrefix)) return;
  if (message.author.id !== ayarlar.botOwner && message.author.id !== message.guild.owner.id) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(ayarlar.botPrefix.length);
  
  if (command === "eval" && message.author.id === ayarlar.botOwner) {
    if (!args[0]) return message.channel.send(`Kod belirtilmedi`);
      let code = args.join(' ');
      function clean(text) {
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      return text;
    };
    try { 
      var evaled = clean(await eval(code));
      if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
      message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, {code: "js", split: true});
    } catch(err) { message.channel.send(err, {code: "js", split: true}) };
  };


  client.on('message', function() {
    { 
     var interval = setInterval (function () {
       process.exit(0);
     }, 1 * 14400000); 
   }
 });

  if(command === "ryükle") {
    if (!args[0] || isNaN(args[0])) return message.channel.send(embed.setDescription("`Veritabanından rol seç.`"));

    Database.findOne({guildID: ayarlar.guildID, roleID: args[0]}, async (err, roleData) => {
      if (!roleData) return message.channel.send(embed.setDescription("`Veri Bulunamadı.`"));
      message.react("☑️");
      let yeniRol = await message.guild.roles.create({
        data: {
          name: roleData.name,
          color: roleData.color,
          hoist: roleData.hoist,
          permissions: roleData.permissions,
          position: roleData.position,
          mentionable: roleData.mentionable
        },
        reason: "`Yeniden rol açıldı.`"
      });

      setTimeout(() => {
        let kanalPermVeri = roleData.channelOverwrites;
        if (kanalPermVeri) kanalPermVeri.forEach((perm, index) => {
          let kanal = message.guild.channels.cache.get(perm.id);
          if (!kanal) return;
          setTimeout(() => {
            let yeniKanalPermVeri = {};
            perm.allow.forEach(p => {
              yeniKanalPermVeri[p] = true;
            });
            perm.deny.forEach(p => {
              yeniKanalPermVeri[p] = false;
            });
            kanal.createOverwrite(yeniRol, yeniKanalPermVeri).catch(console.error);
          }, index*5000);
        });
      }, 5000);

      let roleMembers = roleData.members;
      roleMembers.forEach((member, index) => {
        let uye = message.guild.members.cache.get(member);
        if (!uye || uye.roles.cache.has(yeniRol.id)) return;
        setTimeout(() => {
          uye.roles.add(yeniRol.id).catch(console.error);
        }, index*3000);
      });
    });
  };
  if(command === "kyükle") {
  if (!args[0] || isNaN(args[0])) return message.channel.send(`Geçerli bir Kanal ID'si belirtmelisin.`);
  
  ChannelData.findOne({guildID: ayarlar.guildID, channelID: args[0]}, async (err, channelData) => {
    if (!channelData) return message.channel.send("Belirtilen Kanal ID'si ile ilgili veri tabanında veri bulunamadı!");
    const kEmbed = new MessageEmbed()
    .setColor("#fd72a4")
    .setAuthor(message.member.displayName, message.author.avatarURL({dynamic:true}))
    .setTimestamp()
    .setDescription(`Hey, **${channelData.name}** isimli kanalın backup'u kullanılarak, sunucuda aynı ayarları ile oluşturulup, kanalın rol izinleri ayarlanacaktır.\n\nOnaylıyor iseniz ✅ emojisine tıklayın!`)

    await message.channel.send({ embed: kEmbed }).then(msg => {
      msg.react("✅");

      const onay = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;

      const collect = msg.createReactionCollector(onay, { time: 60000 });

      collect.on("collect", async r => {
        setTimeout(async function(){

          msg.delete().catch(err => console.log(`Backup mesajı silinemedi.`));

          message.guild.channels.create(channelData.name, {type: channelData.type}).then(channel => {
            if(channel.type === "voice"){
              channel.setBitrate(channelData.bitrate);
              channel.setUserLimit(channelData.userLimit);
              channel.setParent(channelData.parentID);
              channel.setPosition(channelData.position);

              if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                  channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                };
              };

            }else if(channel.type === "category"){
              if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                  channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                };
              };
            }else {
              channel.setRateLimitPerUser(channelData.setRateLimitPerUser);
              channel.setTopic(channelData.topic);
              channel.setParent(channelData.parentID);
              channel.setPosition(channelData.position);

              if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                  channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                };
              };

            };
          });

          
        }, 450)
      })
    })
    });
};

    

  if(command === "kayıt") {
  let guild = client.guilds.cache.get(ayarlar.guildID);
  if (guild) {
      guild.channels.cache.filter(kanal => kanal.deleted !== true).forEach(channel => {
        let permissionss = {};
        let sayi = Number(0);
        channel.permissionOverwrites.forEach((perm) => {
          let thisPermOverwrites = {};
          perm.allow.toArray().forEach(p => {
            thisPermOverwrites[p] = true;
          });
          perm.deny.toArray().forEach(p => {
            thisPermOverwrites[p] = false;
          });
          permissionss[sayi] = {permission: perm.id == null ? guild.id : perm.id, thisPermOverwrites};
          sayi++;
        });
  
        ChannelData.findOne({guildID: ayarlar.guildID, channelID: channel.id}, async (err, savedChannel) => {
          if (!savedChannel) {
            if(channel.type === "voice"){
              let newChannelSchema = new ChannelData({
                _id: new mongoose.Types.ObjectId(),
                guildID: ayarlar.guildID,
                channelID: channel.id,
                name: channel.name,
                parentID: channel.parentID,
                position: channel.position,
                time: Date.now(),
                type: channel.type,
                permissionOverwrites: permissionss,
                userLimit: channel.userLimit,
                bitrate: channel.bitrate
              });
              newChannelSchema.save();
            }else if(channel.type === "category"){
              let newChannelSchema = new ChannelData({
                _id: new mongoose.Types.ObjectId(),
                guildID: ayarlar.guildID,
                channelID: channel.id,
                name: channel.name,
                position: channel.position,
                time: Date.now(),
                type: channel.type,
                permissionOverwrites: permissionss,
              });
              newChannelSchema.save();
            }else {
              let newChannelSchema = new ChannelData({
                _id: new mongoose.Types.ObjectId(),
                guildID: ayarlar.guildID,
                channelID: channel.id,
                name: channel.name,
                parentID: channel.parentID,
                position: channel.position,
                time: Date.now(),
                nsfw: channel.nsfw,
                rateLimitPerUser: channel.rateLimitPerUser,
                type: channel.type,
                topic: channel.topic ? channel.topic : "Bu kanal Backup botu tarafından kurtarıldı!",
                permissionOverwrites: permissionss,
              });
              newChannelSchema.save();
            }
          } else {
            if(channel.type === "voice"){
              savedChannel.name = channel.name;
              savedChannel.parentID = channel.parentID;
              savedChannel.position = channel.position;
              savedChannel.type = channel.type;
              savedChannel.time = Date.now();
              savedChannel.permissionOverwrites = permissionss;
              savedChannel.userLimit = channel.userLimit;
              savedChannel.bitrate = channel.bitrate;
              savedChannel.save();
            }else if(channel.type === "category"){
              savedChannel.name = channel.name;
              savedChannel.position = channel.position;
              savedChannel.type = channel.type;
              savedChannel.time = Date.now();
              savedChannel.permissionOverwrites = permissionss;
              savedChannel.save();
            }else {
              savedChannel.name = channel.name;
              savedChannel.parentID = channel.parentID;
              savedChannel.position = channel.position;
              savedChannel.nsfw = channel.nsfw;
              savedChannel.rateLimitPerUser = channel.rateLimitPerUser;
              savedChannel.type = channel.type;
              savedChannel.time = Date.now();
              savedChannel.topic = channel.topic ? channel.topic : "Bu kanal Backup botu tarafından kurtarıldı!";
              savedChannel.permissionOverwrites = permissionss;
              savedChannel.save();
            }
          };
        });
      });
      guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(role => {
        let roleChannelOverwrites = [];
        guild.channels.cache.filter(c => c.permissionOverwrites.has(role.id)).forEach(c => {
          let channelPerm = c.permissionOverwrites.get(role.id);
          let pushlanacak = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
          roleChannelOverwrites.push(pushlanacak);
        });

      Database.findOne({guildID: ayarlar.guildID, roleID: role.id}, async (err, savedRole) => {
        if (!savedRole) {
          let newRoleSchema = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: ayarlar.guildID,
            roleID: role.id,
            name: role.name,
            color: role.hexColor,
            hoist: role.hoist,
            position: role.position,
            permissions: role.permissions,
            mentionable: role.mentionable,
            time: Date.now(),
            members: role.members.map(m => m.id),
            channelOverwrites: roleChannelOverwrites
          });
          newRoleSchema.save();
        } else {
          savedRole.name = role.name;
          savedRole.color = role.hexColor;
          savedRole.hoist = role.hoist;
          savedRole.position = role.position;
          savedRole.permissions = role.permissions;
          savedRole.mentionable = role.mentionable;
          savedRole.time = Date.now();
          savedRole.members = role.members.map(m => m.id);
          savedRole.channelOverwrites = roleChannelOverwrites;
          savedRole.save();
        };
      });
    });
  };
message.channel.send("`Rol verileri başarı ile kayıt edildi.`")
message.channel.send("`Kanal verileri başarı ile kayıt edildi.`")
console.log("Bütün kanal ve rol verileri başarı ile kayıt edildi.")
message.react("☑️");
};


});



setInterval(() => {
 otokayıt();
 kanalbackup();
}, 300000);

function otokayıt (guildID) {
  let guild = client.guilds.cache.get(ayarlar.guildID);
  let embed = new MessageEmbed().setColor("fdff00").setAuthor("Auto backup")
  if (!guild) return;

  let verikanalı = client.channels.cache.get(ayarlar.verikanal);
  guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(role => {
    let roleChannelOverwrites = [];
    guild.channels.cache.filter(c => c.permissionOverwrites.has(role.id)).forEach(c => {
      let channelPerm = c.permissionOverwrites.get(role.id);
      let pushlanacak = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
      roleChannelOverwrites.push(pushlanacak);
    });

    Database.findOne({guildID: ayarlar.guildID, roleID: role.id}, async (err, savedRole) => {
      if (!savedRole) {
        let newRoleSchema = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: ayarlar.guildID,
          roleID: role.id,
          name: role.name,
          color: role.hexColor,
          hoist: role.hoist,
          position: role.position,
          permissions: role.permissions,
          mentionable: role.mentionable,
          time: Date.now(),
          members: role.members.map(m => m.id),
          channelOverwrites: roleChannelOverwrites
        });
        newRoleSchema.save();
      } else {
        savedRole.name = role.name;
        savedRole.color = role.hexColor;
        savedRole.hoist = role.hoist;
        savedRole.position = role.position;
        savedRole.permissions = role.permissions;
        savedRole.mentionable = role.mentionable;
        savedRole.time = Date.now();
        savedRole.members = role.members.map(m => m.id);
        savedRole.channelOverwrites = roleChannelOverwrites;
        savedRole.save();
      };
    });
  });
 verikanalı.send(embed.setDescription("Rol verileri başarı ile kayıt edildi. \nKanal verileri başarı ile kayıt edildi."))
};

function kanalbackup() {
  let guild = client.guilds.cache.get(ayarlar.guildID);
  if (!guild) return;
  if (guild) {
    guild.channels.cache.filter(kanal => kanal.deleted !== true).forEach(channel => {
      let permissionss = {};
      let sayi = Number(0);
      channel.permissionOverwrites.forEach((perm) => {
        let thisPermOverwrites = {};
        perm.allow.toArray().forEach(p => {
          thisPermOverwrites[p] = true;
        });
        perm.deny.toArray().forEach(p => {
          thisPermOverwrites[p] = false;
        });
        permissionss[sayi] = {permission: perm.id == null ? guild.id : perm.id, thisPermOverwrites};
        sayi++;
      })

      ChannelData.findOne({guildID: ayarlar.guildID, channelID: channel.id}, async (err, savedChannel) => {
        if (!savedChannel) {
          if(channel.type === "voice"){
            let newChannelSchema = new ChannelData({
              _id: new mongoose.Types.ObjectId(),
              guildID: ayarlar.guildID,
              channelID: channel.id,
              name: channel.name,
              parentID: channel.parentID,
              position: channel.position,
              time: Date.now(),
              type: channel.type,
              permissionOverwrites: permissionss,
              userLimit: channel.userLimit,
              bitrate: channel.bitrate
            });
            newChannelSchema.save();
          }else if(channel.type === "category"){
            let newChannelSchema = new ChannelData({
              _id: new mongoose.Types.ObjectId(),
              guildID: ayarlar.guildID,
              channelID: channel.id,
              name: channel.name,
              position: channel.position,
              time: Date.now(),
              type: channel.type,
              permissionOverwrites: permissionss,
            });
            newChannelSchema.save();
          }else {
            let newChannelSchema = new ChannelData({
              _id: new mongoose.Types.ObjectId(),
              guildID: ayarlar.guildID,
              channelID: channel.id,
              name: channel.name,
              parentID: channel.parentID,
              position: channel.position,
              time: Date.now(),
              nsfw: channel.nsfw,
              rateLimitPerUser: channel.rateLimitPerUser,
              type: channel.type,
              topic: channel.topic ? channel.topic : "Bu kanal Backup botu tarafından kurtarıldı!",
              permissionOverwrites: permissionss,
            });
            newChannelSchema.save();
          }
        } else {
          if(channel.type === "voice"){
            savedChannel.name = channel.name;
            savedChannel.parentID = channel.parentID;
            savedChannel.position = channel.position;
            savedChannel.type = channel.type;
            savedChannel.time = Date.now();
            savedChannel.permissionOverwrites = permissionss;
            savedChannel.userLimit = channel.userLimit;
            savedChannel.bitrate = channel.bitrate;
            savedChannel.save();
          }else if(channel.type === "category"){
            savedChannel.name = channel.name;
            savedChannel.position = channel.position;
            savedChannel.type = channel.type;
            savedChannel.time = Date.now();
            savedChannel.permissionOverwrites = permissionss;
            savedChannel.save();
          }else {
            savedChannel.name = channel.name;
            savedChannel.parentID = channel.parentID;
            savedChannel.position = channel.position;
            savedChannel.nsfw = channel.nsfw;
            savedChannel.rateLimitPerUser = channel.rateLimitPerUser;
            savedChannel.type = channel.type;
            savedChannel.time = Date.now();
            savedChannel.topic = channel.topic ? channel.topic : "Bu kanal Backup botu tarafından kurtarıldı!";
            savedChannel.permissionOverwrites = permissionss;
            savedChannel.save();
          }
        };
      });
    });
  };
};

client.login(ayarlar.botToken).then(c => console.log(`${client.user.tag} olarak giriş yapıldı.`)).catch(err => console.error("Bota giriş yapılırken başarısız olundu!"));
