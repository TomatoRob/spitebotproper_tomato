const { token } = require('./config.json');
const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const fs = require('node:fs');
const CronJob = require('./node_modules/cron/lib/cron.js').CronJob;

var today = new Date();
console.log(today);

const client = new Client({
    intents:
     [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.Guilds,
        
    ]
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
    rolecoinflip();
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
    guild.roles.edit('883871117532602378', { name: `${newheight}` });
    channel.send(`Height Alert! Hoovy is now ${feet}'${inches}"` );
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
         channel.send(`Wow, everyone's asleep. Good Job`);
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

if (coinflip % 2 === 0){
    role.setPosition(roleposition - 3);
    channel.send("Coinflip! <@101091977889615872> has won today!");
 }

else if (coinflip % 2 != 0){
    role.setPosition(roleposition - 4);
    channel.send("Coinflip! <@536268187365539840> has won today!");
 }

else{
 console.log('Failure on Coinflip');
 }
}

client.login(token);