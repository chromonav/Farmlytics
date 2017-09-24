var request = require("request");
var _ = require("lodash")
var moment = require('moment')
var rp = require('request-promise')
const base_url = 'http://52.204.227.188/api/v2.0'
const optiongenerator = function (req_name, access_token) {
    switch (req_name) {
        case "search":
            return {
                method: "POST",
                url: `${base_url}/search/`,
                headers:
                {
                    'cache-control': 'no-cache',
                    clientid: 'FyDQdh4qTXMSKnwVqyMNholYdpEa',
                    'content-type': 'application/json',
                    authorization: `Bearer ${access_token}`,
                    client_secret: '6aQCIU4g0L9UBoPinRMNEk1DHCwa'
                },
                body: {
                    search_criteria:
                    {
                        RelationArray: [{ r1: { type: '' } }],
                        NodeArray: [{ n1: '' }, { n2: '' }],
                        Expression: 'type(r1) in [\'serviceappointment\',\'invoice\',\'receipt\',\'payment\'] and r1.is_active=true ',
                        Return:
                        ['r1.payment_mode as Payment_Mode',
                            'r1.transaction_id as Transaction_Id',
                            'r1.created_date_time as Transaction_Date',
                            'r1.payment_status as Payment_Status',
                            'r1.amount_received as Receipt_Amount',
                            'r1.receipt_date as Payment_Receipt_Date',
                            'r1.workflowId as Service_Appointment_Id',
                            'r1.event_start_date_time as Service_Appointment_Start_Date',
                            'r1.gateway as Payment_Gateway',
                            'r1.ref_id as Invoice_Id',
                            'r1.amount_paid as Payment_Amount',
                            "r1.payment_date as Payment_Date",
                            'r1.amount as Invoice_Amount',
                            'r1.status as Invoice_Status',
                            'n1.object_id as User_Id',
                            'n1.created_date_time as User_Created_Date',
                            'n1.is_active as Is_User_Active',
                            'n1.gender as User_Gender',
                            'n2.object_id as Business_Id',
                            'n2.is_verified as Is_Business_Verified',
                            'n2.created_date_time as Business_Created_Date']
                    }
                },
                json: true
            }
            break;
        case "login":
            return {
                method: "POST",
                url: `${base_url}/login/`,
                headers:
                {
                    'cache-control': 'no-cache',
                    clientid: 'FyDQdh4qTXMSKnwVqyMNholYdpEa',
                    'content-type': 'application/json'
                },
                body:
                {
                    username: '8805189711',
                    password: 'NjczZGI4NDQ5YmVhODcxOTdiYzllMDgyYjdlNTI4ZGU3YmFmZDUwN2NmOTM5ZTI4',
                    client_id: 'FyDQdh4qTXMSKnwVqyMNholYdpEa',
                    client_secret: '6aQCIU4g0L9UBoPinRMNEk1DHCwa',
                    grant_type: 'password'
                },
                json: true
            }
            break;
        case "person":
            return {
                method: "GET",
                url: `${base_url}/person/`,
                headers:
                {
                    'cache-control': 'no-cache',
                    clientid: 'FyDQdh4qTXMSKnwVqyMNholYdpEa',
                    'content-type': 'application/json',
                    authorization: `Bearer ${access_token}`,
                    client_secret: '6aQCIU4g0L9UBoPinRMNEk1DHCwa'
                },
                json: true
            }
            break;
    }

}

APP_DATA = {
    dtemp: 0,
    totaltransactions: 0,
    transactionhistory: {
        amount: [],
        date: []
    },
    maintranshis: [],
    mergedtranshis: [],
    totalonline: [],
    mainonline: {
        dates: ['x'],
        online: ["online"]
    },
    successonline: 0,
    totalusers: 0,
    users: [],
    parsedusers: {}
}




getdata = function () {



    return setTimeout(() => {
        mainfunc()
        getdata()
    }, 20000)

}


var parseUsers = (users) => {
    if (users) {
        return _.map(users, (user) => {
            return {
                "created_date_time": user.created_date_time
            }
        })

    }
}

var isDataValid = () => {
    if (APP_DATA.users) {
    }
}

