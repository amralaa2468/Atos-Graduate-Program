import axios from "axios";

const getDecodedToken = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;

    res.status(200).send(decodedToken);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAdminToken = async (req, res) => {
  const url =
    "http://localhost:8080/realms/myrealm/protocol/openid-connect/token";
  const data = new URLSearchParams();
  data.append("username", "admin");
  data.append("password", "admin");
  data.append("grant_type", "password");
  data.append("client_id", "myclient");

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error("Token Request Error:", error);
  }
};

const getStudents = async (req, res) => {
  let adminToken = await getAdminToken();

  try {
    const url = "http://localhost:8080/admin/realms/myrealm/users";
    const token = adminToken;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = response.data;

    const filteredUsers = users.filter((user) => {
      if (user.attributes && user.attributes.userType) {
        return user.attributes.userType.includes("student");
      }
      return false;
    });

    const filteredUsersJSON = JSON.stringify(filteredUsers);

    res.send(filteredUsersJSON);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.send({ error: "Error retrieving users" });
  }
};

export default { getDecodedToken, getAdminToken, getStudents };
