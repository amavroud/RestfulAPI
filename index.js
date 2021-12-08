const express = require('express');
const joblist = require('./jobs.json'); // the data we downloaded

const app = express();
app.use(express.json());

// app has no landing page, must use urls to view respective aspects of api

//RESTful API
app.get('/listings', (req, res) => {
    res.json(joblist);
})

//display all the categories in and their respective counts
app.get('/categories', (req, res) => {
    const categories = new Map();
    for (const j in joblist){
        for(const c in joblist[j]['categories']){
            if(categories.has(joblist[j]['categories'][c])){
                let count = categories.get(joblist[j]['categories'][c]);
                categories.set(joblist[j]['categories'][c], ++count); // add to count for category we've seen
            } else {
                categories.set(joblist[j]['categories'][c], 1); // new category count is 1
            }
        }
    }
    res.send({Categories: [...categories]});
});

// take category as a paramater and compile an array of the job listings that contain that category
app.get('/jobCategory/:category', (req, res) => {
    let matchedJob = []; // array of jobs that match
    for (const j in joblist){
        for(const c in joblist[j]['categories']){
            if(joblist[j]['categories'][c] == req.params.category){ // that index we've outlined match?
                matchedJob.push(joblist[j]['title']);
                break;
            }
        }
    }
    res.send(matchedJob);
});  


//query ?city=  in url to find listings of that city
app.get('/jobsInCity', (req, res) => {
    let matchedJob = []; // array we store jobs that match
    for (const j in joblist){
        const title = joblist[j]['title']
        const matched = (new RegExp(req.query.city)).test(title)
        if(matched){
            matchedJob.push(joblist[j]['title']);//push name of listing we matched to city above
        }
    }
    res.send(matchedJob); 
})

 app.listen(2000);