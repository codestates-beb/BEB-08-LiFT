#!/bin/bash

if go run main.go; then 
   go build main.go
	 ./main
else 
  echo "ERROR" 
fi
