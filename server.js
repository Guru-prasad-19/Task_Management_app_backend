const cors = require("cors");

const http = require("http");
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://Username:password@cluster0.nxyuauj.mongodb.net/test?retryWrites=true&w=majority",
  {
    writeConcern: {
      w: "majority",
      wtimeout: 0,
    },
  }
);

const Schema = mongoose.Schema;
const task = new Schema({
  title:String,
  description:String,
  duedate:String,
});
const Task = mongoose.model("Task", task);

const server = http.createServer((req, res) => {
  cors()(req, res, () => {
    if (req.method === "GET" && req.url === "/getTask") {
      const fetchD = async () => {
        try {
          const data =await Task.find();
          if (data) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ data }));
          }
        } catch (error) {
          console.error(error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "An error occurred" }));
        }
      };
    
      fetchD();
    } else if (req.method === "POST" && req.url === "/data") {
      let data = "";

      req.on("data", (chunk) => {
        data += chunk;
      });

      req.on("end", () => {
        const taskDetails = JSON.parse(data);
        console.log(taskDetails);
        const itemData = {
          title: taskDetails.title,
          description: taskDetails.description,
          duedate: taskDetails.duedate,
        };
        const type = new Task(itemData);

        type.save();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Successfully Added" }));
      });
    }else if (req.method === "POST" && req.url === "/update") {
      let data = "";

      req.on("data", (chunk) => {
        data += chunk;
      });

      req.on("end", () => {
        const taskDetails = JSON.parse(data);
        const itemData = {
          title: taskDetails.title,
          description: taskDetails.description,
          duedate: taskDetails.duedate,
        };
        console.log(itemData);
        const fetchD = async () => {
          try{
          const deta = await Task.findOne({
            title: taskDetails.title,
          });
          const result = await Task.findByIdAndUpdate(deta._id, itemData);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Successfully Updated" }));
          }catch(err){
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Task not found" }));
          }
        };
        fetchD();
      });
    }else if (req.method === "POST" && req.url === "/delete") {
      let data = "";

      req.on("data", (chunk) => {
        data += chunk;
      });

      req.on("end", () => {
         const taskDetails = JSON.parse(data);
        const itemData = {
          title: taskDetails.title,
          description: taskDetails.description,
          duedate: taskDetails.duedate,
        };
        const fetchD = async () => {
          const deta = await Task.findOne({
            title:itemData.title
          });
          const result = await Task.findByIdAndDelete(deta._id);
          if (!result) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Item not found" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Successfully Deleted" }));
          }
        };
        fetchD();
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Server Not Found!!!" }));
    }
  });
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});