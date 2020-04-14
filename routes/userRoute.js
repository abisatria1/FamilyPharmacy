const router = require('express-promise-router')()
const userController = require('../controllers/userController')
// authentication
const passport = require('passport')
const auth = require('../helpers/auth')

// validation body
const {
    validateBody,
    validateUsernameAndEmail,
    validatePassword,
    validateUser
} = require('../helpers/validator/validateBody')
const {
    userSchema,
    profileSchema,
    accountSchema,
    updatePassSchema,
    loginSchema
} = require('../models/schemas/userSchemas') 




// index , create
router.route('/')
    .get(
        passport.authenticate('jwt' , {session : false}),
        validateUser(),
        userController.index
    )
    .post(
        passport.authenticate('jwt' , {session : false}), 
        [validateUser() ,validateBody(userSchema) , validateUsernameAndEmail()], 
        userController.createUser
    )

// update account
router.route('/account')
    .patch(
        passport.authenticate('jwt' , {session : false}), // validate token
        [validateBody(accountSchema),validateUsernameAndEmail()] , //validate body
        userController.updateAccount
    )

// update password
router.route('/password')
    .patch(
        passport.authenticate('jwt' , {session : false}), // validate token
        [validateBody(updatePassSchema) , validatePassword()] , //validate body
        userController.updatePassword
    )

// get spesific user, update profile , delete user
router.route('/profile')
    .get(passport.authenticate('jwt',{session : false}),userController.showUser)
    .patch(
        passport.authenticate('jwt' , {session : false}),
        validateBody(profileSchema),
        userController.updateProfile
    )   

// untuk melakukan delete user oleh pemilik
router.route('/delete/:userId')
    .delete(
        passport.authenticate('jwt',{session:false}),
        validateUser(), 
        userController.deleteUser)
    
// login
router.route('/login')
    .post(validateBody(loginSchema),userController.login)

// search
router.route('/search')
    .get(
        passport.authenticate('jwt',{session:false}),
        validateUser(),
        userController.searchUser
    )
module.exports = router