const Discord = require("discord.js")
let infractions = JSON.parse(fs.readFileSync("./infraction.json", "utf8"))
const {promisify} = require("util")
const write = promisify(fs.writeFile)
var saveEnCours = false


async function save(){
    if(!saveEnCours){
        saveEnCours  = true
        await write("infraction.json", JSON.stringify(infractions,null,'\t'))
        saveEnCours  = false
    }
}
module.exports.run = async (message, args, bot, config, owner) => {

    message.delete()

    var mention = message.mentions.members.first()

    if(!mention)
        return message.reply('mentionne un membre !')

    if(!mention.kickable)
        return message.channel.send("Une erreur est survenue. Ais-je bien un rôle supérieur à " + mention + " ?")

    let raison = args.slice(1).join(' ')
    if(!raison) raison = "Pas de raison donnée."
    raison = raison + ' | Expulsé par ' + message.author.username

    mention.kick(raison)

    message.channel.send(mention.user.username+' a bien été expulsé du serveur !')

    var the_channel = message.guild.channels.get(config.logs_channel)
    
    if(the_channel) the_channel.send('**'+ mention.user.username + '#'+mention.user.discriminator+'** expulsé par **'+message.author.username+'#'+message.author.discriminator+'**')
    if(infractions[mention.id] === undefined){
        infractions[mention.id] = {"warns":[],"mute":[],"kick":[],"tempban":[]}
        save()
    }
    infractions[mention.id]["kick"].push("**" + raison + "** • " + message.author.tag)
    save()

}

module.exports.help = {
    name:"kick",
    desc:"Expulse le membre du serveur !",
    usage:"kick [@membre] [raison]",
    group:"modération",
    examples:"$kick @『Brozard』#4192 Spam"
}

module.exports.settings = {
    permissions:"KICK_MEMBERS",
    disabled:"false",
    owner:"false"
}