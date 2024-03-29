const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    const fetch = require('node-superfetch')
    const  generator = require('generate-password')

    message.channel.send('Combien de caractères ?')

    var nb_caract = "nd"
    var nombres = "nd"
    var symboles = "nd"

    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 240000 })

    collector.on('collect', message => {
        if(nb_caract === "nd" && nombres === "nd" && symboles === "nd"){
            if(isNaN(message.content)) return message.reply('entre un nombre valide !')
            if(parseInt(message.content) > 100000) return message.reply('Min : 0 | Max : 100000')
            nb_caract = message.content
            return message.channel.send('Le mot de passe pourra-t-il contenir des nombres ? [oui/non]')
        }
        if(nb_caract !== "nd" && nombres === "nd" && symboles === "nd"){
            var response = message.content.toLowerCase()
            if(response !== "oui" && response !== "non") return message.reply('entre oui ou non !')
            if(response === 'oui') nombres = true
            if(response === 'non') nombres = false
            return message.channel.send('Le mot de passe pourra-t-il contenir des symboles ? [oui/non]')
        }
        if(nb_caract !== "nd" && nombres !== "nd" && symboles === "nd"){
            var response = message.content.toLowerCase()
            if(response !== "oui" && response !== "non") return message.reply('entre oui ou non !')
            if(response === 'oui') symboles = true
            if(response === 'non') symboles = false
            return collector.stop('ok')
        }
    })

    collector.on('end', (collected, reason) => {

        if(reason === "time"){
            return message.reply('annulation, temps écoulé.')
        }
        if(reason === "ok"){
            var password = generator.generate({
                length: nb_caract,
                numbers: nombres,
                symboles: symboles
            })
            if(password.length > 1970){
                fetch.post(`https://hastebin.com/documents`).send(password).then(body => {
                    message.author.send('```Le mot de passe généré est trop long pour Discord, je l\'ai donc posté sur Hastebin ! Le lien : https://hastebin.com/'+body.body.key+'```')
                })
            }
            message.author.send('```Mot de passe généré : '+password+'```')
            return message.channel.send('Mot de passe envoyé en messages privés !')
        }
        if(reason !== "time" && reason !== "ok"){
            return message.reply('erreur.')
        }
    })

}

module.exports.help = {
    name:"password",
    desc:"Générez un mot de passe très sécurisé !",
    usage:"password",
    group:"utils",
    examples:"$password"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}