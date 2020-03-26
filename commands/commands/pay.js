const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner, membre_data, members_data) => {

    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var users_data = new quickdb.table('usersdata')

    var member = message.mentions.members.first()
    if(!member) return message.channel.send(author+', vous devez mentionner un membre !')

    var amout_to_pay = args[1]
    if(!amout_to_pay) return message.channel.send(message.author+', vous devez entrer un montant à verser à **'+member.user.username+'** !')
    if(isNaN(amout_to_pay)) return message.channel.send(message.author+', montant invalide.')
    if(amout_to_pay > membre_data.credits) return message.channel.send(message.author+', vous ne disposez pas d\'assez de Brocoins pour effectuer cette transaction !')

    users_data.add(member.id+'.credits', amout_to_pay)
    users_data.subtract(message.author.id+'.credits', amout_to_pay)

    message.channel.send(message.author+', transaction effectuée.')
    
}

module.exports.help = {
    name:"pay",
    desc:"Payez un membre !",
    usage:"pay [@membre] [nombre]",
    group:"économie",
    examples:"$pay @『Brozard』#4192 20"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}