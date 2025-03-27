package main

import (
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
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
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET, POST"},
		AllowHeaders: []string{"Origin, Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"},
	}))

	router.Use(static.Serve("/", static.LocalFile("./frontend/build", false)))
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	router.GET("/get", GetValueByKey)
	router.POST("/set", SetValue)
	router.Run(":8888")
}

func GetValueByKey(c *gin.Context) {
	key := c.Query("key")
	if key == "" {
		err := fmt.Errorf("missing key in request")
		log.Error(err)
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	if len(key) != paste.Keylen {
		log.Error(fmt.Errorf("unexpected key given in request"))
		c.AbortWithError(http.StatusNotFound, fmt.Errorf("key %v not found", key))
		return
	}

	val, keyErr := pastebin.Retrieve(key)
	if keyErr != nil {
		log.Error(keyErr)
		c.AbortWithError(http.StatusNotFound, fmt.Errorf("key %v not found", key))
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"value": val,
	})
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
}
