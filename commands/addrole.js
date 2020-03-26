const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

   var role = message.mentions.roles.first()
   if(!role) return message.reply('mentionne un rôle !')

   var member = message.mentions.members.first()
   if(!member) return message.reply('mentionne un membre !')

   member.addRole(role).then( () => message.reply('rôle ajouté !')).catch(err => message.reply('je ne peux pas gérer cet utilisateur !'))
    
}

module.exports.help = {
    name:"addrole",
    desc:"Donne un rôle au membre mentionné.",
    usage:"addrole [@role] [@membre]",
    group:"utils",
    examples:"$addrole @『🐼』Membres @『Brozard』#4192"
}

module.exports.settings = {
    permissions:"MANAGE_ROLES",
    disabled:"false",
    owner:"false"
}