import numpy as np
import tensorflow as tf
import cv2 
import os

trainPath = 'Train-DATA/FER-2013-Faces/train'
testPath = 'Train-DATA/FER-2013-Faces/test'

folderList = os.listdir(trainPath)
folderList.sort()

X_train = []
y_train = []

X_test = []
y_test = []

#Loading DATA to array
for i , category in enumerate(folderList):
    files = os.listdir(trainPath+'/'+category)
    for file in files:
        img = cv2.imread(trainPath+'/'+category+'/{0}'.format(file),0)
        X_train.append(img)
        y_train.append(i)

#Loading DATA to array (TEST DATA)
for i , category in enumerate(folderList):
    files = os.listdir(testPath+'/'+category)
    for file in files:
        img = cv2.imread(testPath+'/'+category+'/{0}'.format(file),0)
        X_test.append(img)
        y_test.append(i)

# Convert the data to numpy
X_train = np.array(X_train, 'float32')
y_train = np.array(y_train, 'float32')
X_test = np.array(X_test, 'float32')
y_test = np.array(y_test, 'float32')

X_train = X_train / 255.0
X_test = X_test / 255.0

numOfImages = X_train.shape[0]
X_train = X_train.reshape(numOfImages, 48, 48, 1)

numOfImages = X_test.shape[0]
X_test = X_test.reshape(numOfImages, 48, 48, 1)

# convert the lables to Category
from keras.api.utils import to_categorical
y_train = to_categorical(y_train, num_classes= 7)
y_test = to_categorical(y_test, num_classes= 7)

##################################################
# build the cnn model here
input_shape = X_train.shape[1:]
import keras
from keras.api.models import Sequential
from keras.api.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from keras.api.optimizers import Adam
import matplotlib.pyplot as plt
from keras.api.callbacks import EarlyStopping

model = Sequential()
model.add(Conv2D(input_shape=input_shape, filters=64, kernel_size=(3,3), padding='same', activation='relu'))
model.add(Conv2D( filters=64, kernel_size=(3,3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size=(2,2), strides=(2,2)))

model.add(Conv2D(filters=128, kernel_size=(3,3), padding='same', activation='relu'))
model.add(Conv2D(filters=128, kernel_size=(3,3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size=(2,2), strides=(2,2)))

model.add(Conv2D(filters=256, kernel_size=(3,3), padding='same', activation='relu'))
model.add(Conv2D(filters=256, kernel_size=(3,3), padding='same', activation='relu'))
model.add(Conv2D(filters=256, kernel_size=(3,3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size=(2,2), strides=(2,2)))

model.add(Conv2D(filters=512, kernel_size=(3,3), padding='same', activation='relu'))
model.add(Conv2D(filters=512, kernel_size=(3,3), padding='same', activation='relu'))
model.add(Conv2D(filters=512, kernel_size=(3,3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size=(2,2), strides=(2,2)))

model.add(Conv2D(filters=512, kernel_size=(3,3), padding='same', activation='relu'))
model.add(Conv2D(filters=512, kernel_size=(3,3), padding='same', activation='relu'))
model.add(Conv2D(filters=512, kernel_size=(3,3), padding='same', activation='relu'))
model.add(MaxPooling2D(pool_size=(2,2), strides=(2,2)))

model.add(Flatten())
model.add(Dense(4096, activation='relu'))
model.add(Dropout(0.5))

model.add(Dense(4096, activation='relu'))
model.add(Dense(7, activation='softmax'))

print(model.summary())

# compailing and training phase
model.compile(optimizer=Adam(learning_rate=0.0001), loss='categorical_crossentropy', metrics=['accuracy'])
batch = 32
# failed at 25 overfitting 
epochs = 30

stepsPerEpoch = np.ceil(len(X_train)/batch)
validationSteps = np.ceil(len(X_test)/batch)


stopEarly = EarlyStopping(monitor='val_accuracy', patience=5)
#train
history = model.fit(X_train, y_train, batch_size=batch, epochs=epochs,
                    verbose=1, validation_data=(X_test, y_test),
                    shuffle=True, callbacks=[stopEarly])

acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']

epochs = range(len(acc))

plt.plot(epochs, acc ,'r', label="Train accuracy")
plt.plot(epochs, val_acc, 'b', label="Validation accuracy")
plt.xlabel( 'Epoch')
plt.ylabel( 'Accuracy')
plt.title("Trainig and validation Accuracy")
plt.legend(loc='lower right')
plt.show()
# show loss and validation loss chart
plt.plot(epochs, loss, 'r', label="Train loss")
plt.plot (epochs, val_loss, 'b', label="Validation loss") 
plt.xlabel('Epoch')
plt.ylabel( 'Loss')
plt.title("Trainig and validation Loss")
plt.legend (loc='upper right')
plt.show()
# saving the model
model.save('emotion_model_v3.keras')
