# Ecofine

### App made using NodeJS w/express.js

## Website deployed on heroku
### https://tranquil-ocean-96622.herokuapp.com

## Running locally:

1. Clone repository and launch docker

   ```
        git clone
        cd ecofine
   ```

2. Fill environment variables in [docker-compose](./docker-compose.yml) file with your own details
   ```
       DATABASE_URL=
       GMAIL_EMAIL=
       GMAIL_PASS=
       FIREBASE_PROJECT_ID=
       FIREBASE_PRIVATE_KEY_ID=
       FIREBASE_PRIVATE_KEY=
       FIREBASE_CLIENT_EMAIL=
       FIREBASE_CLIENT_ID=
       FIREBASE_CLIENT_URL=
   ```

3. Launch docker in ecofine folder and start application
   ```
    docker-compose up --build
   ```
