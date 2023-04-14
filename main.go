package main

import (
	"embed"
	"github.com/labstack/gommon/log"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	defer func() {
		err := recover()
		if err != nil {
			log.Fatalf("系统奔溃%v\n", err)
		}
	}()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "tasklist",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		log.Errorf("wails启动失败%v\n", err)
	}
}
