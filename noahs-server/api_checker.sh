#!/usr/bin/bash

if curl -s https://noahs-ark-shelter.onrender.com/ -o /dev/null; then
  echo "Success"
else
  echo "Failed"
fi
