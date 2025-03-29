package paste

import (
	"reflect"
	"testing"
)

func Test_Store(t *testing.T) {
	pastebin := InitBin()
	key := pastebin.Store("some_value")
	if pastebin.storage[key].Value != "some_value" {
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

func Test_RetrieveAll(t *testing.T) {
	pastebin := InitBin()
	key1 := pastebin.Store("val1")
	key2 := pastebin.Store("val2")

	pasteData := pastebin.RetrieveAll()
	var emptyData PasteCollection
	if reflect.DeepEqual(pasteData, emptyData) {
		t.Errorf("unexpected empty pasteData while retrieving all")
	}

	for _, paste := range pasteData.Data {
		if paste.Key != key1 && paste.Key != key2 {
			t.Errorf("unexpected paste from pasteData while retrieving all")
		}
	}
}
