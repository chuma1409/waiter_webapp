// const { KeyObject } = require("crypto");

module.exports = function Waiters(pool) {

    // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    async function addWaiter(name, days) {

        var regNames = /^[a-zA-Z]+$/;
        newRegex = new RegExp(regNames);
        regexTest = newRegex.test(name);
        var newName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        const Dname = await pool.query(`SELECT username FROM users  
		WHERE username = $1`,[newName]);
        if (Dname.rowCount === 0) {
            const insertName = await pool.query(`INSERT INTO users(username,user_type) VALUES($1,'waiter')`, [newName]);
        }
    
        for (const key in days) {
            const insertDay = 'insert into availability (id_user,id_days) values ($1,$2)'
            const weekdayID = await pool.query('SELECT id from days where chosen_day=($1)', [key]);
            // await pool.query(insertDay, [weekdayID.rows[0].id, Dname.rows[0].id])
            // await pool.query('INSERT INTO days(chosen_day) VALUES ($1)', [key]);

        }
    }
    async function getWaiterNames() {
        var namesG = await pool.query(`SELECT username FROM users`)
        console.log(namesG.rows)
                return namesG.rows;
            }
    // async function selectWorkingDays(selected) {
    //     var user_id = await pool.query(`select id from users where username=$1`, [selected])
    //     var idcheck = user_id.rows[0].id
    //     console.log(idcheck);
    //     let select;
    //     if (idcheck > 0) {
    //         select = await pool.query('select chosen_day from days where chosen_day=$1', [selected])
    //     } else {
    //         return false
    //     }

    //     if (select.rowCount == 0) {
    //         await pool.query('insert into (reg_number, town_id) values ($1, $2)', [selected])
    //     } else {
    //         return false
    //     }
    // }

    return {
        addWaiter,
        // selectDays,
        getWaiterNames
    }
}