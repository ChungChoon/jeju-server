#!/bin/bash
set -u
set -e

echo "[*] Cleaning up temporary data directories"
rm -rf data
mkdir -p data/logs

echo "[*] Configuring Klay node "
mkdir -p data/dd/keystore
mkdir -p data/dd/klay
cp scripts/static-nodes.json data/dd/static-nodes.json
./klay --datadir data/dd init scripts/genesis.json
