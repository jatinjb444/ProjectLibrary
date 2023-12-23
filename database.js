const mysql = require('mysql2');
const dotenv = require('dotenv')


dotenv.config();

const pool = mysql.createPool({
    host:process.env.HOST_NAME,
    user: process.env.USER,
    password:process.env.PASSWORD,
    database: process.env.DATABASE
}).promise();


async function getBooks(){
    const [rows] = await pool.query("SELECT * FROM books");
    return JSON.stringify(rows);
}



async function insertBook(bookName,isbn,genre,publicationYear,avalCopies,totalCopies){
    const result = await pool.query(`
    INSERT INTO books (title,isbn,genre,publication_year,available_copies,total_copies)
    VALUES(?,?,?,?,?,?)
    `,[bookName,isbn,genre,publicationYear,avalCopies,totalCopies]);

    return result;

}

async function deleteBook(bookid){
    const r = await pool.query(`
    DELETE FROM transactions 
    where book_id =?
    `,[bookid]);
    const result = await pool.query(`
    DELETE FROM books
    WHERE book_id = ?
    `,[bookid]);
    return result;
}

async function editBook(bookid,title,isbn,genre,publication_year,available_copies,total_copies){
    const result = await pool.query(`
    UPDATE books
    SET title = ?,
    isbn = ?,
    genre = ?,
    publication_year = ?,
    available_copies=?,
    total_copies =?
    WHERE book_id = ? 
    `,[title,isbn,genre,publication_year,available_copies,total_copies,bookid]);
    return result;
}

async function isValidStudentLogin(usn , password){
    const [result] = await pool.query(`
    select usn,password from user_logins 
    where usn = ? `,[usn]);

    // To validate the result
    if(result.length == 0){
        // print user not found
        console.log("user not found");
        return -1;
    }
    else if(result[0].password == password){
            // redirect to login page
            return 0;
    }
    else{
        return -2;
        // password is invalid
    }
    console.log(result);
    

}
async function isValidAdminLogin(email,password){
    const [result] = await pool.query(`
    SELECT email,password FROM adminlogin
    where email = ?
    `,[email]);

    if(result.length ==0)
    {
        console.log("user not found");
        return -1;
    }

    else if(result[0].password == password)
    {
        return 0;
        //valid
    }
    else{
        return -2;
        //password invalid
    }
}

async function getUsers(){
    const [result] = await pool.query(`
    SELECT * FROM users    
    `);
    return result;
}

async function deleteUser(usn) {
    const deleteTransactions = await pool.query(`
        DELETE FROM transactions
        WHERE usn = '${usn}'
    `);

    const deleteUserLogins = await pool.query(`
        DELETE FROM user_logins
        WHERE usn = '${usn}'
    `);

    const deleteUsers = await pool.query(`
        DELETE FROM users
        WHERE usn = '${usn}'
    `);

    return {
        deleteTransactions,
        deleteUserLogins,
        deleteUsers
    };
}

async function addUser(usn , fname , lname , email, pnumber , address,password){
    const result = pool.query(`INSERT INTO users(usn, first_name , last_name , email, phone_number, address)
    VALUES(?,?,?,?,?,?)`,[usn , fname, lname, email, pnumber, address]);

    const addUserLogin = await pool.query(`
    INSERT INTO user_logins VALUES(?,?)
    `,[usn,password])

    return {
        result, addUserLogin
    };
}

async function editUser(newFirstName, newLastName, newEmail, newPhoneNumber, newAddress, usn,newPassword){
    try{
        const [userUpdateResult] = await pool.query(
            `UPDATE users SET first_name=?, last_name=?, email=?, phone_number=?, address=? WHERE usn=?`,
            [newFirstName, newLastName, newEmail, newPhoneNumber, newAddress, usn]
          );
          const [loginUpdateResult] = await connection.execute(
            `UPDATE user_logins SET password=? WHERE usn=?`,
            [newPassword, usn]
          );
    }
    catch(err)
    {
        console.log(err);
    }
    return {
        userUpdateResult, loginUpdateResult
    }
}

module.exports = { getBooks , insertBook,deleteBook,editBook,isValidStudentLogin ,isValidAdminLogin,getUsers,deleteUser,addUser ,editUser};
// console.log(getUsers());