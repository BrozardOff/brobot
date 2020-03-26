const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config) => {

    
    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var blacklist = new quickdb.table('blacklist')

    var status = args[0]
    if(!status) return message.reply('veuillez vérifier les paramètres de la commande !')

    if(status === 'list'){
        var array = blacklist.get('words')
        var msg = '__**Affichage des mots blacklist :**__\n\n'
        var embed = new Discord.RichEmbed()
            .setAuthor('Blacklist')
            .setColor(config.color)
            .setFooter(config.footer)
        if(array.length > 0){
            array.forEach(word => {
                msg += '• '+word+'\n'
            })
        } else {
            msg += 'Aucun mot actuellement enregistré !'
        }
        embed.setDescription(msg)
        message.channel.send(embed)
    }

    if(status === 'add'){
        var array = blacklist.get('words')
        var word = args[1]
        if(!word) return message.reply('tu dois entrer un mot !')
        if(array.length > 0){
            var isAlreadyInBlacklist = false
            array.forEach(tword => {
                if(tword === word) isAlreadyInBlacklist = true
            })
            if(isAlreadyInBlacklist) return message.channel.send(emotes[0]+' | Ce mot est déjà enregistré !')
        }
        blacklist.push('words', word)
        message.channel.send('Mot enregistré dans la blacklist !')
    }

    if(status === 'remove'){
        var array = blacklist.get('words')
        var word = args[1]
        if(!word) return message.reply('tu dois entrer un mot !')
        if(array.length > 0){
            var isAlreadyInBlacklist = false
            array.forEach(tword => {
                if(tword === word) isAlreadyInBlacklist = true
            })
            if(!isAlreadyInBlacklist) return message.channel.send(emotes[0]+' | Ce mot n\'est pas enregistré !')
        }
        var narray = []
        array.forEach(mot => {
            if(mot !== word) narray.push(mot)
        })
        blacklist.set('words', narray)
        message.channel.send('Mot supprimé de la blacklist !')
    }

}

module.exports.help = {
    name:"blacklist",
    desc:"Gérez la blacklist tel que le vous le souhaitez !",
    usage:"blacklist [list/add/remove] (mot)",
    group:"owner",
    examples:"$blacklist list\n$blacklist add vache\n$blacklist remove vache"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"true"
}