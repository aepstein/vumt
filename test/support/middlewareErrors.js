module.exports.errorMustHaveRoles = (res,roles) => {
    res.should.have.status(401)
    res.body.should.be.an('object')
    res.body.should.have.a.property('code').eq('AUTH_NEED_ROLE')
    res.body.should.have.a.property('roles').has.members(roles)
}
module.exports.errorNoToken = (res) => {
    res.should.have.status(401)
    res.body.should.have.a.property('code').eql('AUTH_NO_USER_TOKEN')
}
module.exports.errorPathRequired = (res,path) => {
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.a.property('msg').eql(`Path \`${path}\` is required.`);
}
module.exports.errorPathUnique = (res,path) => {
    res.should.have.status(400)
    res.body.should.be.an('object')
    res.body.should.have.a.property('msg').include(`Path \`${path}\` must be unique.`);
}
