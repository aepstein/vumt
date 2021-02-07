class RestrictedKeyError extends Error {
    constructor (model,dependent,key,...params) {
        super(params)
        this.model = model.constructor.modelName
        this.dependent = dependent.constructor.modelName
        this.key = key
        this.message = `${this.model} cannot be deleted because `+
            `dependent ${this.dependent} related by ${key} exists.`
        this.name = 'RestrictedKeyError'
    }
}
module.exports = {
    RestrictedKeyError
}