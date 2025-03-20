import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { weather: null });
});

app.post("/", async (req, res) => {
  const city = req.body.city;
  const apiKey = process.env.API_KEY;

  if (!city) {
    return res.render("index", { weather: null });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);

    const weatherData = response.data;
    const weather = {
      city: weatherData.name,
      temp: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon
    };

    res.render("index", { weather });
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    res.render("index", { weather: null });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
