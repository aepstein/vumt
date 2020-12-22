module.exports = async ({req,res,model,criteria={},select={},qs=''}) => {
    const limit = 10
    if ( req.params.afterId ) { criteria._id = { $gt: req.params.afterId } }
    const data = await model
        .find(criteria)
        .select(select)
        .limit(limit + 1)
    const pageLink = (req,cursor) => {
        return req.baseUrl + "/after/" + cursor + qs
    }
    const next = data[limit] ? data[limit-1]._id : null
    return res.json({
        data: data.slice(0,limit),
        links: {
            next: next ? pageLink(req,next) : null
        }
    })
}