# 42 Helper

## Setup
- Start Pocketbase on server
	- /pocketbase
	- ./start_pocketbase.sh
	=> check if its running via ```ps aux | grep pocketbase``` and stop it via ```pkill pocketbase```
 - Push New Code to Server:
	- git push server-repo
	- on ssh connected to server: git pull
