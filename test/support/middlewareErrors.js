module.exports.errorMustHaveRoles = (res,roles) => {
    res.should.have.status(401)
    res.body.should.be.an('object')
    res.body.should.have.a.property('msg')
        .eql(`Insufficient privileges. User must have one of these roles: ${roles.join(', ')}`)
}
module.exports.errorNoToken = (res) => {
    res.should.have.status(401)
    res.body.should.have.a.property('msg').eql('No token, authorization denied')
}
module.exports.errorPathRequired = (res,path) => {
    res.should.have.status(400);
    res.body.should.be.a('object');
    res.body.should.have.a.property('msg').eql(`Path \`${path}\` is required.`);
}
