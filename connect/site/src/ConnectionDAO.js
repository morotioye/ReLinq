import Connection from "./server";

// Connection Data Access Object (DAO) for database operations
class ConnectionDao {
  // Create a new connection
  static async createConnection(
    email,
    phoneNumber,
    name,
    tags,
    description,
    linkedInURL
  ) {
    try {
      const connection = new Connection({
        email,
        phoneNumber,
        name,
        tags,
        description,
        linkedInURL,
      });
      await connection.save();
      return connection;
    } catch (error) {
      throw error;
    }
  }

  // Find a connection by email
  static async findConnectionByEmail(email) {
    try {
      const connection = await Connection.findOne({ email });
      return connection;
    } catch (error) {
      throw error;
    }
  }

  // Update a connection's information
  static async updateConnection(email, updatedData) {
    try {
      const connection = await Connection.findOneAndUpdate(
        { email },
        updatedData,
        { new: true }
      );
      return connection;
    } catch (error) {
      throw error;
    }
  }

  // Delete a connection by email
  static async deleteConnectionByEmail(email) {
    try {
      const deletedConnection = await Connection.findOneAndDelete({ email });
      return deletedConnection;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { ConnectionDao };
