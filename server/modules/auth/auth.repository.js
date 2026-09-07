const db = require("../../config/db");

const createUser = async ({ name, email, password, username }) => {
  const result = await db.query(
    `INSERT INTO users (name, email, password, username)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, username, is_verified`,
    [name, email, password, username],
  );
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

const getUserByUsername = async (username) => {
  const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

const updateVerificationToken = async ({ token, isVerified, lastVerify, id }) => {
  await db.query(
    `UPDATE users
     SET is_verified = $1, verification_token = $2,
         last_verification_email_sent_at = $3
     WHERE id = $4`,
    [isVerified, token, lastVerify, id],
  );
};

const updatePassword = async (password, id) => {
  await db.query("UPDATE users SET password = $1 WHERE id = $2", [password, id]);
};

const updateResetToken = async ({ token, lastReset, id }) => {
  await db.query(
    `UPDATE users
     SET reset_password_token = $1, last_forgot_password_sent_at = $2
     WHERE id = $3`,
    [token, lastReset, id],
  );
};

const updateProfile = async ({ id, name, username }) => {
  const result = await db.query(
    `UPDATE users
     SET name = $1, username = $2, updated_at = NOW()
     WHERE id = $4
     RETURNING id, name, email, username, avatar_url, created_at, updated_at`,
    [name, username, id],
  );
  return result.rows[0];
};

const updateAvatarUrl = async (imageUrl, id) => {
  const result = await db.query(
    `UPDATE users SET avatar_url = $1, updated_at = NOW()
     WHERE id = $2 RETURNING avatar_url`,
    [imageUrl, id],
  );
  return result.rows[0];
};

const updateMessagingPrivacy = async (userId, privacy) => {
  const result = await db.query(
    `UPDATE users SET messaging_privacy = $1, updated_at = NOW()
     WHERE id = $2 RETURNING id, messaging_privacy`,
    [privacy, userId],
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  updateVerificationToken,
  updatePassword,
  updateResetToken,
  updateProfile,
  updateAvatarUrl,
  updateMessagingPrivacy,
};