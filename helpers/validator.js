class Validator {
     static validateTaskInfo(taskInfo){
          if(taskInfo.hasOwnProperty('id') && taskInfo.hasOwnProperty('title') && taskInfo.hasOwnProperty('description') && taskInfo.hasOwnProperty('completed') ){
               return {
                    "status": true,
                    "message": "Validated successfully"
               };
          } else {
               return {
                    "status": false,
                    "message": "Task info is malformed, please provide all the parameters"
               }
          }
     }
}

export default Validator;