// app.js
const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Schema   = mongoose.Schema;
const carSchema = new Schema({
    brand: String,
    model: String,
    year: {type: String},
    color: String
  
});

const Car = mongoose.model('Car', carSchema);

mongoose.connect('mongodb://localhost/car')
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended:true}))



app.get('/cars', function (req,res){
    Car.find()
    .then(cars => {
        let data = {};
        data.theList = cars;
        res.render('index',data)
    })
    .catch(theError => {console.log(theError)})
})

app.get('/cars/new', function (req,res){
    res.render('newCar')
})

app.post('/cars/create', function (req, res){
   const theActualBrand =  req.body.theBrand;
   const theActualModel = req.body.theModel;
   const theActualYear = req.body.theYear;
   const theActualColor = req.body.theColor;
    
   const newCar = new Car({
        brand: theActualBrand,
        model: theActualModel,
        year: theActualYear,
        color: theActualColor
    });

    newCar.save()
    .then(car => {
       console.log(car)
    })
    .catch(theError => {console.log(theError)})

    res.redirect('/cars')
})

app.post('/cars/delete/:id', function (req, res){
    const carId = req.params.id
    Car.findByIdAndRemove(carId)
    .then(car =>{
        console.log(car)
    })
    .catch(error => {
        console.log(error)
    })
    res.redirect('/cars')
})

app.get('/cars/edit/:id', function (req,res){
    Car.findById(req.params.id)
    .then(theCar =>{
        res.render('editCar',{car: theCar})
    })
   
})

app.post('/cars/update/:id', function (req, res){
    const id = req.params.id
    const theActualBrand =  req.body.brand;
    const theActualModel = req.body.model;
    const theActualYear = req.body.year;
    const theActualColor = req.body.color;
     
    Car.findByIdAndUpdate(id,{
        brand: theActualBrand,
        model: theActualModel,
        year: theActualYear,
        color: theActualColor
    })
     .then(car => {
        console.log(car)
     })
     .catch(theError => {console.log(theError)})
 
     res.redirect('/cars')
 })
app.listen(3000, () => console.log('Example app listening on port 3000!'))