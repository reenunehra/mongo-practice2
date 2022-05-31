const userModels = require("../modules/users");
const userTodoModels = require("../modules/todoTask");
const async = require("async");



// --------------------------------------post data into database --------------------------------------------
// ---------------------api/v1/adduser/ - add user but don't allow duplicate email--------------------------------------------------


function addUsersData(req, res) {
  
console.log("req.body",req.body)
console.log("req.params",req.params)
console.log("req.query",req.query)
console.log("hello");


  async.waterfall([
    function (callback) {
      
      userModels.find({email:req.body.email},(error, document)=>{

        if(error){
          console.log("error", error);
        }
        else{
        console.log("already stored ",document);
        }
        
        if(document.length === 0){
          
          const usersDataObject = {
            username: req.body.username,
            email: req.body.email,
            contact: req.body.contact,
            status: req.body.status,
            password: req.body.password            
          };
    
          const usersData = new userModels(usersDataObject);
    
          usersData.save().then(() => {
              callback(null, usersData);
            }).catch((err) => {
                console.log("err",err)
              callback(true);
            });
        }
        else{
          console.log("duplicate email");
          callback(true,[],[]);
        }
      });
    },

    function(usersData, callback){
        const usersTodoObject ={
            userId:usersData._id,
            pincode:req.body.pincode,
            task:[{
                
                description:req.body.task[0].description,
                status:req.body.task[0].status,
                
            }],           
        };

        const usersTodoData = new userTodoModels(usersTodoObject)

        usersTodoData.save().then(()=>{
            callback(null,usersData,usersTodoData);
        }).catch((err)=>{
            console.log("err",err)
            callback(true);
        });
    }
  ],
  (err, usersData, usersTodoData)=>{
      if(err){
        res.status(400).json({sucess:false, err: err});
      }
      else{
          const data ={
            usersData:usersData, 
            usersTodoData:usersTodoData
          }
        res.status(200).json({sucess:true, data:data});
      }
    }
  );
}

// -------------------------------------------get data---------------------------------------------------

function getUsersData(req,res){
  console.log("UsersID And Status");
  console.log("req.params", req.params);   
  console.log("req.body", req.body); 
  console.log("req.query", req.query); 

  async.waterfall(
  [
      function (callback){
        userModels.find({},(err, usersData)=>{
          if(err){
            console.log(err);
            callback(true, usersData)
          }
            callback(null, usersData)
        });
      },    
    function (usersData, callback) {
      userTodoModels.find({}, (err, usersTodoData) => {
        if (err) {
          callback(true, usersTodoData);
        }

        callback(null, usersData, usersTodoData);
      });
    },
  ],

  (err, usersData, usersTodoData) => {
    if (err) {     
      res.status(400).json({ success: false, err: err });
    } else { 
      let data = {
        address: usersTodoData,
        Users: usersData,
      };
      res.status(200).json({ success: true, data: data });
    }
  }
);
}


// --------------------------------------get data ------------api/v1/user?id=<userID>?status=<Active> -----------------------
function getUserID(req, res){
  console.log("UsersID And Status");
  console.log("req.params", req.params);   
  console.log("req.body", req.body); 
  console.log("req.query", req.query); 

  async.waterfall([
    function(callback){

      userModels.find({_id:req.query.id , status: true},(err, idAndStatus)=>{
        if(err){
          console.log(err);
          callback(true);
        }
        else{
          console.log(" user idAndStatus data",idAndStatus)
          callback(null, idAndStatus);
        }        
      })
    },

    function(idAndStatus, callback){
      userTodoModels.find({userId: req.query.id},(err, usersTodoData)=>{
        if(err){
          console.log(err);
          callback(true);
        }
        else{          
          console.log(" user Todo data",usersTodoData)
          callback(null, idAndStatus, usersTodoData)
        }
      })
    }
  ],
  (err, idAndStatus, usersTodoData)=>{
    if(err){
      res.status(400).json({success:false, err:err});
    }
    else{
      let data = {
        idStatus: idAndStatus,
        TodoData: usersTodoData
      };
      res.status(200).json({sucess:true, data: data});
    }
  }
  );
}

// --------------------------------------get data ------------api/v1/gettasklist?id - get task by user ID-----------------------
function getTaskList(req, res){
  console.log("UsersID And Status");
  console.log("req.params", req.params);   
  console.log("req.body", req.body); 
  console.log("req.query", req.query); 

 
  async.waterfall([  
    function(callback){

      userTodoModels.find({userId: req.query.id},{task:1},(err, usersTodoData)=>{

        if(err){
          console.log(err);
          callback(true);
        }
        else{          
          console.log(" user Todo data",usersTodoData)
          callback(null, usersTodoData)
        }
      })
    }
  ],

  (err, usersTodoData)=>{
      if(err){
        res.status(400).json({success:false, err:err});
      }
      else{
       let data = {        
          TodoData: usersTodoData
        };
        res.status(200).json({sucess:true, data: data});
        }
    }
  );
}

//--------api/v1/gettasklist?id=<userID>?status=<Taskstatus>- get task by user ID and task status in order of task created date

