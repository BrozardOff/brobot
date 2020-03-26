const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var texte = args[0]
    if(!texte) return message.reply('entre un mot !')

    var the_request = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+texte

    var file_name = texte

    message.channel.send('Génération de votre QR pour "' + texte + '" en cours...').then(m => {
        m.edit('QR code généré !')
    })

    message.channel.send({
        files: [{
        attachment: the_request,
        name: `${file_name}.png` //.gif si c'est un gif
        }]
    })

}

module.exports.help = {
    name:"qrcode",
    desc:"Transforme votre mot en qrcode scannable !",
    usage:"qrcode [mot]",
    group:"fun",
    examples:"$qrcode coucou"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}