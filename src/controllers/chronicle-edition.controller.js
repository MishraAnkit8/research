
module.exports.renderChronicleEdition = async(req, res, next) => {
    res.render('chronicle-edition')
}


module.exports.insertChronicleEdition = async(req, res, next) => {
    console.log('data comming from frontend in Chronicle  ==>>', req.body);
}