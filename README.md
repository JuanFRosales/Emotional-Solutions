# Emotional Solutions
## A Nokia Innovation Student Project

### Overview
This project focuses on developing a creative and interactive feedback system using facial emotion recognition technology. The system allows users to provide feedback in a non-verbal manner by capturing a picture and analyzing the emotions conveyed through facial expressions. The goal is to leverage AI-driven emotion analysis to improve user experience and interactions in various applications, including customer feedback, mental health support, and personalized content delivery.

### Tech Stack:
- **Python**: The core programming language for building the emotion recognition system.
- **OpenCV**: For image processing and capturing facial expressions.
- **Flask**: A lightweight web framework used to serve the application and handle requests.
- **Docker**: For containerizing the application and ensuring consistency across different environments.
- **Docker Compose**: To manage multi-container Docker applications and simplify deployment.
- **Python Virtual Environment (venv)**: To create isolated environments for managing dependencies.
- **Ubuntu Virtual Machine**: For setting up a development environment 


![image](/screenshots/Diagram.png)


### Screenshots


### Frontpage
![image](/screenshots/frontpage.png)

### Image capturing process
![image](/screenshots/process.png)

### Displaying Results

![image](/screenshots/results.png)

### Get Started:
To get started with the project, follow the steps below:

1. **Pull images from dockerhub:**

   ```bash
   docker pull juanfrosales/facialemotions-app:server
   docker pull juanfrosales/facialemotions-app:client
   docker pull juanfrosales/facialemotions-app:db
   

1.1 **Alternatively clone this repo**

   ```bash
   git clone https://github.com/JuanFRosales/Emotional-Solutions.git
   cd EmotionalSolutions
   cd ./Server
   docker compose -up --build
   ````
