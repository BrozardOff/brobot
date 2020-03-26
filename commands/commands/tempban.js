const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    message.delete()

    var ms = require('ms')

    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var unban = new quickdb.table('unban')

    var the_member = message.mentions.members.first()
    if(!the_member)
        return message.reply('mentionne un membre !')
    if(!the_member.bannable)
        return message.channel.send("Une erreur est survenue. Ais-je bien un rôle supérieur à " + the_member + " ?")

    var time = args[1]
    if(!time || isNaN(ms(time))) return message.reply('tu dois préciser un temps valide !')

    var reason = args.slice(2).join(' ')
    if(!reason) reason = 'Pas de raison donnée'

    user.send(`Tu viens d'être temp ban sur ${message.guild.name} par ${message.author.username} pendant ${time} pour ${reason} !`)

    message.channel.send(`**${user.user.username}#${user.user.discriminator}** est temp ban pendant **${time}** pour **${reason}**`)
    
    var tempban_object = {
        "member_id":user.id,
        "guild_id":message.guild.id
    }

    var ftime = Date.now()+ms(time)
    ftime = Math.floor(ftime / 1000)
    ftime = String(ftime)
    
    var cdata = unban.get(ftime)
    if(!cdata) unban.set(ftime, [])
    unban.push(ftime, tempban_object)

}

module.exports.help = {
    name:"ban",
    desc:"Ban le membre du serveur !",
    usage:"ban [@membre] [temps] [raison]",
    group:"modération",
    examples:"$ban @『Brozard』#4192 10m Spam répétitif"
}

module.exports.settings = {
    permissions:"BAN_MEMBERS",
    disabled:"false",
    owner:"false"
}