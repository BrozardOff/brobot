const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var giveaways_db = new quickdb.table('giveaways')
    
    var author = '**'+message.author.username+'**'

    var ms = require('ms')

    message.channel.send(author+', bienvenue dans l\'interface de lancement de Giveaway !\nSuivez simplement les instructions (vous pouvez taper "cancel" à tout moment)\n\n**1. Entrez le lot du Giveaway :**')
    var Giveaway_data = {
        lot:'undefined',
        channel:'undefined',
        temps:'undefined'
    }
    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 120000 })
    collector.on('collect', m => {
        if(m.content === 'cancel'){
            message.channel.send(author+', votre action a correctement été annulée !')
            return collector.stop('cancelled')
        }
        if(Giveaway_data.lot !== 'undefined' && Giveaway_data.channel !== 'undefined' && Giveaway_data.temps === 'undefined'){
            // On attend le temps ici
            var time = m.content
            if(isNaN(ms(time))) return message.channel.send(author+', vous devez entrer un temps valide (comme 4h pour 4 heures) !\n\n**3. Entrez le temps du Giveaway (par exemple : 3m):**')
            Giveaway_data.temps = ms(time)
            message.channel.send(author+', okay ! Le Giveaway durera donc '+dhm(Giveaway_data.temps)+' !\n\n__**GIVEAWAY LANCÉ !**__')
            return collector.stop(Giveaway_data)
        }
        if(Giveaway_data.lot !== 'undefined' && Giveaway_data.channel === 'undefined' && Giveaway_data.temps === 'undefined'){
            // On attend le channel ici
            var channel = m.mentions.channels.first()
            if(!channel) channel = message.guild.channels.find(e => e.name === m.content)
            if(!channel) return message.channel.send(author+', aucun salon trouvé avec "'+m.content+'" !\n\n**2. Entrez le salon du Giveaway (mention ou nom) :**')
            Giveaway_data.channel = channel.id
            message.channel.send(author+', d\'accord ! Le Giveaway se déroulera donc dans <#'+Giveaway_data.channel+'> !\n\n**3. Entrez le temps du Giveaway (par exemple : 3m):**')
        }
        if(Giveaway_data.lot === 'undefined' && Giveaway_data.channel === 'undefined' && Giveaway_data.temps === 'undefined'){
            // On attend le lot ici
            Giveaway_data.lot = m.content
            message.channel.send(author+', ça marche ! Le lot sera donc :  **'+Giveaway_data.lot+'** !\n\n**2. Entrez le salon du Giveaway (mention ou nom) :**')
        }
    })
    collector.on('end', (collected, reason) => {
        if(reason === 'time'){
            return message.channel.send(author+', temps écoulé ! Veuillez retaper la commande !')
        }
        if(reason === 'cancelled') return

        var gembed = new Discord.RichEmbed()
            .setAuthor('En cours de lancement...')
    
        message.guild.channels.get(reason.channel).send(gembed).then(msg_giveaway => {

            msg_giveaway.react('🎉')

            // Save the Giveaway

            var data = reason
            data.messageid = msg_giveaway.id
            data.endAt = Date.now() + data.temps
            data.startAt = Date.now()

            giveaways_db.push('giveaways', data)

        })
    })

    function dhm(t){
        var cd = 24 * 60 * 60 * 1000,
            ch = 60 * 60 * 1000,
            d = Math.floor(t / cd),
            h = Math.floor( (t - d * cd) / ch),
            m = Math.round( (t - d * cd - h * ch) / 60000),
            pad = function(n){ return n < 10 ? '0' + n : n }
    if( m === 60 ){
        h++
        m = 0
    }
    if( h === 24 ){
        d++
        h = 0
    }
    return [d, pad(h), pad(m)].join(':')
    }

}

module.exports.help = {
    name:"giveaway",
    desc:"Lance un Giveaway !",
    usage:"giveaway",
    group:"administration",
    examples:"$giveaway"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    disabled:"false",
    owner:"false",
    support:"true"
}