require('dotenv').config();
const express = require('express');
const Airtable = require('airtable');

const app = express();

const apiKey = process.env.API_KEY;

var base = new Airtable({apiKey: apiKey}).base('app1qPwyes1jpgpmf');

app.get('/', (req,res) => {
    const result = {};

    base('Projects').select({
        view: 'Grid view'
    })
    .firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        else{
            records.forEach((record,id) =>  {
                let name = record.get('Name');
                result[id] = name;
            });

            return res.json({message: result});
        }
    });
})

//Update records code sample

// base('Projects').update([
//     {
//       "id": "recAECwr2OCqEbLVb",
//       "fields": {
//         "Name": "Yearly launch",
//         "Deadline": "2022-04-23"
//       }
//     }
//   ], function(err, records) {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     records.forEach(function(record) {
//       console.log(record.get('Name'));
//     });
//   });


app.listen(3000, () => console.log('Server listening on port ' + 3000));