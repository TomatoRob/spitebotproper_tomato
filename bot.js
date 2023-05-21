const path = require('node:path');
const { token } = require('./config.json');
const { Client, GatewayIntentBits, Collection,EmbedBuilder,Events } = require('discord.js');
const fs = require('node:fs');
const CronJob = require('./node_modules/cron/lib/cron.js').CronJob;

var today = new Date();
console.log(today);

const client = new Client({
    intents:
     [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        
    ]
});

//

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Event.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});



const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}




console.log('Before job instantiation');
const job = new CronJob('00 00 10 * * *', function() {
    console.log('test case worked??');
    vcmembersweep();
    heightrandomizer();
});
console.log('After job instantiation');
job.start();


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
  
function heightrandomizer(){
    const guild = client.guilds.cache.get('843679445109440532');
    const channel = client.channels.cache.get('843679445109440535');

    var feet = getRandomIntInclusive(2,5);
    var inches = getRandomIntInclusive(0,11);
    var newheight = `${feet}'${inches}" King 👑`;

    let embed = new EmbedBuilder()
        .setTitle(`Height Alert!`)
        .setColor('Random')
        .setDescription(`Hoovy is now ${feet}'${inches}"`);

    guild.roles.edit('883871117532602378', { name: `${newheight}` });
    channel.send({embeds: [embed]} );
    console.log(newheight);
}

function vcmembersweep(){
    const formattedmemberArray = []; // Array for the completed member names
    const channelIDArray = ['857074349105610766','882546098672140298','882546009593499739','945548407232155658']; // All channels that it needs to check
    const channel = client.channels.cache.get('857074349105610765');  //output channel

    for (let x = 0; x < channelIDArray.length; x++){
    const vc = client.channels.cache.get(channelIDArray[x]);
    const memberArray = vc.members.map(member => member.id);
    
        for (let i = 0; i < memberArray.length; i++) {
        var memberpreform = memberArray[i];
        var memberpostform = `<@${memberpreform}>`;
        formattedmemberArray.push(memberpostform);
      } 
    }
         const memberString = `${formattedmemberArray.join()} go the fuck to sleep`;
         if(memberString === ' go the fuck to sleep'){
         console.log('Nobody in VC')
          }
         else {
     channel.send(memberString);
    }
      
}

function rolecoinflip(){
const guild = client.guilds.cache.get('843679445109440532');
const role = guild.roles.cache.get('854640349469605909');
const mrole = guild.roles.cache.get('843752270704279592');
const channel = client.channels.cache.get('843679445109440535');
var roleposition = mrole.position;
var coinflip = getRandomIntInclusive(1,100);
console.log(coinflip);

if (coinflip % 2 === 0){
    role.setPosition(roleposition - 3);
    channel.send("Coinflip! Apple has won today!");
 }

else if (coinflip % 2 != 0){
    role.setPosition(roleposition - 4);
    channel.send("Coinflip! Glados has won today!");
 }

else{
 console.log('Failure on Coinflip');
 }
}
//this is a test
client.login(token);