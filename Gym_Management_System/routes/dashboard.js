const express = require("express");
const router = express.Router();

const data = require("../data");
const user = data.user;
const session = data.session;
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const cookieParser = require("cookie-parser");

router.use(cookieParser());
router.use(bodyParser.json());

const userAuth = function (req, res, next) {

    if (!req.cookies.authCookie) {
        res.status(403).render("error", {
            layout: "index",
            title: "Error",
            error: " User is not logged in !"
        });
    } else {
        next();
    }
};

router.get('/', userAuth,async (req, res) => {
   
    try {
        let clientSessionId=req.cookies.authCookie;
        let userId = await session.getSessionById(clientSessionId);
        if (!userId) throw "Unauthorize access";
        userdetail = await user.getUserById(userId);
        res.render("dashboard", {
            title: "Dashboard",
            firstname: userdetail.firstname,
            lastname: userdetail.lastname
        });
    } catch (error) {
        console.log(error);
        res.clearCookie("authCookie");
        res.status(403).render('error', {
            layout: "index",
            title: "Error",
            error: error
        });
    }
});



const createUserAuth = async function (req, res, next) {
    let userId = req.cookies.userId;
    try {
        role = await users.getRole(userId);
        if (!role) {
            throw error;
        } else if (role == "admin") {
            next();
        } else {
            res.status(403).render("error", {
                layout: "index",
                title: "Error",
                error: "Page Not available"
            });
        }
    } catch(err) {
        console.log("Problem in getting role");
    }

};
// router.get('/createUser',async function (req, res) {
//     res.render("createUser");
// });
// router.post("/createUser",createUserAuth,async function (req, res) {
//     try{
//         let userInfo=req.body;
  
//         let successFlag=await user.createUser(userInfo);
//         if(successFlag==true){
//             res.render("createUser",{
//                 successMsg:"User Created Successfully"
//             })
//         }
//         else{
//             res.render("createUser",{
//                 alertMsg:"User Creation unsuccess"
//             })
//         }
//     }
//     catch(err){
//         console.log("ERROR"+err);
//     }
// });
router.get('/logout', function (req, res) {
    res.clearCookie("authCookie");
    res.render("logout", {
        layout: "index",
        title: "Logout"
    });
});

module.exports = router;
