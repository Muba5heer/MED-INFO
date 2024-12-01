const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Example route to fetch drug information
app.get('/api/drugs', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`https://api.fda.gov/drug/label.json?search=openfda.generic_name:${query}`);
    if (response.data.results && response.data.results.length > 0) {
      const drugData = response.data.results[0];
      const drugInfo = {
        brandName: drugData.openfda.brand_name ? drugData.openfda.brand_name[0] : 'N/A',
        genericName: drugData.openfda.generic_name ? drugData.openfda.generic_name[0] : 'N/A',
        drugClass: drugData.openfda.pharm_class_epc ? drugData.openfda.pharm_class_epc[0] : 'N/A',
        dosageForms: drugData.dosage_and_administration || 'N/A',
        uses: drugData.indications_and_usage || 'N/A',
        sideEffects: drugData.adverse_reactions || 'N/A',
        pharmacology: drugData.clinical_pharmacology || 'N/A',
      };
      res.json(drugInfo);
    } else {
      res.status(404).json({ message: 'Drug not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching drug information' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
