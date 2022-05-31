const userTodoModels = require("../modules/todoTask");
const async = require("async");


// --------------------------------------api/v1/addtask/:<userID> - add task in todotask ---------------------------------------------------------------
function addToDoTask(req, res) {
  
console.log("req.body",req.body)
console.log("req.params",req.params)
console.log("req.query",req.query)
console.log("it works");

  async.waterfall([
    
    function(callback){
        const usersTodoObject ={
            userId:req.params.id,
            pincode:req.body.pincode,
            task:[{
               
                description:req.body.task[0].description,
                status:req.body.task[0].status,
                
            }],            
        };
        const usersTodoData = new userTodoModels(usersTodoObject)

        usersTodoData.save().then(()=>{
            callback(null,usersTodoData);
        }).catch((err)=>{
            console.log("err",err)
            callback(true);
        });
    }
  ],
  (err,usersTodoData)=>{
      if(err){
        res.status(400).json({sucess:false, err: err});
      }
      else{
          const data ={            
            usersTodoData:usersTodoData
          }
        res.status(200).json({sucess:true, data:data});
      }
  }
  );
}



module.exports = { 
  addToDoTask
};
