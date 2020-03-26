const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {
    let username = (message.member.nickname) ? message.member.nickname : message.author.username

    if(!args[0]) return message.reply('entrez une question !')

    let replies = [
        "il est certain !",
        "c'est décidément sur.",
        "sans aucun doute.",
        "oui, j'en suis sur et certain !",
        "probablement...",
        "oui !",
        "non !",
        "des signes me font dire oui...",
        "demandez à nouveau plus tard :\\",
        "mieux vaut ne pas te le dire maintenant...",
        "je ne peux pas prédire maintenant.",
        "concentrez-vous et demandez à nouveau !",
        "ne compte pas la dessus.",
        "ma réponse est non.",
        "mes sources disent que non...",
        "oh... J'en doute !"
    ]

    let result = Math.floor((Math.random() * replies.length))

    message.channel.send('**'+username+'**, '+replies[result])

}

module.exports.help = {
    name:"8ball",
    desc:"J'ai la réponse à vos questions !",
    usage:"8ball [question]",
    group:"fun",
    examples:"$8ball"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}