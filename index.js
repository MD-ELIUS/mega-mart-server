const express = require('express') ;
const cors = require('cors') ;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config() ;
const app = express() ;
const port = process.env.PORT || 5202 ;

// middleware
app.use(cors()) ;
app.use(express.json()) ;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vm94rma.mongodb.net/?appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.get('/', (req, res) => {
    res.send('Smart server is running')
}) ;


async function run () {
     try {
    // await client.connect() ; 
    const db = client.db('mega_db') ;
    const productsCollection = db.collection('products') ;

       app.get('/products', async (req, res) => {
         const email = req.query.email ;
          const query = {} ;
          if(email){
            query.email  = email
          }
          const cursor = productsCollection.find(query).sort({date_added: -1})
          const result = await cursor.toArray() ;
          res.send(result) ;
    }) ;

     app.get('/latest-products', async (req, res) => {
        const cursor = productsCollection.find().sort({date_added: -1}).limit(6) ;
        const result = await cursor.toArray() ;
        res.send(result)
    })

    app.get('/products/:slug', async (req, res) => {
        const slug = req.params.slug;
        
        // Find the product where the 'slug' field matches the URL parameter
        const product = await productsCollection.findOne({ slug: slug });

        if (product) {
            res.send(product);
        } else {
            // Send a 404 response if the product is not found
            res.status(404).send({ message: "Product not found" });
        }
    });

      app.post('/products', async (req, res) => {
        const newProduct = req.body ;
        console.log(newProduct)
        const result = await productsCollection.insertOne(newProduct) ;
        console.log(result)
        res.send(result)
    }) ;

    

       app.delete('/products/:id', async (req, res) => {
        const id = req.params.id ;
        const query = {_id: new ObjectId(id) } 
        const result = await productsCollection.deleteOne(query) ;
        res.send(result)
    })

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
     }
     finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Smart server is running on port ${port}`)
}) ;


// mongodb user 
// user name : megadbUser 
// pass: DcVgPKResoqwrtN4 