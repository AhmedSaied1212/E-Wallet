const appHandler = require("../../utils/appHandler");
const service = require("./users.service");

const searchUsers = appHandler(async (req, res) => {
    const { q, cursor, limit } = req.query;

    const result = await service.searchUsers({
        query: q,
        requesterId: req.user.id,
        cursor,
        limit,
    });

    res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        data: result.users,
        pagination: result.pagination,
    });
});

module.exports = {
    searchUsers,
};
