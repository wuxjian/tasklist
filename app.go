package main

import (
	"bytes"
	"context"
	"fmt"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"os/exec"
)

// App struct
type App struct {
	ctx context.Context
}

var db *gorm.DB

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	var err error
	db, err = gorm.Open(sqlite.Open("database.db"), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		panic(err) // todo
	}
	// 初始化表
	err = db.AutoMigrate(&Application{})
	if err != nil {
		panic(err) // todo
	}

}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

type Application struct {
	Id              uint   `json:"id"`
	Name            string `json:"name"`
	Code            string `json:"code"`
	Status          bool   `json:"status" gorm:"-"`
	ApplicationPath string `json:"applicationPath"`
}

func (a *App) ApplicationAdd(application Application) {
	if application.Id > 0 {
		db.Save(&application)
	}

	db.Create(&application)
}

func (a *App) ApplicationDelete(id uint) {
	db.Delete(&Application{}, id)
}

func (a *App) ApplicationList() []Application {
	var l []Application
	db.Order("id desc").Find(&l)
	for i, v := range l {
		status := a.ApplicationStatus(v.Code)
		v.Status = status
		l[i] = v
	}
	fmt.Println("ApplicationList")
	return l
}

func (a *App) ApplicationStart(p string) error {
	c := exec.Command("cmd", "/c", "start", p)
	return c.Run()
}

func (a *App) ApplicationStatus(appName string) bool {
	var outBytes bytes.Buffer
	c := exec.Command("cmd", "/c", "start", "/B", "tasklist", "|", "findstr", appName)
	c.Stdout = &outBytes
	err := c.Run()
	if err != nil {
		fmt.Println("ApplicationStatus Error", err.Error())
		return false
	}
	if outBytes.Len() > 0 {
		return true
	}
	return false
}
