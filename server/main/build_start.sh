#!/bin/bash

if go run mainServer.go; then 
   go build mainServer.go
	 ./main
else 
  echo "ERROR" 
fi
