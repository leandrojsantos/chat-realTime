const express = require("express");

const { v4: uuidv4 } = require('uuid');
 
const get = (req, res) => {
    const randomGenUniqueName = uuidv4();
    res.status(200).send({ roomUrl: randomGenUniqueName });
};

module.exports = usersRouter;