import User from './server.js';

// User Data Access Object (DAO) for database operations
class UserDao {
  // Create a new user
  static async createUser(email, password) {
    try {
      const user = new User({ email, password });
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Find a user by their email
  static async findUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Update a user's password
  static async updatePassword(email, newPassword) {
    try {
      const user = await User.findOneAndUpdate({ email }, { password: newPassword }, { new: true });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Delete a user by their email
  static async deleteUserByEmail(email) {
    try {
      const deletedUser = await User.findOneAndDelete({ email });
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserDao;
