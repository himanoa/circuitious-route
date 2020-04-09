#!/usr/bin/env sh
ssh-keygen -t rsa -b 4096 -m PEM -f data/simic.key
# Don't add passphrase
openssl rsa -in data/simic.key -pubout -outform PEM -out data/simic.key.pub
