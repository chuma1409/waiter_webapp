// const { KeyObject } = require("crypto");

module.exports = function Waiters(pool) {

    async function addShifts(name, days) {
        await pool.query('delete from availability where id_user = $1', [name])
        for (let i = 0; i < days.length; i++) {
            const weekdayName = days[i];
            var working_id = await shiftId(weekdayName)
            await pool.query("insert into availability(id_user, id_days) values($1, $2)", [name, working_id])
        }
    }



    async function addWaiter(name) {

        var checkName = await pool.query('select * from users where username = $1', [name])
        if (checkName.rowCount === 0) {
            await pool.query('insert into users(username) values ($1)', [name]);
        }
        var idUser = await pool.query('select id from users where usernmae = $1', [name])
        return idUser.rows[0].id

    }


    async function selectedWorkingDays(days, name) {
        try {
            let waiterId = await getWaiterId(name)
            if (waiterId) {
                await addShifts(waiterId, days)
            } else {
                await addWaiter(name)
                waiterId = await getWaiterId(name)
                await addShifts(waiterId, days)
            }

            return {}
        } catch (error) {


        }
    }
    async function shiftId(day) {

        if (day) {
            var dayQuery = await pool.query("select id from days where chosen_day = $1", [day])
            let working_id = dayQuery.rows[0].id;
            return working_id;
        }
    }
    async function combined(id) {
        try {
            const combineDay = await pool.query('select chosen_day from availability join days on availaility.id_days = days.id join waiters on availability.id_user = users.id where id_user = $1 ORDER BY days.id ASC', [id])
            // console.log(combineDay.rows + "inside get waiter");
            return combineDay.rows

        } catch (error) {


        }
    }
    async function chosenDays(name) {
        try {
            const seven = await pool.query('select chosen_day from days')
            const userId = await getWaiterId(name)
            const shift = await combined(userId) || []

            const rows = seven.rows
            await rows.forEach(async (day) => {

                day.users = []
                day.checked = '';
                shift.forEach(async (waiter) => {
                    if (day.chosen_day === waiter.chosen_day) {
                        day.checked = 'checked'

                    }
                    if (day.chosen_day === waiter.chosen_day) {
                        day.users.push(waiter);
                    }

                })
            })
            return rows;
        } catch (error) {
        }
    }
    async function getDays() {
        try {
            const week = await pool.query('select chosen_day from days')
            const shift = await getAdminId()
            console.log(shift + "shift");

            const list = week.rows
            console.log(list);
            await list.forEach(async (day) => {
                day.users = []

                shift.forEach(async (name) => {
                    if (day.chosen_day === name.chosen_day) {
                        day.users.push(name);
                    }

                    if (day.users.length === 3) {
                        day.color = "green"
                    }
                    else if (day.users.length < 3) {
                        day.color = "orange"
                    }
                    else if (day.users.length > 3) {
                        day.color = "red"

                    }
                })
            })
            return list;

        } catch (error) {

        }

    }

    async function getAdminId() {

        const joined = await pool.query('select chosen_day, username from availability join days on availability.id_days = days.id join users on availability.id_user = users.id ORDER BY days.id ASC')
        return joined.rows
    }


    async function getWaiterId(name) {
        try {
            const idWaiter = await pool.query('select id from users where username = $1', [name])
            var user_id = idWaiter.rows[0].id;
            return user_id
        } catch (error) {
            return false
        }
    }

  

    return {
        shiftId,
        addShifts,
        addWaiter,
        getDays,
        getAdminId,
        combined,
        selectedWorkingDays,
        chosenDays,
        getWaiterId
    }
}