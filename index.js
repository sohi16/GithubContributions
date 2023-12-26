const path=require('path');
const axios = require('axios');
const express = require('express');
const app = express();


app.use(express.static(path.join(__dirname, 'public')))
app.get('/contributions/:username', async (req, res) => {
    try {
      const username = req.params.username;
      const response = await axios.get(`https://api.github.com/users/${username}/events/public`);
  
      if (response.status === 200) {
        const events = response.data.filter(event => event.type === 'PushEvent');
        const contributions = {};
  
        events.forEach(event => {
          const date = event.created_at.substring(0, 10);
  
          if (contributions[date]) {
            contributions[date]++;
          } else {
            contributions[date] = 1;
          }
        });
  
        res.json(contributions); 
      } else {
        res.status(500).send('Error retrieving data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    }
  });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
