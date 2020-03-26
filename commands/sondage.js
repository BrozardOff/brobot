const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

   
    var the_channel = message.guild.channels.get('507617582665170956')
    if(!the_channel) return
    message.delete().catch(O_o=>{})
    
    var question = args.join(" ")
    
    if(!args[0]){
        return message.reply('veuillez entrer une question !')
    }

    var mention = ""
    var first_mention = ""
        
    message.channel.send('Souhaitez vous que je mentionne ? [oui/non]').then(m =>{
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 240000 })
        
        collector.on('collect', message => {
    
            if(message.content === "non"){
                message.delete()
                mention = ""
                collector.stop('ok')
            }
            if(message.content === "oui"){
                message.delete()
                first_mention = "defined"
                message.channel.send('Tape une des réponses suivantes : [here/every]').then(mess =>{
                    setTimeout(function(){
                        mess.delete()
                    }, ms('4s'))
                })
            }
            if(first_mention === "defined"){
                if(message.content === "here"){
                    message.delete()
                    mention = "@here"
                    collector.stop('ok')
                }
                if(message.content === "every"){
                    message.delete()
                    mention = "@everyone"
                    collector.stop('ok')
                }
            }
        })
    
        collector.on('end', (collected, reason) => {
    
            if(reason === "time"){
                return message.channel.send('Temps écoulé. Veuillez retaper la commande.')
            }
    var emotes = [ bot.emojis.find(e => e.name === "non"), bot.emojis.find(e => e.name === "oui")] 
            let embed = new Discord.RichEmbed()
                .setAuthor('📊 Sondage :')
                .setColor(config.embed.color)
                .addField(question, "Réagissez avec " + emotes[1] + " ou " + emotes[0] + " !")
            
            m.delete()
            
            the_channel.send(mention, embed).then((me) => {
                 me.react(emotes[1])
                 me.react(emotes[0])
                
            }).catch(err => message.channel.send('Je ne peux pas écrire dans le salon sondage...'))
    
        })
    })

    
}


module.exports.help = {
    name:"sondage",
    desc:"Poste un sondage !",
    usage:"sondage [question]",
    group:"utils",
    examples:"$sondage Pain au chocolat ou... ? (Pas de questions a se poser c'est PAIN AU CHOCOLAT)"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    disabled:"false",
    owner:"false"
}