const pool = require("./database")

const saveAnalyticsCount = async (analytics) => {
    // if any of the analytics are not 0 then update to the database
    if(analytics.jobSearches != 0 || analytics.bookmarks != 0 || analytics.visitors != 0){
        await pool.connect((err, client, done) => {
            if (err) throw err
            client.query(`UPDATE analytics SET jobsearches=${analytics.jobSearches}, totalvisitors=${analytics.visitors}, bookmarks=${analytics.bookmarks} WHERE id=1`, (err, res) => {
              done()
            })
        })
    }else {
      // if either of them are 0 then it means that no data was analysed while server is active or the server was reset/restarted causing the analytics variables to reset to zero
      // therefore pull the values back from the database
        await pool.connect((err, client, done) => {
            if (err) throw err
            client.query(`SELECT * FROM analytics WHERE id=1`, (err, res) => {
              done()
              if (err) {
              } else {
                analytics.visitors = res.rows[0]['totalvisitors']
                analytics.jobSearches = res.rows[0]['jobsearches']
                analytics.bookmarks = res.rows[0]['bookmarks']
              }
            })
        })
    }
}

exports.saveAnalyticsCount = saveAnalyticsCount