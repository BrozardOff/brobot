const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    message.delete()

    var the_member = message.mentions.members.first()

    if(!the_member)
        return message.reply('mentionne un membre !')

    if(!the_member.bannable)
        return message.channel.send("Une erreur est survenue. Ais-je bien un rôle supérieur à " + the_member + " ?")

    let raison = args.slice(1).join(' ')
    if(!raison) raison = "Pas de raison donnée."
    raison = raison + ' | Banni par ' + message.author.username

    the_member.ban(raison)

    message.channel.send(the_member.user.username+' a bien été banni du serveur !')

    var the_channel = message.guild.channels.get(config.logs_channel)
    
    if(the_channel) return the_channel.send('**'+the_member.user.username + '#'+the_member.user.discriminator+'** banni par **'+message.author.username+'#'+message.author.discriminator+'**')

}

module.exports.help = {
    name:"ban",
    desc:"Ban le membre du serveur !",
    usage:"ban [@membre] [raison]",
    group:"modération",
    examples:"$ban @『Brozard』#4192 Spam"
}

module.exports.settings = {
    permissions:"BAN_MEMBERS",
    disabled:"false",
    owner:"false"
}