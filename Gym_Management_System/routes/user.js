const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;
const authentication=data.authentication;
const xss =require("xss");

const authRoute = function (moduleName) {

    return async function (req, res, next) {

        let userId = req.cookies.userId;
        try {
            if (!moduleName) {
                throw "moduleName or UserId is empty";
            } else {
                let booleanFlag = await authentication.getPermissionForRoute(moduleName, userId)
                if (booleanFlag) {
                    next();
                } else {
                    res.status(403).render("error", {
                        layout: "index",
                        title: "Error",
                        error: "Page Not available"
                    });
                }
            }
        } catch (err) {
            console.log(err);
        }
    };
}

router.get('/',authRoute("user"), async function (req, res) {
    try{
    let users = await userData.getAllUsers();
    res.render("user", {users: users});
}catch(error){
    res.render("error", { title: "error" });
} 
});

router.get("/add",authRoute("addUser"),async (req, res) => {
    res.render("addUser");

});
router.post("/add/",authRoute("addUser"), async function (req, res) {
    try {
        let userInfo =req.body;
        if(!userInfo){
            res.render("adduser", {
                alertMsg: "Please provide user Info",
                title: "adduser"
            });
            return;
        }
        let successFlag = await userData.createUser(userInfo);
        if (successFlag == true) {
            res.redirect("/user");
        } else {
            res.render("addUser", {
                alertMsg: "User Creation unsuccess"
            })
        }
    } catch (err) {
        console.log("ERROR" + err);
    }
});

router.get("/view/:id",authRoute("viewUser"), async (req, res) => {
    
   
    try {
        let user = await userData.getUserById(req.params.id);
        res.render("viewUser", {
            user: user,
        });
    } catch (e) {
        res.status(404).render("user", {
            errorMessage: "User Not Found"
        })
    }
});


router.get("/update/:id",authRoute("updateUser"),async (req, res) => {
    try {
        let user = await userData.getUserById(req.params.id);
        res.render("updateUser", {
            user: user,
        });
    } catch (e) {
        res.status(404).render("user", {
            errorMessage: "User Not Found"
        })
    }
});

router.get("/delete/:id",authRoute("deleteUser"),async (req, res) => {
    try {
        await userData.deleteUser(req.params.id);
        res.redirect("/user");
    } catch (error) {
        res.render("viewUser", {
            alertMsg: "error while deleting"
        });
    }
});
router.post("/update",authRoute("updateUser"),async (req, res) => {
    let user;

    try {
        user = req.body;
        if(!user){
            res.render("adduser", {
                alertMsg: "Please provide user Info",
                title: "adduser"
            });
            return;
        }
        let userId=user.userId;
        await userData.updateUser(userId,user);
        let updatedUser =userData.getUserById(userId);
         res.render("viewUser", {
         msg: "User updated Successfully",
         user:updatedUser
        });
    } catch (error) {
        console.log(error);
        res.render("updateUser", {
            error: "error while updating",
            user:user
        });

    }
});

module.exports = router;