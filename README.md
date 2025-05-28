# 🌿 NatureSheild

---

## 📱 Frontend – React Native (Expo) (`/application`)

### Setup Instructions

1. **Navigate to the frontend folder:**

   ```bash
   cd Application
   npm install
   ```
2. **Install dependencies:**
   ```bash
   npm install   
   ```

3. **Create a .env file with the following:**

    ```bash
   EXPO_PUBLIC_BACKEND_IP=Your_Device_Ip
   EXPO_PUBLIC_BACKEND_PORT=3000
   ```
4. **Start Expo:**

```bash
   npx expo start
   ```

## Backend – Node.js + Express (/Server)
1. **Navigate to the backend folder:**

   ```bash
   cd Server
   ```
2. **Install dependencies:**
   ```bash
   npm install   
   ```
3. **Create a .env file with the following:**

    ```bash
   PORT=3000
   MONGODB_URL=Your_Mongodb_URL
   JWT_SECRET=Put_256Ch_Long_Secret_String
   PLANT_ID_API_KEY=Your_PLANT_ID_API_KEY
   ```
4. **Start Expo:**

```bash
   nodemon app
```


## 🔧 Technologies Used

- Frontend: React Native, Expo
- Backend: Node.js, Express, Multer, Cloudinary, JWT
- Database: MongoDB Atlas