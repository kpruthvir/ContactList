var express = require('express');
var router = express.Router();
var db = require('../config/db')

//  Show Contacts
router.get('/', (req, res) => {
    //let sql = 'SELECT * FROM (contact JOIN address JOIN phone) WHERE contact.Contact_id=address.Contact_id AND contact.Contact_id=phone.Contact_id AND phone.Contact_id=address.Contact_id';// AND phone.Phone_type=address.Address_type';
    //let sql = 'SELECT contact.Contact_id,Fname,Mname,Lname,Address_type,Address,City,State,Zip,Phone_type,Area_code,Number,Date_type,Date FROM contact LEFT JOIN address ON contact.Contact_id=address.Contact_id LEFT JOIN phone ON phone.Contact_id=address.Contact_id LEFT JOIN date ON phone.Contact_id=date.Contact_id order by contact.Contact_id';
    let sql = 'select * from contact; select * from address; select * from phone; select * from date';
    db.query(sql, (err, rows, fields) => {
        if(err) console.log(err);
        console.log(rows[1]);
        console.log(rows[2]);
        //res.send(rows);
        res.render('contacts', {title: ' Contact Names', items: rows})
    })
});

router.post('/submitNewAddress', (req,res) => {
    //console.log("paramas id is: "+req.params.id);
    let cid= req.body.addrContact_id;
    let sql = `INSERT INTO address values (null, ${cid}, '${ req.body.Address_type }', '${ req.body.Address }', '${ req.body.City }', '${ req.body.State }', '${ req.body.Zip }')`;
    console.log(sql, "addr cid is :", cid);
    console.log(req.body);
    db.query(sql, (err, result) => {
        if(err){
        console.log(err);
        res.render('error',{title:"error", message:"add new adress unsuccessfull"})
        }
        else{
            console.log(result);
            //res.send(res);
            res.redirect('/contacts');
        }
    })
});

router.post('/submitNewPhone', (req,res) => {
    let cid= req.body.phnContact_id;
    let sql = `INSERT INTO phone values (null, ${cid}, '${ req.body.Phone_type }', '${ req.body.Area_code }', '${ req.body.Number }' )`;
    console.log(sql, "cid in phn is :", cid);
    console.log(req.body);
    db.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            res.render('error',{title:"error", message:"add new phone unsuccessfull"})
        }
        else{
            console.log(result);
            //res.send(res);
            res.redirect('/contacts');
        }
    })
})

router.post('/submitNewDate', (req,res) => {
    let cid= req.body.dtContact_id;
    let sql = `INSERT INTO date values (null, ${cid}, '${ req.body.Date_type }', '${ req.body.Date }' )`;
    console.log(sql+"cid in date is :"+cid);
    db.query(sql, (err, result) => {
        if(err){
             console.log(err);
             res.render('error',{title:"error", message:"add new date unsuccessfull"})
            }
        else{
            console.log(result);
            //res.send(res);
            res.redirect('/contacts');
        }
    })
});

// TODO err references foreign key
//to deletecontact with id
router.post('/deletecontact/:id', (req,res) => {
    var del_id = req.params.id;
    
    let sql=`DELETE FROM contact WHERE contact_id=${del_id}`;
    db.query(sql, (err, rows, fields) => {
        if(err)
            console.log(err);
        //res.render('index', {title: "delete", message: "Delete succesful"})
        else{
            console.log("deleted contact with id:", del_id)
            res.redirect('/contacts');
        }
    })
});

//to deleteaddress with id
router.post('/deleteaddress/:id', (req,res) => {
    var del_id = req.params.id;
    
    let sql=`DELETE FROM address WHERE Address_id=${del_id} `;
    db.query(sql, (err, rows, fields) => {
        if(err){
            console.log(err);
            res.render('error',{title:"error", message:"delete address unsuccessfull"})
           }
       else{
           console.log("deleted address with id:",del_id)
           res.redirect('/contacts');
        }
    })
});

//to deletephone with id
router.post('/deletephone/:id', (req,res) => {
    var del_id = req.params.id;
    
    let sql=`DELETE FROM phone WHERE Phone_id=${del_id}`;
    db.query(sql, (err, rows, fields) => {
        if(err){
            console.log(err);
            res.render('error',{title:"error", message:"delete phone unsuccessfull"})
           }
       else{
           console.log(rows+" deleted phone with id:",del_id)
           res.redirect('/contacts');
        }
    })
});

//to deletedate with id
router.post('/deletedate/:id', (req,res) => {
    var del_id = req.params.id;
    
    let sql=`DELETE FROM date WHERE Date_id=${del_id}`;
    db.query(sql, (err, rows, fields) => {
        if(err){
            console.log(err);
            res.render('error',{title:"error", message:"delete date unsuccessfull"})
        }
       else{
           console.log("deleted date with id:",del_id)
           res.redirect('/contacts');
        }
    })
});



