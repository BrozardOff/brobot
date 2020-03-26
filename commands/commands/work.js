const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner, membre_data, members_data) => {

    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var users_data = new quickdb.table('usersdata')
    var work = new quickdb.table('work')

    var ms = require('ms')
    
    var ts = work.get(message.author.id)
    if(ts){
        if(ts > Date.now()){
            var delai = convertMs(ts - Date.now())
            return message.channel.send(message.author+', vous devez attendre '+delai+' avant de pouvoir de nouveau utiliser cette commande !')
        }
    }
    
    var towait = Date.now() + ms('6h')
    work.set(message.author.id, towait)
    
    var work = 200

    var isprem = ''

    if(membre_data.premium === 'true'){
        work = work * 2
        isprem = ' premium'
    }

    var embed = new Discord.RichEmbed()
        .setAuthor('Salaire'+isprem+' récupéré !')
        .setDescription(work+' Brocoins ajoutés à votre profil !')
        .setFooter('Pour les membres premiums, le salaire est doublé !')
        .setColor(config.embed.color)
        .setTimestamp()
    
    users_data.add(message.author.id+'.credits', work)

    message.channel.send(embed)

    function convertMs(ms){
        var d, h, m, s
        s = Math.floor(ms / 1000)
        m = Math.floor(s / 60)
        s = s % 60
        h = Math.floor(m / 60)
        m = m % 60
        d = Math.floor(h / 24)
        h = h % 24
        h += d * 24
        return h + ' heure(s) ' + m + ' minute(s) ' + s + ' seconde(s)'
    }
    
}

module.exports.help = {
    name:"work",
    desc:"Travaillez et gagnez des Brocoins !",
    usage:"work",
    group:"économie",
    examples:"$work"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}