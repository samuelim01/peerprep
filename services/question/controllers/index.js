const getHealth = async (req, res, next) => {
    res.status(200).json({
        message: 'Server is up and running!',
    });
    return;
};

module.exports = getHealth;