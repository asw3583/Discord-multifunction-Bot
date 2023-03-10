const Discord = require('discord.js')
const convert = require('parse-ms')

exports.run = async (client, message, args) => {
  let user
  if (message.mentions.users.first()) {
    user = message.mentions.users.first()
  } else {
    user = message.author
  }

  let status
  if (user.presence.activities.length === 1)
    status = user.presence.activities[0]
  else if (user.presence.activities.length > 1)
    status = user.presence.activities[1]

  if (
    user.presence.activities.length === 0 ||
    (status.name !== 'Spotify' && status.type !== 'LISTENING')
  ) {
    return message.channel.send('이 사용자는 Spotify를 듣고 있지 않습니다.')
  }

  if (
    status !== null &&
    status.type === 'LISTENING' &&
    status.name === 'Spotify' &&
    status.assets !== null
  ) {
    let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`,
      url = `https:/open.spotify.com/track/${status.syncID}`,
      name = status.details,
      artist = status.state,
      album = status.assets.largeText,
      timeStart = status.timestamps.start,
      timeEnd = status.timestamps.end,
      timeConvert = convert(timeEnd - timeStart)

    let minutes =
      timeConvert.minutes < 10 ? `0${timeConvert.minutes}` : timeConvert.minutes
    let seconds =
      timeConvert.seconds < 10 ? `0${timeConvert.seconds}` : timeConvert.seconds
    let time = `${minutes}:${seconds}`

    const embed = new Discord.MessageEmbed()
      .setAuthor(
        '정보',
        'https://image.flaticon.com/icons/svg/2111/2111624.svg',
      )
      .setColor(0x1ed768)
      .setThumbnail(image)
      .addField('이름:', name, true)
      .addField('엘범:', album, true)
      .addField('아트스트:', artist, true)
      .addField('지속:', time, false)
      .addField(
        '지금 Spotify에서 듣기!',
        `[\`${artist} - ${name}\`](${url})`,
        false,
      )
    return message.channel.send(embed)
  }
}

exports.help = {
  name: '스포티파이',
  description: '스포티파이 사용자 상태를 표시합니다.',
  usage: '스포티파이 [@멘션]',
  example: '스포티파이 ',
}

exports.conf = {
  aliases: [],
  cooldown: 5,
}
