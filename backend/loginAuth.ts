export async function validateUser(client, uname: string, pass: string) {
  const results = await client.query(
    `SELECT uname, uid, name FROM USERS WHERE uname = ? AND password = ?`,
    [uname, pass]
  );

  if (results.length > 0) {  
    return {
      status: 200,
      data: {
        message: "Login Successful",
        isValid: true,
        user: {
          name: results[0].name,
          uid:results[0].uid,
          user: results[0].uname
        },
      },
    };
}
    return {
        status: 401,
        data: {
        message: "Invalid Credentials :/",
        isValid: false,
    },
  };
}

// export async function editPass(client, uname: string, pass: string, npass:string) {
//     const results = await client.query(
//     `SELECT UNAME, PASSWORD FROM USERS WHERE username = ? AND password = ?`,
//     [uname, pass]
//   );

// }

