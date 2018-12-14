const express = require("express");
const router = express.Router();
const data = require("../data");
const noticeData = data.notice;
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
            res.render("error", { title: "error" });
        }
    };
}

router.get("/", authRoute("notice"),async (req, res) => {
    try {
       let notice = await noticeData.getAllNotices();
        res.render("notice", {
            notice: notice
        });
    }catch(error){
        res.render("error", { title: "error" });
    }  
});

router.get("/add", authRoute("addNotice"),async (req, res) => {

   
    res.render("addNotice");

});

router.post("/add",authRoute("addNotice"),async (req, res) => {

    try {
        let notice = req.body;
        let title = xss(notice.title);
        let content = xss(notice.content);
        let startdate = xss(notice.startdate);
        let enddate = xss(notice.enddate);
        let noticeFor = xss(notice.noticeFor);


        if (!title) {
            res.render("addNotice", {
                alertMsg: "Please provide notice title",
                title: "addNotice"
            });
            return;
        }
        if (!content) {
            res.render("addNotice", {
                alertMsg: "Please provide notice content name",
                title: "addNotice"
            });
            return;
        }
        if (!startdate) {
            res.render("addNotice", {
                alertMsg: "Please provide notice startdate",
                title: "addNotice"
            });
            return;
        }
        if (!enddate) {
            res.render("addNotice", {
                alertMsg: "Please provide notice enddate",
                title: "addNotice"
            });
            return;
        }
        if (!noticeFor) {
            res.render("addNotice", {
                alertMsg: "Please provide notice for ",
                title: "addNotice"
            });
            return;
        }
        await noticeData.addNotice(title, content, startdate, enddate, noticeFor);
        res.redirect("/notice");

    } catch (error) {
        console.log(error)
        res.render("addNotice", {
            alertMsg: "error while adding notice"
        });
    }
});
router.get("/view/:id", authRoute("viewNotice"),async (req, res) => {
    
  
    try {
        
        let notice = await noticeData.getNoticesById(req.params.id);
        res.render("viewNotice", {
            notice: notice,
        });
    } catch (e) {
        res.status(404).render("notice", {
            errorMessage: "notice Not Found"
        })
    }
});

router.get("/update/:id",authRoute("updateNotice"), async (req, res) => {
    try {
        let notice = await noticeData.getNoticesById(req.params.id);
        
        res.render("updateNotice",{notice:notice});

    } catch (e) {
        res.status(404).render("notice", {
            errorMessage: "notice Not Found"
        })
    }
});

router.get("/delete/:id",authRoute("deleteNotice"), async (req, res) => {
    try {
        await noticeData.removeNotice(req.params.id);
        res.redirect("/notice");
    } catch (error) {
        res.render("viewNotice", {
            alertMsg: "error while deleting"
        });
    }
});

router.post("/update",authRoute("updateNotice"), async (req, res) => {
    let notice;
    try {
        notice =req.body;
        let noticeId = xss(notice.noticeId);
        let title = xss(notice.title);
        let content = xss(notice.content);
        let startdate = xss(notice.startdate);
        let enddate = xss(notice.enddate);
        let noticeFor = xss(notice.noticeFor);

       
        if (!title) {
            res.render("updateNotice", {
                alertMsg: "Please provide notice title",
                title: "updateNotice",
                notice:notice
            });
            return;
        }
        if (!content) {
            res.render("updateNotice", {
                alertMsg: "Please provide notice content name",
                title: "updateNotice",
                notice:notice
            });
            return;
        }
        if (!startdate) {
            res.render("addNotice", {
                alertMsg: "Please provide notice startdate",
                title: "addNotice",
                notice:notice
            });
            return;
        }
        if (!enddate) {
            res.render("updateNotice", {
                alertMsg: "Please provide notice enddate",
                title: "updateNotice",
                notice:notice
            });
            return;
        }
        if (!noticeFor) {
            res.render("updateNotice", {
                alertMsg: "Please provide notice for ",
                title: "updateNotice",
                notice:notice
            });
            return;
        }
        await noticeData.updateNotice(noticeId,title,content,startdate,enddate,noticeFor);
        let updatedNotice = await noticeData.getNoticesById(noticeId);

        res.render("viewNotice", {
            msg: "Notice updated Successfully",
            notice:updatedNotice
        });

    }catch (error) {
        res.render("updateNotice", {
            error: "error while updating",
            notice:notice
        })

    }
});
     



module.exports = router;