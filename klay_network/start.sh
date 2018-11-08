#!/bin/bash
killall klay 
set -u
set -e

mkdir -p data/logs

echo "[*] Starting Klay node"
set -v
NETWORK_ID=1000
PORT=32323
RPC_PORT=8551
WS_PORT=8552
DATA_DIR=data/dd

nohup ./klay --lightkdf --nodetype rn --networkid $NETWORK_ID --datadir $DATA_DIR --port $PORT --rpc --rpcapi klay,net,personal --rpcport $RPC_PORT --rpcaddr 0.0.0.0 --rpccorsdomain "*" --rpcvhosts "*" --ws --wsaddr 0.0.0.0 --wsport $WS_PORT --wsorigins "*" --srvtype fasthttp --metrics --prometheus --verbosity 5 --txpool.globalslots 1024 --txpool.globalqueue 1024 --txpool.accountslots 1024 --txpool.accountqueue 1024 --nodiscover --syncmode full --mine >> data/logs/klay.log &
