
const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/odisha-camp')

const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",()=>{
    console.log("Connected to MongoDB");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author:'64ddd8bb41caef22f0069c0e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus ipsum nihil doloribus iste praesentium corrupti asperiores ipsam fuga, sunt dolor nemo eaque incidunt magni tenetur, vero nesciunt vitae nisi voluptates!',
            price: 89,
            images:
            [
                {
                  url: 'https://res.cloudinary.com/dyet901cw/image/upload/v1693384241/Odisha_Yelp/coaum6cqxvzbvwc4b7qt.png',
                  filename: 'Odisha_Yelp/ki3wwgolk7fm9ulktj3u',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dyet901cw/image/upload/v1693308074/Odisha_Yelp/x4cillufj3judossebq7.png',
                  filename: 'Odisha_Yelp/wvqjpq5uujqzdfc2aplx',
                  
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})