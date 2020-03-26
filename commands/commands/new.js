const Discord = require("discord.js")

module.exports.run = async (message, args, client, config) => {

    var parent_channel = message.guild.channels.get('692066296132796497')
    const reason = message.content.split(" ").slice(1).join(" ")
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)){
        var the_channel = message.guild.channels.find(ch => ch.name === "ticket-" + message.author.id)
        return message.channel.send(`Vous avez déjà un ticket ouvert ! (`+the_channel+')')
    }
    message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
        c.setParent(parent_channel)
        let role = message.guild.roles.find("name", "@everyone")
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        })
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        })
        message.channel.send(`Votre ticket a été ouvert, <#${c.id}>.`)

        setTimeout(() => {
            const embed = new Discord.RichEmbed()
                .setColor(0xFF0000)
                .addField(`Bienvenue ${message.author.username}!`, `Veuillez nous en dire un peu plus sur votre demande d'aide !`)
                .setTimestamp()
                .setFooter('Tape '+prefix+'close pour fermer le ticket')
            c.send('@everyone', embed)
        }, 2000)
        
    }).catch(console.error)

}

module.exports.help = {
    name:"new",
    desc:"Ouvre un ticket !",
    usage:"new",
    group:"utils",
    examples:"$new"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}