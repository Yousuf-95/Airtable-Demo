require('dotenv').config();
const express = require('express');
const Airtable = require('airtable');
const bodyParser = require('body-parser');

const apiKey = process.env.API_KEY;
var base = new Airtable({apiKey: apiKey}).base('app1qPwyes1jpgpmf');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Get records route

app.get('/get-records', (req,res) => {
    const result = [];
    base('Projects').select({
        view: 'Grid view'
    })
    .firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        else{
            records.forEach((record,id) =>  {
                console.log(record);
                const myObject = Object.assign({}, {
                    id: record.id,
                    fields: record.fields
                });
                result.push(myObject);
            });
            return res.send(result);
        }
    });
});

//Update records route

app.post('/update', (req,res) => {

    const {recordId, Name, Deadline} = req.body;

    base('Projects').update([
        {
          "id": recordId,
          "fields": {
            Name,
            Deadline
          }
        }
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function(record) {
          console.log(record.get('Name'));
        });
      });

      return res.json({message: 'Update successful'});
});

//Create records route

app.post('/create', (req,res) => {

    const {Name,Deadline} = req.body;

    base('Projects').create([
        {
          "fields": {
            Name,
            Deadline
          }
        }
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        return res.json({recordId: records[0].getId()});
      });
});

//Delete records route

app.post('/delete', (req,res) => {

    const {recordId} = req.body;

    base('Projects').destroy([recordId],
        function(err, deletedRecords) {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Deleted', deletedRecords.length, 'records');
        return res.json({message: 'record successfully deleted'});
    });
});


app.listen(3001, () => console.log('Server listening on port ' + 3001));