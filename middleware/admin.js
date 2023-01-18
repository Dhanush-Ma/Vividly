function authAdmin(req, res, next){

    if(!req.user.isAdmin) return res.status(403).send("Acces Denied")

    next()
}

module.exports = authAdmin