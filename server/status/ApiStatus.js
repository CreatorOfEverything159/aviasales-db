class ApiStatus extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.message = message
    }

    static badRequest(message) {
        return new ApiStatus(404, message)
    }

    static internal(message) {
        return new ApiStatus(500, message)
    }

    static forbidden(message) {
        return new ApiStatus(403, message)
    }

    static ok(message) {
        return new ApiStatus(200, message)
    }
}

module.exports = ApiStatus
