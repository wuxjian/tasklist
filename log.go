package main

import (
	"log"
	"os"
)

func init() {
	file, err := os.OpenFile("log.log", os.O_CREATE|os.O_APPEND|os.O_RDWR, os.ModePerm)
	if err != nil {
		return
	}
	log.SetOutput(file)
	log.SetFlags(log.Llongfile)
}
