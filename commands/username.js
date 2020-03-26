const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var the_pseudo = message.author.username

    if(args[0]){
        the_pseudo = args.join(' ')
    }

    var the_users = ''

    var users_count = 0
    var good_users_count = 0

    bot.users.forEach(element => {
        if(element.username === the_pseudo){
            if(element.bot){
                return the_users += '- '+element.username + '#'+element.discriminator+' | ID : '+element.id+' | Cet utilisateur est un bot\n'
            }
            the_users += '- '+element.username + '#'+element.discriminator+' | ID : '+element.id+'\n'
            good_users_count++
        }
        users_count++
    })

    if(good_users_count === 0){
        return message.channel.send('Aucun utilisateur trouvé...')
    }
    if(good_users_count === 1){
        return message.channel.send('Utilisateurs possédant le pseudo `'+the_pseudo+'` ('+good_users_count+' membre) : \n'+the_users)
    }
    message.channel.send('Utilisateurs possédant le pseudo `'+the_pseudo+'` ('+good_users_count+' membres) : \n'+the_users)


}

module.exports.help = {
    name:"username",
    desc:"Cherche tous les membres possédant le pseudo !",
    usage:"username (pseudo)",
    group:"fun",
    examples:"$username 『Brozard』"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}