const Discord = require('discord.js');
const { promptMessage } = require("../../functions.js");
const db = require("quick.db");
const ms = require("parse-ms");

const chooseArr = ["β", "ποΈ", "βοΈ"];

exports.run = async (client, message, args) => {

    if (message.channel.id !== "803964960068599869") {
        message.delete()
        return message.reply("κ°μλ°μλ³΄ κ°λ₯ν μ±λμ΄ μλλλ€!")
    }

    const amount = parseInt(args[0]);
    const balance = db.get(`account.${message.author.id}.balance`);

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
        .setColor("#ffffff")
        .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
        .setDescription("μ΄ μ΄λͺ¨ν°μ½ μ€ νλμ λ°μμ μΆκ°νμ¬ κ²μμ νλ μ΄νμΈμ!")
        .setTimestamp();

    const m = await message.channel.send(embed);
    const reacted = await promptMessage(m, message.author, 30, chooseArr);

    const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)];

    const result = await getResult(reacted, botChoice);
    await m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error))

    embed
        .setDescription("")
        .addField(result, `${reacted} vs ${botChoice}`);

    m.edit(embed);

    function getResult(me, clientChosen) {
        if ((me === "β" && clientChosen === "βοΈ") ||
            (me === "ποΈ" && clientChosen === "β") ||
            (me === "βοΈ" && clientChosen === "ποΈ")) {
            db.set(`lastGamble.${message.author.id}`, Date.now());
            db.add(`account.${message.author.id}.balance`, amount);
            return "λΉμ μ΄ μΉλ¦¬νμ¨μ΅λλ€!";
        } else if (me === clientChosen) {
            db.set(`lastGamble.${message.author.id}`, Date.now());
            return "λΉκ²Όμ΅λλ€!";
        } else {
            db.set(`lastGamble.${message.author.id}`, Date.now());
            db.subtract(`account.${message.author.id}.balance`, amount);
            return "λΉμ μ ν¨λ°°νμ¨μ΅λλ€ γ γ ";
        }
    }
}


exports.help = {
    name: "λμ ",
    description: "κ°μλ°μλ³΄νκΈ°",
    usage: "λμ  <λ°°ν>",
    example: "λμ  100"
};

exports.conf = {
    aliases: ["νΈμ°"],
    cooldown: 5
}
