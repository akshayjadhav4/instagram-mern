const express = require("express");
const router = express.Router();
const { newMessage, syncMessages } = require("../controllers/message");

router.post("/message/new", newMessage);
router.get("/message/sync/:sendId/:receiveId", syncMessages);

module.exports = router;
