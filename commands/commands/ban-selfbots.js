const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var hour = 3600000
    var membersToCheck = message.guild.members.filter(m => m.joinedTimestamp > Date.now()-hour)
    if(membersToCheck.size < 1) return message.reply('aucun selfbot trouvé !')
    membersToCheck.array()
    message.reply('vérification en cours... temps estimé : '+ConversionMs(2000 * message.guild.channels.size))
    var selfbots = []

    message.guild.channels.filter(c => c.type === 'text').forEach(c => {
        c.fetchMessages({limit:99}).then(msgs => {
            membersToCheck.forEach(member => {
                if(selfbots.indexOf(member) < 0){
                    var messages = msgs.filter(m => m.author.id === member.id).filter(m => m.createdTimestamp > Date.now()-hour)
                    if(messages.size > 30) selfbots.push(member)
                }
            })
        })
    })
    
    setTimeout(function(){
        var embed_desc = ''
        selfbots.forEach(selfb => embed += selfb.user.username+'\n')
        var embed = new Discord.RichEmbed()
            .setAuthor('Selfbots')
            .setDescription('Selfbots trouvés : \n\n'+selfbots)
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
        message.channel.send(embed)
        selfbots.forEach(m => m.ban({reason:'Selfbot', days:1}))
    }, 2000 * message.guild.channels.size)
    

    function ConversionMs(ms) {
        var d, h, m, s
        s = Math.floor(ms / 1000)
        m = Math.floor(s / 60)
        s = s % 60
        h = Math.floor(m / 60)
        m = m % 60
        d = Math.floor(h / 24)
        h = h % 24
        h += d * 24
        return h + ' heure(s), ' + m + ' minute(s) et ' + s+' seconde(s)'
    }
}

module.exports.help = {
    name:"ban-selfbots",
    desc:"Détecte automatiquement les selfbots !",
    usage:"ban-selfbots",
    group:"modération",
    examples:"$ban-selfbots"
}

module.exports.settings = {
    permissions:"BAN_MEMBERS",
    disabled:"false",
    owner:"false"
}