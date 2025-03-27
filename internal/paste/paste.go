package paste

import (
	"fmt"
	"math/rand"
	"sync"
	"time"

	log "github.com/sirupsen/logrus"
)

const (
	Keylen int = 4
)

type Paste struct {
	Key   string `json:"key"`
	Value string `json:"value"`
	Ts    string `json:"timestamp"`
}

type PasteData struct {
	Data []*Paste `json:"data"`
}

type Bin struct {
	mu      sync.Mutex
	storage map[string]*Paste
}

func InitBin() *Bin {
	return &Bin{
		mu:      sync.Mutex{},
		storage: make(map[string]*Paste),
	}
}

func (pbin *Bin) Store(value string) string {
	pbin.mu.Lock()
	defer pbin.mu.Unlock()

	key := generateKey()
	for pbin.storage[key] != nil {
		log.Infof("collision detected with key %v; re-generating", key)
		key = generateKey()
	}

	pbin.storage[key] = &Paste{
		Key:   key,
		Value: value,
		Ts:    time.Now().Format("2006-01-02 15:04:05"),
	}

	return key
}

func (pbin *Bin) Retrieve(key string) (val string, err error) {
	pbin.mu.Lock()
	defer pbin.mu.Unlock()

	if paste, found := pbin.storage[key]; !found {
		err = fmt.Errorf("key %v does not exist", key)
	} else {
		log.Infof("data for key %v retrieved, removing kv pair", key)
		delete(pbin.storage, key)
		val = paste.Value
	}

	return
}

func (pbin *Bin) RetrieveAll() (pasteData PasteData) {
	pbin.mu.Lock()
	defer pbin.mu.Unlock()

	if len(pbin.storage) > 0 {
		var data []*Paste
		for _, paste := range pbin.storage {
			data = append(data, paste)
		}

		pasteData.Data = data
	}

	log.Infof("retrieved %v pastes from pastbin", len(pbin.storage))
	return
}

func (pbin *Bin) DeletePaste(key string) {
	pbin.Retrieve(key)
	return
}

func generateKey() string {
	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	// initialize random number generator
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, Keylen) //easier to remember 4 chars
	for i := range b {
		b[i] = charset[r.Intn(len(charset))]
	}

	log.StandardLogger().Info(fmt.Sprintf("generated key %v", string(b)))
	return string(b)
}
