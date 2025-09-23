export async function makeAcc(client, name: string, uname: string,dob:string, pass: string) {
  const results = await client.query(
    `SELECT  name FROM USERS WHERE uname = ?`,
    [uname]
  );
  if  (results.length<=0){
    dob=corr_dob(dob);
    const nuid=await client.query(
      `SELECT MAX(uid) AS max_uid FROM users;`
    );
    let uid:number=(nuid[0].max_uid || 1000)+1;
    await client.query(
      `INSERT INTO users (uid, uname, name, password, dob) VALUES (?, ?, ?, ?, ?);`,
      [uid, uname, name,pass, dob]
    );
    return {
      status: 200,
      data: {
        message: "Account Added Succesfully",
        isValid: true,
        user: {name,
            uid,
            user: uname
        },
      },
    };
  }
    return {
        status: 401,
        data: {
        message: "Cannot Create new account with same Username",
        isValid: false,
        }
    };
}

function corr_dob(dob:string): string {
    
  const parts = dob.split("-");
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Use DD-MM-YYYY");
  }
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

}