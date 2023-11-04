import { spawn, spawnSync} from 'node:child_process';
import process from 'node:process';
import fs from 'node:fs';
//import path from 'node:path'; 

enum Pagers {
  LESS = 'less',
 MORE = 'more'
	}
	
	 const isUsingWindows = process.platform === 'win32';
let systemPager:  string; // reuse for later diffs 
let useSystemPager: boolean = true; 

export function setUseSystemPager(value: boolean) {
	useSystemPager =value;
}

export async function showInSystemPager(content: string): Promise<boolean> {
const pager = determineSystemPager();

if (pager) {
		let folder: string =""; 
	try {
folder = fs.mkdtempSync('yeoman-');
	const file =folder +'/diff.tmp';
	fs.writeFileSync(file	, content);

let lessEnv =process.env["LESS"];
if ( Pagers.LESS === pager) {
	const RAW_CONTROL_CHARS ='--RAW-CONTROL-CHARS'
	if (lessEnv) {
if (!lessEnv.includes('-R')	|| !lessEnv.includes(RAW_CONTROL_CHARS )) {
	lessEnv+= ' ' +RAW_CONTROL_CHARS ;
}
process.env.LESS = lessEnv;		
	}else {
		lessEnv =RAW_CONTROL_CHARS ;
		process.env.LESS = lessEnv;
	}	
}
//command += ' ' +file;

					

return await new Promise<boolean>( (resolve, reject) => {
			const child = spawn(pager,	{stdio:['pipe', 'inherit', 'inherit']});		
  const error: string[]  = [];

  child.on('error', (e) => {
    error.push(e.toString());
  });

  child.on('exit', () => {
    if (error.length) {
		reject(new Error(error.join('')));
}     else {
resolve(true	);
}
  });
    	child.stdin.write(content);
    	child.stdin.end();
});

	} catch (error) {
		  let message = 'Unknown Error'
  if (error instanceof Error) message = error.message
		console.error("error calling system pager: " +message);
	} finally {
try {
//		fs.rmSync(folder, {recursive: true, force: true});
		} catch (error) {}
	}
} 
return false;	
}	

	 function determineSystemPager(): string | undefined{
		 if (!useSystemPager) {
		return undefined;	 
		 }
		 
		 if (systemPager) {
			 return systemPager;
		 }
		 const pager: string |undefined = process.env['PAGER'];
		 if (pager && 			 commandExists(pager)){
			 systemPager = pager;
			 return pager;
		 } else if (commandExists(Pagers.LESS)) {
			 			 systemPager = Pagers.LESS;
			 return Pagers.LESS;
		 }else if (commandExists(Pagers.MORE)) {
systemPager = Pagers.MORE;
			 return Pagers.MORE;
		 }
	return undefined;	
	 }
	 
	 function commandExists(pager: string): boolean {
		 if (!pager) {
			 return false;
		 }
		 
		   try {
			   let retval;
			   if (isUsingWindows){
      retval = spawnSync('where', ['/q', pager] );
      } else {
		           retval= spawnSync('command', ['-v', pager]); 
	  } 
	  
	  if (retval.error) {
throw retval.error;
	  }
      return retval.status === 0	;
  } catch (error) {
	  console.log("error determining pager", (error instanceof Error ? ": " +(error as Error).message : "")	);
      return false;
  }
	 }
