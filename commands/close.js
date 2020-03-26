const Discord = require("discord.js")

module.exports.run = async (message, args, client, config) => {

    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Vous n'êtes pas dans un salon de ticket !`)
    message.channel.send(`Pour confimer tapez -conf`)
    .then((m) => {
        message.channel.awaitMessages(response => response.content === '-conf', {
        max: 1,
        time: 10000,
        errors: ['time'],
        })
        .then((collected) => {
            message.channel.delete()
        })
        .catch(() => {
            m.edit('Temps écoulé, annulation.').then(m2 => {
                m2.delete()
            }, 3000)
        })
    })

}

module.exports.help = {
    name:"close",
    desc:"Ferme un ticket !",
    usage:"close",
    group:"utils",
    examples:"$close"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}