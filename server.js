require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { AmazonPaapi } = require('amazon-paapi');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const commonParameters = {
  AccessKey: process.env.AMAZON_ACCESS_KEY,
  SecretKey: process.env.AMAZON_SECRET_KEY,
  PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.com'
};

app.post('/api/search', async (req, res) => {
  try {
    const { keywords } = req.body;
    
    const requestParameters = {
      Keywords: keywords,
      SearchIndex: 'All',
      ItemCount: 10,
      Resources: [
        'Images.Primary.Medium',
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'Offers.Listings.SavingBasis',
        'Offers.Listings.Condition'
      ]
    };

    const response = await AmazonPaapi.SearchItems(commonParameters, requestParameters);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});