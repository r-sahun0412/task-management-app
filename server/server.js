var express = require("express");
var cors = require("cors");
var mongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
const app = express();
const path = require ("path");
app.use(express.static(path.join(__dirname + "/public")));
const PORT = process.env.PORT || 2700

var constr = "mongodb://127.0.0.1:27017";


app.use(cors());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

// ===========>Routes<============================

// For All Task
app.get("/task", (req, res) => {
    mongoClient.connect(constr).then((clientObj) => {
        var db = clientObj.db("task");
        db.collection("task").find({}).toArray().then(documents => {
            console.log(documents);
            res.send(documents); // Sending the response after the data has been fetched
        }).catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }).finally(() => {
            clientObj.close(); // Close the MongoDB connection
        });
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
})

// For Add Task
app.post("/addtask", (req, res) => {
    var task = {
        TaskName: req.body.TaskName,
        TaskDescription: req.body.TaskDescription
    };

    var clientObj; // Declare the clientObj variable

    mongoClient.connect(constr)
        .then(client => {
            clientObj = client; // Assign the client to the variable
            var db = client.db("task");
            return db.collection("task").insertOne(task);
        })
        .then(() => {
            console.log(`Task Added Successfully.`);
            res.end();
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        })
        .finally(() => {
            if (clientObj) {
                clientObj.close(); // Close the MongoDB connection
            }
        });
});




// For Updating Task
app.put("/updatetask/:id", (req, res) => {
    var taskIdToUpdate = req.params.id; // Get the task ID from the URL parameter
    var updatedTask = {
        TaskName: req.body.TaskName,
        TaskDescription: req.body.TaskDescription
    };

    mongoClient.connect(constr).then(client => {
        var db = client.db("task");
        db.collection("task").updateOne(
            { _id: new ObjectId(taskIdToUpdate) }, // Wrap taskIdToUpdate in ObjectId
            { $set: updatedTask }
        ).then(() => {
            console.log("Task Updated Successfully");
            res.end();
        }).catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }).finally(() => {
            client.close();
        });
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});




// For Deleting Task


app.delete("/deletetask/:id", async (req, res) => {
    const taskIdToDelete = req.params.id;
    
    try {
        const client = await mongoClient.connect(constr);
        const db = client.db("task");
        
        const result = await db.collection("task").deleteOne({ _id: new ObjectId(taskIdToDelete) });
        
        if (result.deletedCount === 1) {
            console.log("Task Deleted");
            res.send("Task deleted successfully");
        } else {
            console.log("Task not found");
            res.status(404).send("Task not found");
        }
        
        client.close(); // Close the MongoDB connection
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Internal Server Error: " + error.message);
    }
});
// completed Task
// Mark task as completed
app.put("/markcompleted/:id", async (req, res) => {
    const taskIdToUpdate = req.params.id;
  
    try {
      const client = await mongoClient.connect(constr);
      const db = client.db("task");
  
      await db.collection("task").updateOne(
        { _id: new ObjectId(taskIdToUpdate) },
        { $set: { completed: true } }
      );
  
      console.log("Task Marked as Completed");
      res.send("Task marked as completed");
  
      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error: " + error.message);
    }
  });
  
  // Mark task as incomplete
  app.put("/markincomplete/:id", async (req, res) => {
    const taskIdToUpdate = req.params.id;
  
    try {
      const client = await mongoClient.connect(constr);
      const db = client.db("task");
  
      await db.collection("task").updateOne(
        { _id: new ObjectId(taskIdToUpdate) },
        { $set: { completed: false } }
      );
  
      console.log("Task Marked as Incomplete");
      res.send("Task marked as incomplete");
  
      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error: " + error.message);
    }
  });
  
//   server
// For fetching tasks by completion status
app.get("/task/:status", (req, res) => {
    const status = req.params.status; // Get the status from the URL parameter
    
    const query = status === "completed" ? { completed: true } : status === "pending" ? { completed: false } : {};
    
    mongoClient.connect(constr).then((clientObj) => {
        var db = clientObj.db("task");
        db.collection("task").find(query).toArray().then(documents => {
            console.log(documents);
            res.send(documents); // Sending the response after the data has been fetched
        }).catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }).finally(() => {
            clientObj.close(); // Close the MongoDB connection
        });
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

// register user
app.post("/registeruser", (req, res)=>{

    var user = {
        UserId: req.body.UserId,
        UserName: req.body.UserName,
        Password: req.body.Password,
        Email: req.body.Email,
        Mobile: req.body.Mobile
    };

    mongoClient.connect(constr).then(clientObj=>{
         var database = clientObj.db("task");
         database.collection("users").insertOne(user).then(()=>{
             console.log(`User Inserted`);
             res.redirect("/users");
             res.end();
         })
    })
});

// users

app.get("/users", (req, res)=>{
    mongoClient.connect(constr).then((clientObj)=>{
        var database = clientObj.db("task");
        database.collection("users").find({}).toArray().then(documents=>{
            res.send(documents);
            res.end();
        })
    })
});

// ===============>Port<==================

app.listen(PORT);
console.log(`Server Started : http://127.0.0.1:2700`);
