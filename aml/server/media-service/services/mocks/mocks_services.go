package mocks

import (

        "github.com/stretchr/testify/mock"
        "go.mongodb.org/mongo-driver/bson/primitive"
)

type MockServices struct {
        mock.Mock
}

func (m *MockServices) ReturnMedia(mediaID primitive.ObjectID) error {
        args := m.Called(mediaID)
        return args.Error(0)
}
