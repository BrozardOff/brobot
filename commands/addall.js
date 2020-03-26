const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var the_role_id = 000

    var the_role_mention =  message.mentions.roles.first()

    if(!args[0]) return message.reply('veuillez mentionner un role ou donner son nom !')
    if(the_role_mention){
        the_role_id = the_role_mention.id
    }

    if(!the_role_id && !isNaN(args.join(' '))){
        the_role_id = args.join(' ')
    }

    if(!the_role_id && isNaN(args.join(' '))){
        role_name = args.join(' ')
        var the_role = message.guild.roles.find(r => r.name === role_name)
        if(!the_role) return message.reply('rôle `'+role_name+'` introuvable...')
        the_role_id = the_role.id
    }

    message.guild.members.forEach(element => {
        element.addRole(message.guild.roles.get(the_role_id)).catch(err =>{
            return message.channel.send('Veuillez me donner plus de permissions, car je ne peux pas gérer ce rôle...')
        })
    })

    message.channel.send('Rôle `' + message.guild.roles.get(the_role_id).name + '` en cours d\'ajout...')
    
}


module.exports.help = {
    name:"addall",
    desc:"Ajoute le role a tout le serveur !",
    usage:"addall [role]",
    group:"utils",
    examples:"$addall @『🐼』Membres"
}

module.exports.settings = {
    permissions:"ADMINISTRATOR",
    disabled:"false",
    owner:"false"
}