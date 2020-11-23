// const { KeyObject } = require("crypto");

module.exports = function Waiters(pool) {

    async function addWaiter(name) {
        const waiter = await pool.query(`SELECT username FROM users  
		WHERE username = $1`, [name]);
        if (waiter.rowCount === 0) {
           await pool.query(`INSERT INTO users(username) VALUES($1)`, [name]);
        }
        var f = await nameId(name)
        console.log(f + " our side");
    }

    async function addDaysChosen(waiters, days){
        
        for(let i=0; i < days.length; i++){
            var dayName = days[i];
            console.log(dayName);
            var shiftDays = await daysId(dayName)
            await pool.query('INSERT INTO availability(id_user, id_days) VALUES($1, $2)', [waiters, shiftDays])
        }

    }

    async function daysId(days) {
        var idDay = await pool.query('select id from days where chosen_day = $1', [days])
        return idDay.rows[0].id;
    }
    async function nameId(name) {
        var idName = await pool.query('select id from users where username = $1', [name])
        return  idName.rows[0].id;;
       
    }
    async function getDays(){
        var list = await pool.query('select chosen_day from days')
        return list.rows
    }
        async function getNames(){
            var list = await pool.query('select username from users')
            return list.rows
        }
    async function selectWorkingDays(waiter_id, dayId) {
        var nId = await addWaiter(waiter_id)

        console.log(nId + " Inside add days and waiter")
        await pool.query('delete from availability where id_user = $1', [nId])
        for (const day of dayId) {
            console.log(dayId + " days");
            var specificDay = await daysId(day)
            console.log(specificDay);
            for (const waiter of specificDay) {
                await pool.query('INSERT INTO availability(id_user, id_days) VALUE($1, $2)', [nId, waiter.id_days])
            }
        }

    
    }
    
    async function tablesJoined(){
        const shift = await pool.query('SELECT * FROM availability JOIN users ON availability.id_user = users.id JOIN days ON availability.id_days = days.id')
return shift.rows
    }

 
    return {
        tablesJoined,
        addWaiter,
        getNames,
        selectWorkingDays,
        getDays,
        daysId,
        nameId,
        addDaysChosen
  
    }
}