// update contact with id
router.get('/updatecontact/:id', (req, res) => {
    // console.log("from updatecontact:"+req.params.id)
    // let sql2= `SELECT * FROM contact LEFT JOIN address ON contact.Contact_id=address.Contact_id LEFT JOIN phone ON phone.Contact_id=address.Contact_id LEFT JOIN date ON phone.Contact_id=date.Contact_id WHERE contact.Contact_id = ${req.params.id}`;
    let sql3= `SELECT * FROM contact WHERE contact.Contact_id= ${req.params.id}; SELECT * FROM address WHERE address.Contact_id=${req.params.id} ; SELECT * FROM phone WHERE phone.Contact_id=${req.params.id} ; SELECT * FROM date WHERE date.Contact_id=${req.params.id} `;
    //let sql = `SELECT * FROM contact WHERE contact.Contact_id = ${req.params.id}`;
    db.query(sql3, (err, rows, fields) => {
        if(err) 
            console.log(err);
        //console.log(rows);
        
        else{
        console.log(rows);
        //res.send(rows);
        res.render('updatecontact', { title: 'Update contact', items: rows });
        }
    })
});

// update a contact     
router.post('/update', (req, res) => {
    console.log(req.body);
    //update name
    let sql = `UPDATE contact SET Fname='${req.body.Fname}', Mname='${req.body.Mname}', Lname='${req.body.Lname}' WHERE Contact_id='${req.body.Contact_id}' `;
    db.query(sql, (err, rows, fields) => {
        if(err)
            console.log("Error updating Contact name: "+err)
    })

    var arrcheck = Array.isArray(req.body.Address_id);
        //update address
    if(typeof req.body.Address_id !== 'undefined')     // if not undefined i.e address is present
    {
        if(Array.isArray(req.body.Address_id))     // if array update multiple
        {
            for (let index = 0; index < req.body.Address_id.length; index++) {
                const element = req.body.Address_id[index];
                //console.log('in for: '+element,req.body.Address[index])
                
                let sql = `UPDATE address SET Address_type='${req.body.Address_type[index]}', Address='${req.body.Address[index]}', City='${req.body.City[index]}', State='${req.body.State[index]}', Zip='${req.body.Zip[index]}' WHERE Address_id='${req.body.Address_id[index]}' `;
                db.query(sql, (err, rows, fields) => {
                    if(err)
                        console.log(err)
                    else
                        console.log(sql+"updated address with id: ", element)
                        //res.render('index', {title:"update", message:"success"})
                })
            }
        }
        else {
            let sql = `UPDATE address SET Address_type='${req.body.Address_type}', Address='${req.body.Address}', City='${req.body.City}', State='${req.body.State}', Zip='${req.body.Zip}' WHERE Address_id='${req.body.Address_id}' `;
            db.query(sql, (err, rows, fields) => {
                if(err)
                    console.log(err)
                else
                    console.log(sql+"updated address with id: ", req.body.Address_id);
            })
        }
    }
    // update phone
    if(typeof req.body.Phone_id !== 'undefined')     // if not undefined i.e phone is present
    {
        if(Array.isArray(req.body.Phone_id))     // if array update multiple
        {
            for (let i= 0; i < req.body.Phone_id.length; i++) {
                const element = req.body.Phone_id[i];
                let sql = `UPDATE phone SET Phone_type='${req.body.Phone_type[i]}', Area_code=${req.body.Area_code[i]}, Number=${req.body.Number[i]} WHERE Phone_id='${req.body.Phone_id[i]}' `;
                db.query(sql, (err, rows, fields) => {
                    if(err)
                        console.log(err)
                    else
                        console.log(sql+"updated phone with id: ", element, rows)
                        //res.render('index', {title:"update", message:"success"})
                })
            }
        }
        else {
            let sql = `UPDATE phone SET Phone_type='${req.body.Phone_type}', Area_code=${req.body.Area_code}, Number=${req.body.Number} WHERE Phone_id='${req.body.Phone_id}' `;
                db.query(sql, (err, rows, fields) => {
                    if(err)
                        console.log(err)
                    else
                        console.log(sql+"updated phone with id: ", req.body.Phone_id, rows)
                        //res.render('index', {title:"update", message:"success"})
                })
        }
    }
        
    // update date
    if(typeof req.body.Date_id !== 'undefined')     // if not undefined i.e date is present
    {
        if(Array.isArray(req.body.Date_id))     // if array update multiple
        {
            for (let i= 0; i < req.body.Date_id.length; i++) {
                const element = req.body.Date_id[i];
                let sql = `UPDATE date SET Date_type='${req.body.Date_type[i]}', Date='${req.body.Date[i]}' WHERE Date_id='${req.body.Date_id[i]}' `;
                db.query(sql, (err, rows, fields) => {
                    if(err)
                        console.log(err)
                    else
                        console.log(sql+"updated date with id: ", element, rows)
                        //res.render('index', {title:"update", message:"success"})
                })
            }
        }
        else
        {
            let sql = `UPDATE date SET Date_type='${req.body.Date_type}', Date='${req.body.Date}' WHERE Date_id='${req.body.Date_id}' `;
                db.query(sql, (err, rows, fields) => {
                    if(err)
                        console.log(err)
                    else
                        console.log(sql+"updated date with id: ",req.body.Date_id, rows)
                        //res.render('index', {title:"update", message:"success"})
                })
        }
    }
    //res.send(req.body);
    // if(err) res.render('index', {title:"update", message:"error"})
    // else
        res.redirect('/contacts')
})

// Show contact with id
router.get('/:Contact_id', (req, res) => {
    let sql = `SELECT * FROM contact WHERE Contact_id = ${req.params.Contact_id}`;
    db.query(sql, (err, rows, fields) => {
        if(err) 
            console.log(err);
        console.log(rows);
        res.send(rows);
    })
});

module.exports = router