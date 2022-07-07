const { Router } = require('express');
const auth = require('../controllers/auth');
const protect = require('../middlewares/auth/protect');
const user = require('../controllers/user');

const router = Router();

router.use(protect);

router.get('/sessions', user.sessions);
router.delete('/sessions/:id/terminate', user.terminateSession);
router.delete('/sessions/terminateAll', user.terminateAllSessions);

module.exports = router;
