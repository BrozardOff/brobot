const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    if(args[0]){

        /* Recherche de la commande */
        let commandfile = bot.commands.get(args[0])
        if(!commandfile) return message.channel.send('La commande `' + args[0] +'` est introuvable !')

        /* Recherche du groupe */
        var the_group = commandfile.help.group.charAt(0).toUpperCase() + commandfile.help.group.substring(1).toLowerCase()
        /* Recherche des exemples */
        var examples = commandfile.help.examples.replace(/[$_]/g,config.prefix)

        /* Génération de l'embed */
        var group_embed = new Discord.RichEmbed()
            .setAuthor("Aide : " + commandfile.help.name)
            .addField('Utilisation : ', config.prefix+commandfile.help.usage, true)
            .addField('Exemple(s) : ', examples, true)
            .addField('Groupe : ', the_group, true)
            .addField('Description : ', commandfile.help.desc, true)
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)

        /* Vérifications et ajouts des paramètres */
        if(commandfile.settings.permissions !== "false") group_embed.addField('Permissions : ', `\`${commandfile.settings.permissions}\`` , true) 
        if(commandfile.settings.disabled === "true") group_embed.setDescription('Cette commande est actuellement désactivée', true)
        if(commandfile.settings.owner === "true") group_embed.setDescription('Seul `'+owner.user.username+'#'+owner.user.discriminator+'` peut effectuer cette commande !', true)

        /* Envoi de l'embed */
        return message.channel.send(group_embed)
    }

    var help_embed = new Discord.RichEmbed()
        .setDescription('Pour avoir de l\'aide sur une commande tapez `' + config.prefix + 'help <commande>` !')
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .setTimestamp()

    var groups = []
    var all_nb_cmd = 0
    bot.commands.forEach(element => {
        all_nb_cmd++
        _the_group = element.help.group
        if(groups.indexOf(_the_group) < 0){
            groups.push(_the_group)
            var current_commands = ""
            var nb_cmd = 0
            bot.commands.forEach(commande => {
                if(commande.help.group === _the_group){
                    current_commands += ' `'+commande.help.name+'`'
                    nb_cmd++
                }
            })
            current_commands = current_commands.replace(/[' '_]/g,', ').substr(1)
            _the_group = _the_group.charAt(0).toUpperCase() + _the_group.substring(1)
            if(nb_cmd > 0){
                var commands_nb = nb_cmd
                help_embed.addField('Commandes '+_the_group + ' - ('+commands_nb+')', current_commands)
            }
        }
    })
    help_embed.setAuthor('Liste des commandes - (' + all_nb_cmd + ')')
    message.channel.send(help_embed)

}

module.exports.help = {
    name:"help",
    desc:"Affiche l'aide du bot",
    usage:"help (commande)",
    group:"général",
    examples:"$help\n$help ban"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}