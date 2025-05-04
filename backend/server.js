const https = require("https");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");  // Import our config
const gamesRoute = require('./routes/games');
const ratingRoutes = require("./routes/rating");
const userRoutes = require('./routes/users');
//const Game = require("./models/Game");
//const User = require("./models/User");

const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

// CORS configuration - updated to handle multiple environments
const allowedOrigins = [
  'https://lyra-games-1.onrender.com',
  'https://lyra-games.onrender.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Add any other origins you need to allow
];

// Use the cors middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log(`CORS blocked for origin: ${origin}`);
      // For debugging only - allow all origins in development
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      return callback(null, true); // Temporarily allow all origins while debugging
      // Uncomment below to enforce strict CORS in production
      // return callback(new Error('CORS policy violation'), false);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Also keep the manual CORS headers as fallback
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.get('/', (req, res) => {
  res.send('Server Çalışıyor!');
});

app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/games', gamesRoute);

app.use("/api/rate", ratingRoutes);

// MongoDB bağlantısı
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('BludyClud Server Başarıyla Çalışıyor!');
}); 

// Remove duplicate route
// app.use("/api/games", gamesRoute);

// Start the server based on environment
if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
  // For production (like Render), use the default HTTP server
  const PORT = process.env.PORT || config.port || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on HTTP port ${PORT} (production mode)`);
  });
} else {
  // For local development, use HTTPS with certificates
  try {
    const httpsOptions = {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    };
    
    https.createServer(httpsOptions, app).listen(config.port, () => {
      console.log(`Server running on https://localhost:${config.port} (development mode)`);
    });
  } catch (error) {
    console.error("Cannot read SSL certificates, falling back to HTTP:", error.message);
    
    // Fallback to HTTP if certificates can't be loaded
    const PORT = process.env.PORT || config.port || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on HTTP port ${PORT} (fallback mode)`);
    });
  }
}

