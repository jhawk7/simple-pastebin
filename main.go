package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-pastebin/internal/paste"
	log "github.com/sirupsen/logrus"
)

var (
	pastebin *paste.Bin
)

type SetBody struct {
	Value string `json:"value"`
}

func main() {
	pastebin = paste.InitBin()
	router := gin.Default()
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
		return
	})

	router.GET("/:key", GetValueByKey)
	router.POST("/", SetValue)
	router.Run(":8888")
	return
}

func GetValueByKey(c *gin.Context) {
	key := c.Param("key")
	val, keyErr := pastebin.Retrieve(key)
	if keyErr != nil {
		log.Error(keyErr)
		c.AbortWithError(http.StatusNotFound, fmt.Errorf("key %v not found", key))
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"value": val,
	})
	return
}

func SetValue(c *gin.Context) {
	var data SetBody
	if bindErr := c.BindJSON(&data); bindErr != nil {
		log.Errorf("failed to bind request body; %v", bindErr)
		c.AbortWithError(http.StatusBadRequest, fmt.Errorf("error in json request"))
		return
	}

	key := pastebin.Store(data.Value)
	c.JSON(http.StatusCreated, gin.H{
		"key": key,
	})
	return
}
