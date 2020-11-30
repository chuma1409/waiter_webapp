const assert = require("assert")
const Waiters = require("../waiters")

describe("Waiters", function () {
    const pg = require("pg");
    const Pool = pg.Pool;
    const connectionString = process.env.DATABASE_URL || 'postgresql://chuma:pg123@localhost:5432/waiters_webapp_tests';
    const pool = new Pool({
        connectionString
    });


    beforeEach(async function () {
        await pool.query("delete from users");
        await pool.query("delete from days");
    });
    it("should be able to add Waiters to database", async function () {
        let waiters = Waiters(pool)

        var user = "bantu";

       let test = await waiters.addWaiter(user)
       let idUser = await pool.query('select id from users where username = $1', ["bantu"])
       
        assert.equal(idUser.rows[0].id, test);

    })
it("should be able to give days Ids", async function(){
    let waiters = Waiters(pool)

    var day = "Wednesday";

    let test = await waiters.shiftId(day)
    let idDay = await pool.query("select id from days where chosen_day = $1", ["Wednesday"])

    assert.equal(idDay.rows[0].id, test);
 
})
 it("should ")



    after(async function () {
        pool.end();
    })
});