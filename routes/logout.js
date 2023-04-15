const router = require('express').Router();

router.get('/logout', async (req, res) => {
    // 세션 체크
    if (req.session) {
        // 세션 삭제
        await req.session.destroy();
        try {
            res.status(200).send();
        } catch (error) {
            res.status(400).send();
        }
    } else {
        res.status(400).send();
    }
});

module.exports = router;