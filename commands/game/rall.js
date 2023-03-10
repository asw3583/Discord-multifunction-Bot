const Discord = require('discord.js');
const { promptMessage } = require("../../functions.js");
const db = require("quick.db");
const ms = require("parse-ms");

const chooseArr = ["β", "ποΈ", "βοΈ"];

exports.run = async (client, message, args) => {

    if (message.channel.id !== "803964960068599869") {
        message.delete()
        return message.reply("μ£Όμ¬μλλ¦¬κΈ°κ° κ°λ₯ν μ±λμ΄ μλλλ€!")
    }

    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else {
        user = message.author;
    }
    const amount = parseInt(args[0]);
    const balance = db.get(`account.${message.author.id}.balance`);
    const pl1 = random(1, 6);
    const pl2 = random(1, 6);
    const bo1 = random(1, 6);
    const bo2 = random(1, 6);
    const plto = pl1 + pl2
    const boto = bo1 + bo2
    const plarr = [];
    const boarr = [];
    plarr.push(pl1)
    plarr.push(pl2)
    boarr.push(bo1)
    boarr.push(bo2)

    if (!amount) return message.channel.send("ν¬μΈνΈμ μλ ₯ν΄μ£ΌμΈμ.");
    if (isNaN(amount)) return message.channel.send("ν¬μΈνΈλ μ«μλ§ κ°λ₯ν©λλ€");
    if (amount > balance || !balance || balance === 0) return message.channel.send("ν¬μΈνΈκ° μΆ©λΆνμ§ μμ΅λλ€.");

    if (amount < 50) return message.channel.send("λλ° μ΅μ ν¬μΈνΈλ 50 ν¬μΈνΈμλλ€.");

    let cooldown = 5000; // 25 Seconds.
    let pad_zero = num => (num < 10 ? '0' : '') + num;
    let lastGamble = await db.get(`lastGamble.${message.author.id}`);

    if (lastGamble !== null && cooldown - (Date.now() - lastGamble) > 0) {
        let timeObj = ms(cooldown - (Date.now() - lastGamble));
        let second = pad_zero(timeObj.seconds).padStart(2, "0");
        return message.channel.send(`λ€μ λμ νλ €λ©΄ **${second}** νμ λ€μλμ ν΄μ£ΌμΈμ!`);
    }

    const embed = new Discord.MessageEmbed()
        .setColor("#FAFAFA")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
        .setDescription("μ£Όμ¬μλμ§κΈ°λ₯Ό μμν©λλ€")
        .setTimestamp();

    const m = await message.channel.send(embed);

    const plembed = new Discord.MessageEmbed()
        .setDescription(`${user}λμ μ£Όμ¬μμλλ€. μ²«λ²μ§Έ μ£Όμ¬μ: ${pl1}`)
        .setColor("#FAFAFA")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(plembed)
    const plembed2 = new Discord.MessageEmbed()
        .setDescription(`${user}λμ μ£Όμ¬μμλλ€. λλ²μ§Έ μ£Όμ¬μ: ${pl2}`)
        .setColor("#FAFAFA")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(plembed2)

    const totalpl = new Discord.MessageEmbed()
        .setTitle(`${user.username}λμ ν©κ³μλλ€`)
        .setDescription(`${user}λμ ν©κ³: ${plto}`)
        .setColor("GREEN")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(totalpl)


    const boembed = new Discord.MessageEmbed()
        .setDescription(`${message.guild.me}λμ μ£Όμ¬μμλλ€. μ²«λ²μ§Έ μ£Όμ¬μ: ${bo1}`)
        .setColor("#FAFAFA")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(boembed)
    const boembed2 = new Discord.MessageEmbed()
        .setDescription(`${message.guild.me}λμ μ£Όμ¬μμλλ€. μ²«λ²μ§Έ μ£Όμ¬μ: ${bo2}`)
        .setColor("#FAFAFA")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(boembed2)

    const totalbo = new Discord.MessageEmbed()
        .setTitle(`${message.guild.me.displayName}λμ ν©κ³μλλ€`)
        .setDescription(`${message.guild.me}λμ ν©κ³: ${boto}`)
        .setColor("GREEN")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
    message.channel.send(totalbo)



    const winem = new Discord.MessageEmbed()
        .setTitle(`${user.username}λμ μΉλ¦¬μλλ€!`)
        .setDescription(`${plto} vs ${boto} μΌλ‘ μΉλ¦¬νμ¨μ΅λλ€`)
        .addField("μΉ/ν¨", "``` μΉλ¦¬ ```", true)
        .addField("μ»μν¬μΈνΈ", "```" + amount + "```", true)
        .setColor("GREEN")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)

    const loseem = new Discord.MessageEmbed()
        .setTitle(`${message.guild.me.displayName}λμ μΉλ¦¬μλλ€!`)
        .setDescription(`${plto} vs ${boto} μΌλ‘ ν¨λ°°νμ¨μ΅λλ€`)
        .addField("μΉ/ν¨", "``` ν¨λ°° ```", true)
        .addField("μμν¬μΈνΈ", "```" + amount + "```", true)
        .setColor("RED")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)

    if (plto < boto) {
        await db.set(`lastGamble.${message.author.id}`, Date.now());
        await db.subtract(`account.${message.author.id}.balance`, amount);
        return message.channel.send(loseem);
    } else if (plto > boto) {
        await db.set(`lastGamble.${message.author.id}`, Date.now());
        await db.add(`account.${message.author.id}.balance`, amount);
        return message.channel.send(winem);
    }

}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.help = {
    name: "μ£Όμ¬μ",
    description: "μ£Όμ¬μλμ§κΈ°",
    usage: "μ£Όμ¬μ <λ°°ν>",
    example: "μ£Όμ¬μ 100"
};

exports.conf = {
    aliases: ["νΈμ°"],
    cooldown: 5
}
