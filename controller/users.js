const userModels = require("../modules/users");
const userTodoModels = require("../modules/todoTask");
const {v4 : uuidv4} = require('uuid')
const async = require("async");

function addUsersData(req, res) {
console.log("req.body",req.body)
console.log("req.params",req.params)
console.log("req.query",req.query)

    console.log("hello");
  async.waterfall([
    function (callback) {
      const usersDataObject = {
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
        status: req.body.status,
        password: req.body.password,
        // dateCreated: req.body.dateCreated,-------------------------set as default in model
        // DateModified: req.body.DateModified,-------------------------set as default in model
      };

      const usersData = new userModels(usersDataObject);

      usersData.save().then(() => {
          callback(null, usersData);
        }).catch((err) => {
            console.log("err",err)
          callback(true);
        });
    },
    function(usersData, callback){
        const usersTodoObject ={
            userId:usersData._id,
            pincode:req.body.pincode,
            task:[{
                // id:uuidv4(), -------------------------set as default in model thats why no need to use here
                description:req.body.task[0].description,
                status:req.body.task[0].status,
                // taskcreatedDate:req.body.taskcreatedDate -------------------------set as default in model
            }],
            // task:req.body.task,---------------------when we want to show complete array of object---------------

            // dateCreated:req.body.dateCreated,-------------------------set as default in model
            // DateModified:req.body.DateModified -------------------------set as default in model
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

module.exports = {
//   getUsersData,
  addUsersData,
//   updateUsersData,
//   modifyUsersData,
//   removeUsersData,
};
