import type { DefaultLoggerCategories, Logger as LoggerApi, ColoredMessage } from "@yeoman/types";
import {Logger,  createLogger } from "../log.js"
import { spawn,spawnSync} from 'node:child_process';
import process from 'node:process';
import { TerminalAdapter } from "@yeoman/adapter";
	async function main(): Promise<void>{
		
		const log : LoggerApi =new TerminalAdapter({useSystemPager: true}).log;
//		createLogger({useSystemPager: true});
let msg ="";
const messages: ColoredMessage[][] =[];
for (let i =0; i< 20000; i++) {
messages.push([{message: msg +="This is test message number " +i +"\n", color: "added"}]);

}
await 		log.colored([{message: msg, color: "added"}]);
		console.log('\u0007');
}

  await main();
