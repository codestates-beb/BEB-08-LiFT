#!/bin/bash
#mainServer.go
if go run mainServer.go ; then 
   go build mainServer.go
	 ./mainServer
else 
  echo "ERROR" 
fi
