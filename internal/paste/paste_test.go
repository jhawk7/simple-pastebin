package paste

import (
	"testing"
)

func Test_Store(t *testing.T) {
	pastebin := InitBin()
	key := pastebin.Store("some_value")
	if pastebin.storage[key] != "some_value" {
		t.Errorf("unexpected value return from key")
	}
}

func Test_Retrieve_Success(t *testing.T) {
	pastebin := InitBin()
	key := pastebin.Store("some_value")
	val, keyErr := pastebin.Retrieve(key)
	if keyErr != nil {
		t.Errorf("unexpected error while retrieving value by key %v; [error: %v]", key, keyErr)
	}

	if val != "some_value" {
		t.Errorf("unexpected value returned, %v", val)
	}
}

func Test_Retrieve_Failure(t *testing.T) {
	pastebin := InitBin()
	pastebin.Store("some_value")
	val, keyErr := pastebin.Retrieve("some_unexpected_key")
	if keyErr == nil {
		t.Errorf("expected an error while retrieving value by unexpected_key, but none was returned")
	}

	if val != "" {
		t.Errorf("unexpected value returned during retrieval error, %v", val)
	}
}
