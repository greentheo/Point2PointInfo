
exports.list = function (req, res) {
    // user id is optional
    var id = req.params.id;

    // TODO: load and list all data, or filter by user ID
    // res.json(JSON.stringify(data));
};

exports.addLocationData = function(req, res) {
    // should be in format:
    /*
    {
        userName: String,
        location: [
            {
                timestamp: Date,
                coords: { },
                accelerometer: [
                    x: Number,
                    y: Number,
                    z: Number
                ]
            }
        ]
    }
     */

    // TODO: how are we saving this?  File system?  MongoDB?  etc.?
};

