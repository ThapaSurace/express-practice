const express = require('express')
const router = express.Router()
const employeeController = require('../../controllers/employeeController')
const ROLES_LIST = require('../../config/roles_list')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')

// if u want to provide access token to single route only do this
// .get(verifyJWT,employeeController.getAllEmployees)
 
// any one can acess get route
.get(employeeController.getAllEmployees)

// only admin and editor can post and put
.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeeController.createNewEmployee)
.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeeController.updateEmployee)

// only admin can perform delete opeartion
.delete(verifyRoles(ROLES_LIST.Admin),employeeController.deleteEmployee);
router.route('/:id')
 .get(employeeController.getEmployee)
module.exports = router