var mainfunc = () => {

    rp(optiongenerator("login"))
        .then((data) => {
            rp(optiongenerator("search", data.ResultData.Authorization_Info.access_token))
                .then(maindata => {
                    // console.dir("result")

                    APP_DATA.dtemp = maindata;
                    APP_DATA.totaltransactions = 0
                    APP_DATA.totalonline = []
                    APP_DATA.transactionhistory = {
                        amount: ["amount"],
                        date: ["x"]
                    }
                    APP_DATA.maintranshis = []

                    _.map(APP_DATA.dtemp.ResultData, (el) => {
                        if (el.Payment_Amount != null) {
                            trans = {
                                amount: el.Payment_Amount,
                                date: moment(el.Payment_Date).format("YYYY[-]MM[-]DD"),
                            }
                            APP_DATA.transactionhistory.amount.push(trans.amount);
                            APP_DATA.transactionhistory.date.push(trans.date);
                            APP_DATA.maintranshis.push(trans)

                            APP_DATA.totaltransactions = APP_DATA.totaltransactions + el.Payment_Amount;

                            if (el.Payment_Mode == "ONLINE" || el.Payment_Mode == "WALLET") {
                                var index = _.findIndex(APP_DATA.totalonline, (d) => d.date == trans.date)
                                // console.log("index" + index + _.isNumber(index))
                                if (index > -1) {
                                    // console.dir( APP_DATA.totalonline )
                                    // console.log(" ")
                                    // console.log(_.isNumber(APP_DATA.totalonline[index].online))
                                    // console.log(APP_DATA.totalonline[index].online)
                                    APP_DATA.totalonline[index].online = APP_DATA.totalonline[index].online + 1;
                                } else {
                                    APP_DATA.totalonline.push({
                                        online: 1,
                                        date: trans.date
                                    })
                                }
                            }


                        }
                    })
                    //modify maintrans history 
                    APP_DATA.mergedtranshis = [];

                    for (i in APP_DATA.maintranshis) {
                        index = _.findIndex(APP_DATA.mergedtranshis, function (o) {
                            return APP_DATA.maintranshis[i].date == o.date;
                        })
                        if (index > -1) {
                            APP_DATA.mergedtranshis[index].amount += APP_DATA.maintranshis[i].amount
                        } else {
                            APP_DATA.mergedtranshis.push(APP_DATA.maintranshis[i])
                        }
                    }

                    var lcal = {
                        amount: ["amount"],
                        date: ["x"]
                    }

                    for (i in APP_DATA.mergedtranshis) {
                        lcal.amount.push(APP_DATA.mergedtranshis[i].amount)
                        lcal.date.push(APP_DATA.mergedtranshis[i].date)
                    }
                    console.dir(lcal)
                    // console.dir('APP_DATA.mergedtranshis')
                    // console.dir(APP_DATA.mergedtranshis)
                    APP_DATA.maintranshis = lcal;
                    //totalonline
                    if (APP_DATA.totalonline) {
                        APP_DATA.successonline = 0
                        APP_DATA.mainonline.dates = ['x']
                        APP_DATA.mainonline.online = ["online"]
                        for (i in APP_DATA.totalonline) {
                            // console.dir("i")
                            // console.dir(APP_DATA.totalonline[i].online)
                            APP_DATA.successonline = APP_DATA.successonline + APP_DATA.totalonline[i].online
                            APP_DATA.mainonline.dates.push(APP_DATA.totalonline[i].date)
                            APP_DATA.mainonline.online.push(APP_DATA.totalonline[i].online)
                        }
                        // console.dir('APP_DATA.mainonline')
                        // console.dir(APP_DATA.mainonline)
                    }

                    var rep = new RegExp("Date", "g")
                    var rep2 = new RegExp("_", "g")
                    result = maindata.ResultData
                    result = _.map(result, function (res) {
                        for (var o in res) {

                            if (rep.test(o)) {
                                var moment_date
                                if (res[o]) {
                                    moment_date = moment(res[o])
                                }
                                res[o.replace(rep, "Month").replace(rep2, " ")] = moment_date ? moment_date.format("MMMM") : null;
                                res[o.replace(rep, "Day").replace(rep2, " ")] = moment_date ? moment_date.format("D") : null;
                                res[o.replace(rep, "Year").replace(rep2, " ")] = moment_date ? moment_date.format("YYYY") : null;
                                res[o.replace(rep, "AM/PM").replace(rep2, " ")] = moment_date ? moment_date.format("A") : null;
                            }
                            // res[o.replace(rep2, " ")] = res[o];
                            delete res[o]
                        }
                        return res
                    })

                })
                .catch((err) => {
                    // console.dir(err)
                })

            rp(optiongenerator("person", data.ResultData.Authorization_Info.access_token))
                .then(res => {

                    APP_DATA.users = parseUsers(res.ResultData)
                    APP_DATA.totalusers = APP_DATA.users.length
                    console.dir("persons")
                    console.dir(APP_DATA)
                    var lcl = [];
                    var lcl2 = { no: [], created_date_time: [] };

                    for (i in APP_DATA.users) {
                        var index = _.findIndex(lcl, function (o) {
                            return APP_DATA.users[i].created_date_time == o.created_date_time;
                        })

                        if (index > -1) {
                            lcl[index].no = lcl[index].no + 1;
                        } else {
                            lcl.push({
                                no: 1,
                                created_date_time: moment(APP_DATA.users[i].created_date_time).format("YYYY[-]MM[-]DD")
                            })
                        }
                    }

                    for (i in lcl) {
                        lcl2.no.push(lcl[i].no)
                        lcl2.created_date_time.push(lcl[i].created_date_time)
                    }

                    APP_DATA.parseUsers = lcl2
                    console.dir(lcl2)

                }).catch((err) => {
                    console.dir(err)
                })

        }).catch((err) => {
            console.dir(err)
        })
}

mainfunc()


// const recursedata = () => {
//     getdata()
//     setTimeout(function () {
//         getdata()
//     }, 60000);
// }

// recursedata();