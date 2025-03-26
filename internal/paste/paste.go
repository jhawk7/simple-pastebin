package paste

import (
	"fmt"
	"math/rand"
	"sync"
	"time"

	log "github.com/sirupsen/logrus"
)

type Bin struct {
	mu      sync.Mutex
	storage map[string]string
}

func InitBin() *Bin {
	return &Bin{
		mu:      sync.Mutex{},
		storage: make(map[string]string),
	}
}

func (pbin *Bin) Store(value string) string {
	pbin.mu.Lock()
	defer pbin.mu.Unlock()

	key := generateKey()
	for pbin.storage[key] != "" {
		key = generateKey()
	}

	pbin.storage[key] = value
	return key
}

func (pbin *Bin) Retrieve(key string) (val string, err error) {
	pbin.mu.Lock()
	defer pbin.mu.Unlock()

	if value, found := pbin.storage[key]; !found {
		err = fmt.Errorf("key %v does not exist", key)
	} else {
		delete(pbin.storage, key)
		val = value
	}
	return
}

func generateKey() string {
	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	// initialize random number generator
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, 8)
	for i := range b {
		b[i] = charset[r.Intn(len(charset))]
	}

	log.StandardLogger().Info(fmt.Sprintf("generated key %v", string(b)))
	return string(b)
}
