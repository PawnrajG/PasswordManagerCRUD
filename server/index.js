const express = require("express");  //importing express module to express variable
const app = express(); //create an instance of express module and assigning to app
const credentials = require("./sample.json");
const fs = require("fs"); // it is filesystem library in node.js to handling files
const cors = require("cors");
const port = 8000;



//middlewares
app.use(cors({
    origin:"https://passwordmanagercrud.onrender.com",
    methods:["GET","POST","PATCH","DELETE"],
})
);
app.use(express.json());

// Serve static files from the client/dist directory
// app.use(express.static(path.join(__dirname, '../client/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist/index.html'));
// });

//creating route to store the user data
app.post("/credentials", (request,response)=>{
    //return response.json(request.body);
    const id  = Date.now();
    let {concern,password} = request.body;
    if(!concern || !password){
        return response.json({ "message": "Please fill all the fields!"});
    }else{
        credentials.push({id,concern,password});
        fs.writeFile("sample.json", JSON.stringify(credentials), (error, data)=>{
            return response.json({"message": "Your data is added successfully!"});
        });
    }
    
});

//update user data
app.patch("/credentials/:id", (request,response)=>{
    let Reqid = Number(request.params.id);
    let {id,concern,password} = request.body;
    if(!concern || !password){
        return response.json({ "message": "Please check all fields are filled!"});
    }else{
        let index = credentials.findIndex((data)=> data.id === Reqid);
        credentials.splice(index,1,{...request.body}); //its starts from index and remove one object and add request body at the index
        fs.writeFile("sample.json", JSON.stringify(credentials), (error, data)=>{
            return response.json({"message": "Your data is updated successfully!"});
            // return response.json(credentials); 
        });
    }
    
});


// creating a route to display credential details
app.get("/credentials", (request, response)=>{
    return response.json(credentials);
});

// creating a route to delete the required details in json
app.delete("/credentials/:id", (request, response)=>{
    let id = Number(request.params.id); // get details id using req.params.id and converting to number
    let remainDetails = credentials.filter((data)=>Number(data.id) !== id); // filtering the data in json file with given id
    //writing the remaining details in the json file using fs library of node.js
    fs.writeFile("sample.json", JSON.stringify(remainDetails), (error, data)=>{
        return response.json(remainDetails);
    });
});

// listen method will establish connection and listens for requests on specified port
app.listen(port,(error)=>{
    console.log(`App is running in ${port}`);
});