function getTaskListStatus(req, res){
  console.log("getTaskListStatus");
  console.log("req.params", req.params);   
  console.log("req.body", req.body); 
  console.log("req.query", req.query); 

 
  async.waterfall([  
    function(callback){

      userTodoModels.find({userId: req.query.id},{"task.status": false}).exec(function(err, usersTodoData) {
        if(err){
          console.log(err);
          callback(true);
        }
        else{
          console.log(" before sorting",usersTodoData[0].task)
          usersTodoData[0].task.sort(function shortByDateCreated(a, b){
            if(a.taskcreatedDate < b.taskcreatedDate)
            {
              return -1      
            }
            if(a.taskcreatedDate > b.taskcreatedDate)
            {
              return 1
            }
            return 0 
          })
          console.log("after sorting",usersTodoData[0].task);
                 
          callback(null, usersTodoData)
        }
      })
    }
  ],
    (err, usersTodoData)=>{
        if(err){
          res.status(400).json({success:false, err:err});
        }
        else
        {
            let data = {        
            TodoData: usersTodoData
            };
          res.status(200).json({sucess:true, data: data});
        }
    }
  );
}


//--------findOneAndUpdate------- PUT API-----------// api/v1/updateuser/:<id> - updateUser------------------------

function updateUsersData(req, res) {  
  console.log("req.params", req.params);

    async.waterfall([
      function (callback) {
        
        userModels.findOneAndUpdate({_id: req.params.id}, {username: "Harshit Nehra"},(err, findData)=>{       
  
          if(err){
            console.log(err);
            callback(true); 
          }else{
            console.log("finddata",findData)
            callback(null, findData)
          }
        })
      },       
    ],
    (err, findData) => {
      console.log("updated name",findData)
        if (err) {
          res.status(400).json({ success: false, err: err });
        } else {
          let data = {
            Users: findData          
            };
          res.status(200).json({ success: true, data: data });
        }
    }  
  );
} 

//--------findOneAndUpdate------- PUT API-----------/api/v1/updatetask/:<userID> - Update user task -----------------------

  function updateTask(req, res) {  
    console.log("req.params", req.params);
  
      async.waterfall([    
        function (callback) {    
          
          userTodoModels.findOneAndUpdate({userID: req.params.id}, {$set:{"task.[0].status" : false}}, (err, findTodoData)=>{       
    
            if(err){
              console.log(err);
              callback(true);
            }else{
              console.log("findTodoData",findTodoData)
              callback(null,findTodoData)
            }
          })
        }
      ],
      (err, findTodoData) => {
          if (err) {
            res.status(400).json({ success: false, err: err });
          } else {
            let data = {            
              TodoData: findTodoData
            };
          res.status(200).json({ success: true, data: data });
          }
      }  
    );
} 


//--------findOneAndUpdate------- Patch API-----------/api/v1/updateuser/:<id> - modifyUser------------------------

function modifyUsersData(req, res) {  
  console.log("req.params", req.params);

    async.waterfall([
      function (callback) {
        
        userModels.findOneAndUpdate({_id: req.params.id}, {username: "Aayan Ket"},(err, findData)=>{       
  
          if(err){
            console.log(err);
            callback(true); 
          }else{
            console.log("finddata",findData)
            callback(null, findData)
          }
        })
      },
       
    ],
    (err, findData) => {
      console.log("updated name",findData)
      if (err) {
        res.status(400).json({ success: false, err: err });
      } else {
        let data = {
          Users: findData          
        };
        res.status(200).json({ success: true, data: data });
      }
    }  
    );
  } 


  //--------findOneAndUpdate------- PATCH API-----------/api/v1/updatetask/:<userID> - Update user task -----------------------

  function modifyTodoTask(req, res) {  
    console.log("req.params", req.params);
  
      async.waterfall([        
    
        function (callback) {     
          
          userTodoModels.findOneAndUpdate({userID: req.params.id}, {$push:{"task.status" : true}}, (err, modifyTodosTask)=>{       
    
            if(err){
              console.log(err);
              callback(true);
            }else{
              console.log("modifyTodoData",modifyTodosTask)
              callback(null,modifyTodosTask)
            }
          })
        }
      ],
      (err, modifyTodosTask) => {
        if (err) {
          res.status(400).json({ success: false, err: err });
        } else {
          let data = {            
            modifyTodoTask: modifyTodosTask
          };
          res.status(200).json({ success: true, data: data });
        }
      }  
      );
    } 
  

//---------------------------------api/v1/deleteUser/:<id>  - delete the user and task---------------------------------

// ----------------------------------------------DeleteData----------------------------------------------------

function removeUsersData(req, res) {  
    console.log("req.params", req.params);
  
    async.waterfall([
      function (callback) {
        
        userModels.findOneAndDelete({_id: req.params.id},{$set:{status: true}},(err, removeData)=>{       
  
          if(err){
            console.log(err);
            callback(true);     
          }else{
            console.log("removedata",removeData)
            callback(null, removeData)
          }
        })
      },
  
      function (removeData, callback) {       
  
        
        userTodoModels.findOneAndDelete({userID: req.params.id},{$set:{pincode : 343434}},(err, deleteTodosTask)=>{       
  
          if(err){
            console.log(err);
            callback(true);
          }else{
            console.log("deleteTodosTask",deleteTodosTask)
            callback(null,removeData,deleteTodosTask)
          }
        })
      }
    ],
    (err, removeData, deleteTodosTask) => {
      if (err) {
        res.status(400).json({ success: false, err: err });
      } else {
        let data = {
          Users: removeData,
          modifyTodoTask: deleteTodosTask
        };
        res.status(200).json({ success: true, data: data });
      }
    }  
    );
  }    


module.exports = {
  getUsersData,
  getUserID,
  getTaskList,
  getTaskListStatus,

  addUsersData,

  updateUsersData,
  updateTask,

  modifyUsersData,
  modifyTodoTask,

  removeUsersData,
};
